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
        private readonly IWebHostEnvironment _env; // Para guardar archivos

        public PartidosController(TaraguyDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Partidos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Partido>>> GetPartidos()
        {
            return await _context.Partidos.OrderBy(p => p.FechaHora).ToListAsync();
        }

        // GET: api/Partidos/proximo
        [HttpGet("proximo")]
        public async Task<ActionResult<Partido>> GetProximo()
        {
            var hoy = DateTime.Now;
            var partido = await _context.Partidos
                .Where(p => p.FechaHora > hoy)
                .OrderBy(p => p.FechaHora)
                .FirstOrDefaultAsync();

            if (partido == null) return NoContent();
            return partido;
        }

        // POST: api/Partidos (AHORA CON SUBIDA DE FOTOS)
        [HttpPost]
        public async Task<ActionResult<Partido>> PostPartido([FromForm] PartidoDto dto)
        {
            try
            {
                // 1. Validaciones
                if (string.IsNullOrEmpty(dto.Rival)) return BadRequest("Falta el rival");

                // 2. Manejo de la Imagen (Si subieron una)
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

                // 3. Crear el objeto
                var partido = new Partido
                {
                    Rival = dto.Rival,
                    FechaHora = dto.Fecha,
                    Lugar = dto.Lugar,
                    Resultado = dto.Resultado,
                    Disciplina = dto.Disciplina ?? "Rugby",
                    Categoria = dto.Categoria ?? "Primera",
                    EscudoRivalUrl = rutaImagen // Guardamos la ruta del archivo o null
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

        // DELETE: api/Partidos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePartido(int id)
        {
            var partido = await _context.Partidos.FindAsync(id);
            if (partido == null) return NotFound();

            _context.Partidos.Remove(partido);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PUT: Actualizar resultado
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPartido(int id, Partido partido)
        {
            if (id != partido.Id) return BadRequest();
            _context.Entry(partido).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    // DTO PARA RECIBIR DATOS + ARCHIVO
    public class PartidoDto
    {
        public string Rival { get; set; }
        public DateTime Fecha { get; set; }
        public string Lugar { get; set; }
        public string? Resultado { get; set; }
        public string? Disciplina { get; set; }
        public string? Categoria { get; set; }
        public IFormFile? Imagen { get; set; } // Acá llega la foto
    }
}