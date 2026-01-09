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
    public class PartidosController : ControllerBase
    {
        private readonly TaraguyDbContext _context;
        private readonly IWebHostEnvironment _env;

        public PartidosController(TaraguyDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Partido>>> GetPartidos()
        {
            return await _context.Partidos.OrderBy(p => p.FechaHora).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Partido>> PostPartido([FromForm] PartidoDto dto)
        {
            try
            {
                if (string.IsNullOrEmpty(dto.Rival)) return BadRequest("Falta el rival");

                string rutaImagen = null;
                if (dto.Imagen != null)
                {
                    string webRootPath = _env.WebRootPath ?? _env.ContentRootPath;
                    // Guardamos en 'img' para que sea igual que productos
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

                var partido = new Partido
                {
                    Rival = dto.Rival,
                    FechaHora = dto.Fecha,
                    Lugar = dto.Lugar,
                    Resultado = dto.Resultado,
                    Disciplina = dto.Disciplina ?? "Rugby",
                    Categoria = dto.Categoria ?? "Primera",
                    EscudoRivalUrl = rutaImagen
                };

                _context.Partidos.Add(partido);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetPartidos", new { id = partido.Id }, partido);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al guardar: " + ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPartido(int id, Partido partido)
        {
            if (id != partido.Id) return BadRequest();
            _context.Entry(partido).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePartido(int id)
        {
            var partido = await _context.Partidos.FindAsync(id);
            if (partido == null) return NotFound();
            _context.Partidos.Remove(partido);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public class PartidoDto
    {
        public string Rival { get; set; }
        public DateTime Fecha { get; set; }
        public string Lugar { get; set; }
        public string? Resultado { get; set; }
        public string? Disciplina { get; set; }
        public string? Categoria { get; set; }
        public IFormFile? Imagen { get; set; }
    }
}