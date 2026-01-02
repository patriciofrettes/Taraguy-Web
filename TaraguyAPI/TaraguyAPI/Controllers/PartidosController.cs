using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        public PartidosController(TaraguyDbContext context)
        {
            _context = context;
        }

        // GET: Proximo partido
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

        // GET: Historial
        [HttpGet("resultados")]
        public async Task<ActionResult<IEnumerable<Partido>>> GetResultados()
        {
            var hoy = DateTime.Now;
            return await _context.Partidos
                .Where(p => p.FechaHora <= hoy)
                .OrderByDescending(p => p.FechaHora)
                .Take(5)
                .ToListAsync();
        }

        // GET: Todos (Admin)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Partido>>> GetPartidos()
        {
            return await _context.Partidos.OrderByDescending(p => p.FechaHora).ToListAsync();
        }

        // POST: Crear Partido (Protegido)
        [HttpPost]
        public async Task<ActionResult<Partido>> PostPartido(Partido partido)
        {
            try
            {
                // Validación básica
                if (string.IsNullOrEmpty(partido.Rival)) return BadRequest("El rival es obligatorio");

                // Asegurar que la fecha sea UTC si Azure da problemas de zona horaria
                if (partido.FechaHora == default) partido.FechaHora = DateTime.Now;

                _context.Partidos.Add(partido);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetPartido", new { id = partido.Id }, partido);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al guardar partido: " + ex.Message);
            }
        }

        // DELETE: Borrar Partido
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePartido(int id)
        {
            var partido = await _context.Partidos.FindAsync(id);
            if (partido == null) return NotFound();

            _context.Partidos.Remove(partido);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Helper
        [HttpGet("{id}")]
        public async Task<ActionResult<Partido>> GetPartido(int id)
        {
            var partido = await _context.Partidos.FindAsync(id);
            if (partido == null) return NotFound();
            return partido;
        }
    }
}