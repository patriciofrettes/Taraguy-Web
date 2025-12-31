using System;
using System.Collections.Generic;

namespace TaraguyAPI.Models;

public partial class Noticia
{
    public int Id { get; set; }

    public string Titulo { get; set; } = null!;

    public string? Copete { get; set; }

    public string Cuerpo { get; set; } = null!;

    public string? ImagenUrl { get; set; }

    public DateTime? FechaPublicacion { get; set; }

    public bool? EsDestacada { get; set; }

    public int? CategoriaId { get; set; }

    public virtual Categoria? Categoria { get; set; }
}
