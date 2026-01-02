using System;
using System.Collections.Generic;
using System.IO; // Necesario para manejar archivos
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting; // Necesario para el entorno web
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaraguyAPI.Models;

namespace TaraguyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoticiasController : ControllerBase
    {
        private readonly TaraguyDbContext _context;
        private readonly IWebHostEnvironment _env; // Para manejar la carpeta de subidas

        public NoticiasController(TaraguyDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Noticias (Ultimas 3)
        [HttpGet("ultimas")]
        public async Task<ActionResult<IEnumerable<Noticia>>> GetUltimas()
        {
            return await _context.Noticias
                .OrderByDescending(n => n.FechaPublicacion)
                .Take(3)
                .ToListAsync();
        }

        // GET: api/Noticias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Noticia>>> GetNoticias()
        {
            return await _context.Noticias
                .OrderByDescending(n => n.FechaPublicacion) // Ordenamos siempre por fecha
                .ToListAsync();
        }

        // GET: api/Noticias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Noticia>> GetNoticia(int id)
        {
            var noticia = await _context.Noticias.FindAsync(id);
            if (noticia == null) return NotFound();
            return noticia;
        }

        // POST: api/Noticias (AHORA SOPORTA FOTOS)
        [HttpPost]
        public async Task<ActionResult<Noticia>> PostNoticia([FromForm] NoticiaDto dto)
        {
            try
            {
                // 1. Manejo de la Imagen (Lógica compatible con Azure)
                string rutaImagen = null;
                if (dto.Imagen != null)
                {
                    string webRootPath = _env.WebRootPath ?? _env.ContentRootPath;
                    string folder = Path.Combine(webRootPath, "wwwroot", "uploads");

                    if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                    string nombreArchivo = Guid.NewGuid().ToString() + Path.GetExtension(dto.Imagen.FileName);
                    string rutaCompleta = Path.Combine(folder, nombreArchivo);

                    using (var stream = new FileStream(rutaCompleta, FileMode.Create))
                    {
                        await dto.Imagen.CopyToAsync(stream);
                    }
                    rutaImagen = "/uploads/" + nombreArchivo;
                }

                // 2. Crear Objeto Noticia
                var noticia = new Noticia
                {
                    Titulo = dto.Titulo,
                    Copete = dto.Copete,
                    Cuerpo = dto.Cuerpo,
                    Autor = dto.Autor,
                    FechaPublicacion = DateTime.UtcNow, // Usamos hora universal
                    ImagenUrl = rutaImagen ?? "/img/default_news.png"
                };

                _context.Noticias.Add(noticia);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetNoticia", new { id = noticia.Id }, noticia);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error interno al crear noticia: " + ex.Message);
            }
        }

        // DELETE: api/Noticias/5
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

    // DTO PARA RECIBIR DATOS + FOTO
    public class NoticiaDto
    {
        public string Titulo { get; set; }
        public string Copete { get; set; }
        public string Cuerpo { get; set; }
        public string Autor { get; set; }
        public IFormFile? Imagen { get; set; }
    }
}