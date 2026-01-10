using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// 1. FIX FECHAS
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// 2. DB
var connectionString = builder.Configuration.GetConnectionString("CadenaConexionTaraguy");
builder.Services.AddDbContext<TaraguyAPI.Models.TaraguyDbContext>(options =>
    options.UseNpgsql(connectionString));

// 3. CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PoliticaTaraguy", app =>
    {
        app.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// -----------------------------------------------------------------------------
// 📷 CONFIGURACIÓN DE IMÁGENES (CORREGIDA) 📷
// -----------------------------------------------------------------------------

// 1. Obtener la ruta REAL de wwwroot que usa Azure
var webRootPath = app.Environment.WebRootPath ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot");

// 2. Asegurar que exista la carpeta 'img' ahí adentro
var imgPath = Path.Combine(webRootPath, "img");
if (!Directory.Exists(imgPath))
{
    Directory.CreateDirectory(imgPath);
}

// 3. Habilitar archivos estáticos (esto usa webRootPath automáticamente)
app.UseStaticFiles();

// -----------------------------------------------------------------------------

app.UseCors("PoliticaTaraguy");
app.UseAuthorization();
app.MapControllers();

app.Run();