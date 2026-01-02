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
            // BLOQUE DE SEGURIDAD (TRY-CATCH)
            try
            {
                // Validaciones básicas
                if (string.IsNullOrWhiteSpace(dto.Nombre)) return BadRequest("El nombre es obligatorio.");
                if (dto.Precio <= 0) return BadRequest("El precio debe ser mayor a 0.");

                // 1. Manejo de la Imagen (CORREGIDO PARA AZURE)
                string rutaImagen = null;
                if (dto.Imagen != null)
                {
                    // Truco: Si WebRootPath es nulo (pasa en Azure), usamos ContentRootPath
                    string webRootPath = _env.WebRootPath ?? _env.ContentRootPath;

                    // Aseguramos que la carpeta exista dentro de wwwroot
                    string folder = Path.Combine(webRootPath, "wwwroot", "uploads");

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

                    rutaImagen = "/uploads/" + nombreArchivo;
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
                    ImagenUrl = rutaImagen ?? "/img/default_product.png"
                };

                _context.Productos.Add(nuevoProducto);

                // Aquí es donde suele explotar si las columnas no coinciden
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetProducto", new { id = nuevoProducto.Id }, nuevoProducto);
            }
            catch (Exception ex)
            {
                // ESTO ES ORO: Devuelve el error real (incluyendo detalles internos)
                var mensajeError = "Error interno: " + ex.Message;
                if (ex.InnerException != null)
                {
                    mensajeError += " | Detalle: " + ex.InnerException.Message;
                }
                return StatusCode(500, mensajeError);
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