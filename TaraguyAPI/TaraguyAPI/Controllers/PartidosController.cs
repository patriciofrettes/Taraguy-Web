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
    public class PartidosController : ControllerBase
    {
        private readonly TaraguyDbContext _context;
        private readonly ImagenService _imagenService;

        public PartidosController(TaraguyDbContext context, ImagenService imagenService)
        {
            _context = context;
            _imagenService = imagenService;
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
                // Subida a Azure
                if (dto.Imagen != null)
                {
                    rutaImagen = await _imagenService.SubirImagenAsync(dto.Imagen);
                }

                var partido = new Partido
                {
                    Rival = dto.Rival,
                    FechaHora = dto.Fecha,
                    Lugar = dto.Lugar,
                    Resultado = dto.Resultado,
                    Disciplina = dto.Disciplina ?? "Rugby",
                    Categoria = dto.Categoria ?? "Primera",
                    EscudoRivalUrl = rutaImagen // URL de Azure
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
        public async Task<IActionResult> PutPartido(int id, [FromForm] PartidoDto dto)
        {
            // Nota: He adaptado el PUT para recibir DTO y soportar cambio de imagen también
            var partido = await _context.Partidos.FindAsync(id);
            if (partido == null) return NotFound();

            partido.Rival = dto.Rival;
            partido.FechaHora = dto.Fecha;
            partido.Lugar = dto.Lugar;
            partido.Resultado = dto.Resultado;
            partido.Disciplina = dto.Disciplina;
            partido.Categoria = dto.Categoria;

            if (dto.Imagen != null)
            {
                partido.EscudoRivalUrl = await _imagenService.SubirImagenAsync(dto.Imagen);
            }

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