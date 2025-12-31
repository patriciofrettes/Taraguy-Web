using Microsoft.AspNetCore.Mvc;
using MercadoPago.Client.Preference;
using MercadoPago.Config;
using MercadoPago.Resource.Preference;
using TaraguyAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace TaraguyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MercadoPagoController : ControllerBase
    {
        private readonly TaraguyDbContext _context;

        public MercadoPagoController(TaraguyDbContext context)
        {
            _context = context;
            // Tu Token de Prueba
            MercadoPagoConfig.AccessToken = "APP_USR-3510248894934818-122916-d5cdafda155793f677b9fc4f63cf46a1-3100407214";
        }

        [HttpPost("crear_preferencia")]
        public async Task<ActionResult> CrearPreferencia([FromBody] OrdenDto ordenDto)
        {
            if (ordenDto.Items == null || ordenDto.Items.Count == 0)
                return BadRequest("El carrito está vacío");

            using var transaction = _context.Database.BeginTransaction();

            try
            {
                // 1. Crear la Orden (Cabecera)
                var nuevaOrden = new Orden
                {
                    Fecha = DateTime.Now,
                    Estado = "PENDIENTE",
                    Total = ordenDto.Total,
                    NombreCliente = ordenDto.DatosCliente.Nombre,
                    ApellidoCliente = ordenDto.DatosCliente.Apellido,
                    Dni = ordenDto.DatosCliente.Dni,
                    Email = ordenDto.DatosCliente.Email,
                    Telefono = ordenDto.DatosCliente.Telefono,
                    TipoEnvio = "RETIRO",
                    Provincia = "Corrientes",
                    Ciudad = "Corrientes",
                    DireccionCalle = "Retiro en Club",
                    CodigoPostal = "3400"
                };

                _context.Ordenes.Add(nuevaOrden);
                await _context.SaveChangesAsync();

                // 2. Procesar Detalles y DESCONTAR STOCK 📉
                foreach (var item in ordenDto.Items)
                {
                    // A) Buscamos el producto real en la base de datos
                    var productoReal = await _context.Productos.FindAsync(item.Id);

                    if (productoReal == null)
                    {
                        throw new Exception($"El producto '{item.Nombre}' ya no existe.");
                    }

                    // B) Verificamos si hay suficiente stock
                    if (productoReal.Stock < item.Cantidad)
                    {
                        throw new Exception($"No hay suficiente stock de '{item.Nombre}'. Quedan: {productoReal.Stock}.");
                    }

                    // C) RESTAMOS EL STOCK
                    productoReal.Stock -= item.Cantidad;

                    // D) Guardamos el detalle de la venta
                    var detalle = new DetalleOrden
                    {
                        OrdenId = nuevaOrden.Id,
                        ProductoId = item.Id,
                        NombreProducto = item.Nombre,
                        Cantidad = item.Cantidad,
                        PrecioUnitario = item.Precio
                    };
                    _context.DetalleOrdenes.Add(detalle);
                }

                // Guardamos los cambios de Stock y Detalles
                await _context.SaveChangesAsync();

                // 3. Notificación por Email (El Cartero) 📧
                try
                {
                    var emailService = new EmailService();
                    string nombreCompleto = $"{ordenDto.DatosCliente.Nombre} {ordenDto.DatosCliente.Apellido}";
                    emailService.EnviarAvisoVenta(nombreCompleto, ordenDto.Total, nuevaOrden.Id.ToString());
                }
                catch (Exception)
                {
                    // Si falla el mail, seguimos adelante
                }

                // 4. Crear Preferencia en Mercado Pago
                var request = new PreferenceRequest
                {
                    Items = ordenDto.Items.Select(i => new PreferenceItemRequest
                    {
                        Title = i.Nombre,
                        Quantity = i.Cantidad,
                        CurrencyId = "ARS",
                        UnitPrice = i.Precio,
                    }).ToList(),
                    BackUrls = new PreferenceBackUrlsRequest
                    {
                        Success = "http://localhost:5173/pago-exitoso",
                        Failure = "http://localhost:5173/carrito",
                        Pending = "http://localhost:5173/carrito"
                    },
                    ExternalReference = nuevaOrden.Id.ToString(),
                    StatementDescriptor = "TARAGUY CLUB",
                };

                var client = new PreferenceClient();
                Preference preference = await client.CreateAsync(request);

                nuevaOrden.MercadoPagoId = preference.Id;
                await _context.SaveChangesAsync();

                // Confirmamos la transacción (Todo salió bien)
                transaction.Commit();

                return Ok(new { url = preference.InitPoint });
            }
            catch (Exception ex)
            {
                // Si algo falló (ej: falta de stock), deshacemos TODO
                transaction.Rollback();

                // Devolvemos el mensaje de error para que el Frontend sepa qué pasó
                return BadRequest(new { razon = ex.Message, detalle = "No se pudo procesar la orden." });
            }
        }
    }

    public class OrdenDto
    {
        public List<CarritoItemDto> Items { get; set; }
        public decimal Total { get; set; }
        public DatosClienteDto DatosCliente { get; set; }
    }
    public class CarritoItemDto { public int Id { get; set; } public string Nombre { get; set; } public int Cantidad { get; set; } public decimal Precio { get; set; } public string ImagenUrl { get; set; } }
    public class DatosClienteDto { public string Nombre { get; set; } public string Apellido { get; set; } public string Dni { get; set; } public string Email { get; set; } public string Telefono { get; set; } }
}