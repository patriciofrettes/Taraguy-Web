using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        // GET: api/Partidos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Partido>>> GetPartidos()
        {
            // Ordenamos por fecha (los más nuevos primero)
            return await _context.Partidos.OrderBy(p => p.FechaHora).ToListAsync();
        }

        // GET: api/Partidos/proximo
        [HttpGet("proximo")]
        public async Task<ActionResult<Partido>> GetProximo()
        {
            var hoy = DateTime.Now;
            // Busca el partido futuro más cercano (sin importar deporte, para el Home)
            var partido = await _context.Partidos
                .Where(p => p.FechaHora > hoy)
                .OrderBy(p => p.FechaHora)
                .FirstOrDefaultAsync();

            if (partido == null) return NoContent();
            return partido;
        }

        // POST: api/Partidos
        [HttpPost]
        public async Task<ActionResult<Partido>> PostPartido(Partido partido)
        {
            try
            {
                if (string.IsNullOrEmpty(partido.Rival)) return BadRequest("Falta el rival");

                // Asegurar valores por defecto si vienen vacíos
                if (string.IsNullOrEmpty(partido.Disciplina)) partido.Disciplina = "Rugby";
                if (string.IsNullOrEmpty(partido.Categoria)) partido.Categoria = "Primera";

                _context.Partidos.Add(partido);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetPartidos", new { id = partido.Id }, partido);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
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

        // PUT: api/Partidos/5 (Para cargar resultados)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPartido(int id, Partido partido)
        {
            if (id != partido.Id) return BadRequest();
            _context.Entry(partido).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}