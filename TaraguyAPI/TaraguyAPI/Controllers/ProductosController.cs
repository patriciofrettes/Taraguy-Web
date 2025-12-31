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
        private readonly IWebHostEnvironment _env; // Para guardar fotos

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

        // POST: api/Productos (CREAR CON FOTO Y TALLES)
        [HttpPost]
        public async Task<ActionResult<Producto>> PostProducto([FromForm] ProductoDto dto)
        {
            // Validaciones
            if (string.IsNullOrWhiteSpace(dto.Nombre)) return BadRequest("El nombre es obligatorio.");
            if (dto.Precio <= 0) return BadRequest("El precio debe ser mayor a 0.");
            if (dto.Stock < 0) return BadRequest("Stock no válido.");

            // 1. Manejo de la Imagen
            string rutaImagen = null;
            if (dto.Imagen != null)
            {
                // Crear carpeta uploads si no existe
                string folder = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                // Nombre único para el archivo
                string nombreArchivo = Guid.NewGuid().ToString() + Path.GetExtension(dto.Imagen.FileName);
                string rutaCompleta = Path.Combine(folder, nombreArchivo);

                using (var stream = new FileStream(rutaCompleta, FileMode.Create))
                {
                    await dto.Imagen.CopyToAsync(stream);
                }

                rutaImagen = "/uploads/" + nombreArchivo;
            }

            // 2. Crear el objeto Producto
            var nuevoProducto = new Producto
            {
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                Precio = dto.Precio,
                Stock = dto.Stock,
                CategoriaProducto = dto.CategoriaProducto,
                Activo = dto.Activo,
                Talles = dto.Talles, // <--- Aquí guardamos los talles
                ImagenUrl = rutaImagen ?? "/img/default_product.png"
            };

            _context.Productos.Add(nuevoProducto);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProducto", new { id = nuevoProducto.Id }, nuevoProducto);
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

    // CLASE AUXILIAR PARA RECIBIR DATOS + ARCHIVO
    public class ProductoDto
    {
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public decimal Precio { get; set; }
        public int Stock { get; set; }
        public string CategoriaProducto { get; set; }
        public bool Activo { get; set; }
        public string? Talles { get; set; } // <--- Talles
        public IFormFile? Imagen { get; set; } // <--- Archivo real
    }
}