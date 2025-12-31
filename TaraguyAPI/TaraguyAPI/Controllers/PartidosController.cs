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

        // --- NUEVO: Trae EL partido que se va a jugar pronto (solo 1) ---
        [HttpGet("proximo")]
        public async Task<ActionResult<Partido>> GetProximo()
        {
            var hoy = DateTime.Now;

            var partido = await _context.Partidos
                .Where(p => p.FechaHora > hoy) // Solo buscamos en el futuro
                .OrderBy(p => p.FechaHora)     // El más cercano a hoy
                .FirstOrDefaultAsync();        // Tomamos el primero

            if (partido == null) return NoContent(); // Si no hay nada, devuelve vacío (204)
            return partido;
        }

        // --- NUEVO: Trae los últimos 5 resultados (Historial) ---
        [HttpGet("resultados")]
        public async Task<ActionResult<IEnumerable<Partido>>> GetResultados()
        {
            var hoy = DateTime.Now;

            return await _context.Partidos
                .Where(p => p.FechaHora <= hoy) // Solo buscamos en el pasado
                .OrderByDescending(p => p.FechaHora) // Del más reciente hacia atrás
                .Take(5) // Solo los últimos 5
                .ToListAsync();
        }
        // -----------------------------------------------------------

        // GET: api/Partidos (Trae TODOS, para el Admin)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Partido>>> GetPartidos()
        {
            return await _context.Partidos.ToListAsync();
        }

        // GET: api/Partidos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Partido>> GetPartido(int id)
        {
            var partido = await _context.Partidos.FindAsync(id);

            if (partido == null)
            {
                return NotFound();
            }

            return partido;
        }

        // PUT: api/Partidos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPartido(int id, Partido partido)
        {
            if (id != partido.Id)
            {
                return BadRequest();
            }

            _context.Entry(partido).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PartidoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Partidos
        [HttpPost]
        public async Task<ActionResult<Partido>> PostPartido(Partido partido)
        {
            _context.Partidos.Add(partido);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPartido", new { id = partido.Id }, partido);
        }

        // DELETE: api/Partidos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePartido(int id)
        {
            var partido = await _context.Partidos.FindAsync(id);
            if (partido == null)
            {
                return NotFound();
            }

            _context.Partidos.Remove(partido);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PartidoExists(int id)
        {
            return _context.Partidos.Any(e => e.Id == id);
        }
    }
}