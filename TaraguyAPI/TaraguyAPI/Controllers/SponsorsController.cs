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
    public class SponsorsController : ControllerBase
    {
        private readonly TaraguyDbContext _context;

        public SponsorsController(TaraguyDbContext context)
        {
            _context = context;
        }

        // GET: api/Sponsors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sponsor>>> GetSponsors()
        {
            return await _context.Sponsors.ToListAsync();
        }

        // GET: api/Sponsors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Sponsor>> GetSponsor(int id)
        {
            var sponsor = await _context.Sponsors.FindAsync(id);

            if (sponsor == null)
            {
                return NotFound();
            }

            return sponsor;
        }

        // PUT: api/Sponsors/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSponsor(int id, Sponsor sponsor)
        {
            if (id != sponsor.Id)
            {
                return BadRequest();
            }

            _context.Entry(sponsor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SponsorExists(id))
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

        // POST: api/Sponsors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Sponsor>> PostSponsor(Sponsor sponsor)
        {
            _context.Sponsors.Add(sponsor);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSponsor", new { id = sponsor.Id }, sponsor);
        }

        // DELETE: api/Sponsors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSponsor(int id)
        {
            var sponsor = await _context.Sponsors.FindAsync(id);
            if (sponsor == null)
            {
                return NotFound();
            }

            _context.Sponsors.Remove(sponsor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SponsorExists(int id)
        {
            return _context.Sponsors.Any(e => e.Id == id);
        }
    }
}
