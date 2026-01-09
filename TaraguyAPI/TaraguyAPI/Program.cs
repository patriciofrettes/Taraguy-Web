using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// 1. ARREGLO DE FECHAS (PostgreSQL vs .NET)
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// 2. BASE DE DATOS
var connectionString = builder.Configuration.GetConnectionString("CadenaConexionTaraguy");
builder.Services.AddDbContext<TaraguyAPI.Models.TaraguyDbContext>(options =>
    options.UseNpgsql(connectionString));

// 3. CORS (Permisos para que React se conecte)
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

// CONFIGURACIÓN DE DESARROLLO
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// -----------------------------------------------------------------------------
// 📷 CONFIGURACIÓN DE IMÁGENES (CARPETA "img") 📷
// -----------------------------------------------------------------------------

// A. Habilitar wwwroot por defecto
app.UseStaticFiles();

// B. Configurar explícitamente la carpeta "img" para asegurar acceso en Azure
var imgFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "img");

// Crear la carpeta si no existe (Azure a veces no la crea sola)
if (!Directory.Exists(imgFolderPath))
{
    Directory.CreateDirectory(imgFolderPath);
}

// C. Mapear la ruta URL "/img" a la carpeta física
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(imgFolderPath),
    RequestPath = "/img"
});
// -----------------------------------------------------------------------------

app.UseCors("PoliticaTaraguy");
app.UseAuthorization();
app.MapControllers();

app.Run();