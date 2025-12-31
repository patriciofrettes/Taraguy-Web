using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TaraguyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagenesController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public ImagenesController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost("subir")]
        public async Task<IActionResult> SubirImagen(IFormFile archivo)
        {
            if (archivo == null || archivo.Length == 0)
                return BadRequest("No se ha enviado ningún archivo.");

            // 1. Crear carpeta "uploads" si no existe dentro de wwwroot
            string carpetaDestino = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(carpetaDestino))
            {
                Directory.CreateDirectory(carpetaDestino);
            }

            // 2. Generar nombre único para evitar duplicados (ej: guid_foto.jpg)
            string nombreArchivo = Guid.NewGuid().ToString() + Path.GetExtension(archivo.FileName);
            string rutaCompleta = Path.Combine(carpetaDestino, nombreArchivo);

            // 3. Guardar el archivo en el disco
            using (var stream = new FileStream(rutaCompleta, FileMode.Create))
            {
                await archivo.CopyToAsync(stream);
            }

            // 4. Devolver la URL pública para que React la use
            // Retorna algo como: /uploads/asdasd-asdasd.jpg
            string urlImagen = $"/uploads/{nombreArchivo}";
            return Ok(new { url = urlImagen });
        }
    }
}