using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaraguyAPI.Models;

namespace TaraguyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly TaraguyDbContext _context;

        public AuthController(TaraguyDbContext context)
        {
            _context = context;
        }

        // Clasecita para recibir los datos del formulario
        public class LoginRequest
        {
            public string Usuario { get; set; }
            public string Password { get; set; }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // 1. Buscar si existe el usuario
            var user = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.NombreUsuario == request.Usuario);

            // 2. Si no existe, error 401
            if (user == null)
            {
                return Unauthorized("Usuario no encontrado.");
            }

            // 3. Verificar contraseña (comparación simple por ahora)
            if (user.PasswordHash != request.Password)
            {
                return Unauthorized("Contraseña incorrecta.");
            }

            // 4. ¡Éxito! Devolvemos los datos (pero NO la contraseña)
            return Ok(new
            {
                mensaje = "Login exitoso",
                usuario = user.NombreUsuario,
                rol = user.Rol
            });
        }
    }
}