using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaraguyAPI.Models;

namespace TaraguyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdenesController : ControllerBase
    {
        private readonly TaraguyDbContext _context;

        public OrdenesController(TaraguyDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Orden>>> GetOrdenes()
        {
            return await _context.Ordenes
                .Include(o => o.Detalles)
                .OrderByDescending(o => o.Fecha)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Orden>> GetOrden(int id)
        {
            var orden = await _context.Ordenes
                .Include(o => o.Detalles)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (orden == null) return NotFound();
            return orden;
        }

        [HttpPost]
        public async Task<ActionResult<Orden>> PostOrden(Orden orden)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                orden.Fecha = DateTime.Now;
                orden.Estado = "PENDIENTE";

                if (orden.Detalles != null)
                {
                    foreach (var detalle in orden.Detalles)
                    {
                        var producto = await _context.Productos.FindAsync(detalle.ProductoId);
                        if (producto == null || producto.Stock < detalle.Cantidad)
                        {
                            return BadRequest(new { mensaje = $"Stock insuficiente para {producto?.Nombre ?? "un producto"}" });
                        }
                        producto.Stock -= detalle.Cantidad;
                        detalle.PrecioUnitario = producto.Precio;
                    }
                }

                _context.Ordenes.Add(orden);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetOrden), new { id = orden.Id }, orden);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { mensaje = "Error al procesar la orden", detalle = ex.Message });
            }
        }

        [HttpPut("{id}/estado")]
        public async Task<IActionResult> ActualizarEstado(int id, [FromBody] EstadoUpdate request)
        {
            var orden = await _context.Ordenes.FindAsync(id);
            if (orden == null) return NotFound();

            orden.Estado = request.Estado;
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Estado actualizado correctamente" });
        }

        public class EstadoUpdate
        {
            public string Estado { get; set; } = string.Empty;
        }
    }
}