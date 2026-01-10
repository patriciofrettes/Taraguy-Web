using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaraguyAPI.Models;
using TaraguyAPI.Services; // Namespace correcto según tu carpeta

namespace TaraguyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoticiasController : ControllerBase
    {
        private readonly TaraguyDbContext _context;
        private readonly ImagenService _imagenService; // 1. Servicio

        // 2. Inyección
        public NoticiasController(TaraguyDbContext context, ImagenService imagenService)
        {
            _context = context;
            _imagenService = imagenService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Noticia>>> GetNoticias()
        {
            return await _context.Noticias.OrderByDescending(n => n.FechaPublicacion).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Noticia>> GetNoticia(int id)
        {
            var noticia = await _context.Noticias.FindAsync(id);
            if (noticia == null) return NotFound();
            return noticia;
        }

        [HttpPost]
        public async Task<ActionResult<Noticia>> PostNoticia([FromForm] NoticiaDto dto)
        {
            try
            {
                if (string.IsNullOrEmpty(dto.Titulo)) return BadRequest("El título es obligatorio");

                string rutaImagen = null;

                // 3. Subida a Azure
                if (dto.Imagen != null)
                {
                    rutaImagen = await _imagenService.SubirImagenAsync(dto.Imagen);
                }

                var noticia = new Noticia
                {
                    Titulo = dto.Titulo,
                    Copete = dto.Copete,
                    Cuerpo = dto.Cuerpo,
                    FechaPublicacion = DateTime.Now,
                    // Si rutaImagen es null, usa la default local, sino la URL de Azure
                    ImagenUrl = rutaImagen ?? "/img/default_news.png"
                };

                _context.Noticias.Add(noticia);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetNoticia", new { id = noticia.Id }, noticia);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNoticia(int id)
        {
            var noticia = await _context.Noticias.FindAsync(id);
            if (noticia == null) return NotFound();
            _context.Noticias.Remove(noticia);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public class NoticiaDto
    {
        public string Titulo { get; set; }
        public string Copete { get; set; }
        public string Cuerpo { get; set; }
        public IFormFile? Imagen { get; set; }
    }
}