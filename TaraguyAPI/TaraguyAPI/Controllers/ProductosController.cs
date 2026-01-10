using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaraguyAPI.Models;
using TaraguyAPI.Services; // Namespace correcto

namespace TaraguyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly TaraguyDbContext _context;
        private readonly ImagenService _imagenService;

        public ProductosController(TaraguyDbContext context, ImagenService imagenService)
        {
            _context = context;
            _imagenService = imagenService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            return await _context.Productos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null) return NotFound();
            return producto;
        }

        [HttpPost]
        public async Task<ActionResult<Producto>> PostProducto([FromForm] ProductoDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.Nombre)) return BadRequest("El nombre es obligatorio.");
                if (dto.Precio <= 0) return BadRequest("El precio debe ser mayor a 0.");

                string rutaImagen = null;
                // Subida a Azure
                if (dto.Imagen != null)
                {
                    rutaImagen = await _imagenService.SubirImagenAsync(dto.Imagen);
                }

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
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetProducto", new { id = nuevoProducto.Id }, nuevoProducto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProducto(int id, [FromForm] ProductoDto dto)
        {
            var productoExistente = await _context.Productos.FindAsync(id);
            if (productoExistente == null) return NotFound();

            try
            {
                productoExistente.Nombre = dto.Nombre;
                productoExistente.Descripcion = dto.Descripcion;
                productoExistente.Precio = dto.Precio;
                productoExistente.Stock = dto.Stock;
                productoExistente.CategoriaProducto = dto.CategoriaProducto;
                productoExistente.Activo = dto.Activo;
                productoExistente.Talles = dto.Talles;

                // Subida a Azure al editar
                if (dto.Imagen != null)
                {
                    productoExistente.ImagenUrl = await _imagenService.SubirImagenAsync(dto.Imagen);
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