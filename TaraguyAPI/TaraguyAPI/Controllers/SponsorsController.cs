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
    public class SponsorsController : ControllerBase
    {
        private readonly TaraguyDbContext _context;
        private readonly ImagenService _imagenService;

        public SponsorsController(TaraguyDbContext context, ImagenService imagenService)
        {
            _context = context;
            _imagenService = imagenService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sponsor>>> GetSponsors()
        {
            return await _context.Sponsors
                .Where(s => s.Activo == true)
                .OrderBy(s => s.Orden)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Sponsor>> GetSponsor(int id)
        {
            var sponsor = await _context.Sponsors.FindAsync(id);
            if (sponsor == null) return NotFound();
            return sponsor;
        }

        [HttpPost]
        public async Task<ActionResult<Sponsor>> PostSponsor([FromForm] SponsorDto dto)
        {
            try
            {
                string rutaImagen = null;
                // Subida a Azure
                if (dto.Logo != null)
                {
                    rutaImagen = await _imagenService.SubirImagenAsync(dto.Logo);
                }

                var sponsor = new Sponsor
                {
                    Nombre = dto.Nombre ?? "Nuevo Sponsor",
                    LogoUrl = rutaImagen ?? "/img/default_sponsor.png",
                    LinkWeb = dto.LinkWeb,
                    Activo = true,
                    Orden = dto.Orden ?? 0
                };

                _context.Sponsors.Add(sponsor);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetSponsor", new { id = sponsor.Id }, sponsor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSponsor(int id)
        {
            var sponsor = await _context.Sponsors.FindAsync(id);
            if (sponsor == null) return NotFound();
            _context.Sponsors.Remove(sponsor);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public class SponsorDto
    {
        public string? Nombre { get; set; }
        public string? LinkWeb { get; set; }
        public int? Orden { get; set; }
        public IFormFile? Logo { get; set; }
    }
}