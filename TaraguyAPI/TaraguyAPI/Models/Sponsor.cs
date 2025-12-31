using System;
using System.Collections.Generic;

namespace TaraguyAPI.Models;

public partial class Sponsor
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public string LogoUrl { get; set; } = null!;

    public string? LinkWeb { get; set; }

    public bool? Activo { get; set; }

    public int? Orden { get; set; }
}
