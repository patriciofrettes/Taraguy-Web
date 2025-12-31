using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------
// 1. SOLUCIÓN AL ERROR DE FECHA (DateTime)
// Esta línea mágica arregla el conflicto de zonas horarias entre .NET y Postgres
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
// ---------------------------------------------------------

// 2. Configuración de la Base de Datos
var connectionString = builder.Configuration.GetConnectionString("CadenaConexionTaraguy");
builder.Services.AddDbContext<TaraguyAPI.Models.TaraguyDbContext>(options =>
    options.UseNpgsql(connectionString));

// 3. SERVICIOS CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PoliticaTaraguy", app =>
    {
        app.AllowAnyOrigin()
           .AllowAnyHeader()
           .AllowAnyMethod();
    });
});

// Add services to the container.
builder.Services.AddControllers();

// 4. CONFIGURACIÓN DE SWAGGER
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ---------------------------------------------------------
// 5. SOLUCIÓN PARA VER IMÁGENES (UseStaticFiles)
// Esto permite que el navegador vea las fotos de la carpeta wwwroot
app.UseStaticFiles();
// ---------------------------------------------------------

app.UseCors("PoliticaTaraguy");

app.UseAuthorization();

app.MapControllers();

app.Run();