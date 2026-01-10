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
    public class NoticiasController : ControllerBase
    {
        private readonly TaraguyDbContext _context;
        private readonly IWebHostEnvironment _env;

        public NoticiasController(TaraguyDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
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
                if (dto.Imagen != null)
                {
                    string webRootPath = _env.WebRootPath ?? _env.ContentRootPath;
                    // Guardamos en la carpeta 'img'
                    string folder = Path.Combine(webRootPath, "wwwroot", "img");

                    if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                    string nombreArchivo = Guid.NewGuid().ToString() + Path.GetExtension(dto.Imagen.FileName);
                    string rutaCompleta = Path.Combine(folder, nombreArchivo);

                    using (var stream = new FileStream(rutaCompleta, FileMode.Create))
                    {
                        await dto.Imagen.CopyToAsync(stream);
                    }
                    rutaImagen = "/img/" + nombreArchivo;
                }

                var noticia = new Noticia
                {
                    Titulo = dto.Titulo,
                    Copete = dto.Copete,
                    Cuerpo = dto.Cuerpo,
                    FechaPublicacion = DateTime.Now,
                    // Autor = "Administrador",  <-- ESTA LINEA LA BORRAMOS PORQUE TU BD NO LA TIENE
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