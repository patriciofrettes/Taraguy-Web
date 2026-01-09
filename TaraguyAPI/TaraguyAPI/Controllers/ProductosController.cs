using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaraguyAPI.Models;

namespace TaraguyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly TaraguyDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductosController(TaraguyDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Productos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            return await _context.Productos.ToListAsync();
        }

        // GET: api/Productos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null) return NotFound();
            return producto;
        }

        // POST: api/Productos (CREAR)
        [HttpPost]
        public async Task<ActionResult<Producto>> PostProducto([FromForm] ProductoDto dto)
        {
            try
            {
                // Validaciones básicas
                if (string.IsNullOrWhiteSpace(dto.Nombre)) return BadRequest("El nombre es obligatorio.");
                if (dto.Precio <= 0) return BadRequest("El precio debe ser mayor a 0.");

                // 1. Manejo de la Imagen (MODIFICADO PARA USAR CARPETA 'img' 📸)
                string rutaImagen = null;
                if (dto.Imagen != null)
                {
                    string webRootPath = _env.WebRootPath ?? _env.ContentRootPath;

                    // CAMBIO AQUÍ: Usamos "img" en lugar de "uploads"
                    string folder = Path.Combine(webRootPath, "wwwroot", "img");

                    // Si no existe la carpeta, la creamos
                    if (!Directory.Exists(folder))
                    {
                        Directory.CreateDirectory(folder);
                    }

                    // Nombre único
                    string nombreArchivo = Guid.NewGuid().ToString() + Path.GetExtension(dto.Imagen.FileName);
                    string rutaCompleta = Path.Combine(folder, nombreArchivo);

                    using (var stream = new FileStream(rutaCompleta, FileMode.Create))
                    {
                        await dto.Imagen.CopyToAsync(stream);
                    }

                    // CAMBIO AQUÍ: La URL empieza con /img/
                    rutaImagen = "/img/" + nombreArchivo;
                }

                // 2. Crear el objeto
                var nuevoProducto = new Producto
                {
                    Nombre = dto.Nombre,
                    Descripcion = dto.Descripcion,
                    Precio = dto.Precio,
                    Stock = dto.Stock,
                    CategoriaProducto = dto.CategoriaProducto,
                    Activo = dto.Activo,
                    Talles = dto.Talles,
                    // Si no hay foto, usa una por defecto de la carpeta img
                    ImagenUrl = rutaImagen ?? "/img/default_product.png"
                };

                _context.Productos.Add(nuevoProducto);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetProducto", new { id = nuevoProducto.Id }, nuevoProducto);
            }
            catch (Exception ex)
            {
                var mensajeError = "Error interno: " + ex.Message;
                if (ex.InnerException != null)
                {
                    mensajeError += " | Detalle: " + ex.InnerException.Message;
                }
                return StatusCode(500, mensajeError);
            }
        }

        // PUT: api/Productos/5 (EDITAR) - AGREGADO PARA QUE FUNCIONE EL ADMIN
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProducto(int id, [FromForm] ProductoDto dto)
        {
            var productoExistente = await _context.Productos.FindAsync(id);
            if (productoExistente == null) return NotFound();

            try
            {
                // Actualizamos datos básicos
                productoExistente.Nombre = dto.Nombre;
                productoExistente.Descripcion = dto.Descripcion;
                productoExistente.Precio = dto.Precio;
                productoExistente.Stock = dto.Stock;
                productoExistente.CategoriaProducto = dto.CategoriaProducto;
                productoExistente.Activo = dto.Activo;
                productoExistente.Talles = dto.Talles;

                // Si viene una imagen NUEVA, la guardamos en la carpeta 'img'
                if (dto.Imagen != null)
                {
                    string webRootPath = _env.WebRootPath ?? _env.ContentRootPath;
                    string folder = Path.Combine(webRootPath, "wwwroot", "img");

                    if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                    string nombreArchivo = Guid.NewGuid().ToString() + Path.GetExtension(dto.Imagen.FileName);
                    string rutaCompleta = Path.Combine(folder, nombreArchivo);

                    using (var stream = new FileStream(rutaCompleta, FileMode.Create))
                    {
                        await dto.Imagen.CopyToAsync(stream);
                    }

                    productoExistente.ImagenUrl = "/img/" + nombreArchivo;
                }

                _context.Entry(productoExistente).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al actualizar: " + ex.Message);
            }
        }

        // DELETE: api/Productos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null) return NotFound();

            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public class ProductoDto
    {
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public decimal Precio { get; set; }
        public int Stock { get; set; }
        public string CategoriaProducto { get; set; }
        public bool Activo { get; set; }
        public string? Talles { get; set; }
        public IFormFile? Imagen { get; set; }
    }
}