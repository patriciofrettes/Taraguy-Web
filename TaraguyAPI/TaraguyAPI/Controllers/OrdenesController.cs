using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaraguyAPI.Models;

namespace TaraguyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdenesController : ControllerBase
    {
        private readonly TaraguyDbContext _context;

        public OrdenesController(TaraguyDbContext context)
        {
            _context = context;
        }

        // GET: api/Ordenes
        // Este método trae TODAS las ventas para mostrarlas en la tabla del Admin
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Orden>>> GetOrdenes()
        {
            return await _context.Ordenes
                .Include(o => o.Detalles) // ¡Importante! Trae los productos dentro de la orden
                .OrderByDescending(o => o.Fecha) // Muestra las más nuevas primero
                .ToListAsync();
        }

        // PUT: api/Ordenes/5/estado
        // Sirve para que desde el Admin cambies el estado (ej: de "Pendiente" a "Entregado")
        [HttpPut("{id}/estado")]
        public async Task<IActionResult> ActualizarEstado(int id, [FromBody] EstadoUpdate request)
        {
            var orden = await _context.Ordenes.FindAsync(id);
            if (orden == null) return NotFound();

            orden.Estado = request.Estado;
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Estado actualizado correctamente" });
        }

        // Clase auxiliar para recibir el dato del estado
        public class EstadoUpdate
        {
            public string Estado { get; set; }
        }
    }
}