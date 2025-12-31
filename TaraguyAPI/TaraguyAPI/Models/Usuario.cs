using System;
using System.Collections.Generic;

namespace TaraguyAPI.Models;

public partial class Usuario
{
    public int Id { get; set; }

    public string NombreUsuario { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string? Rol { get; set; }

    public DateTime? FechaCreacion { get; set; }
}
