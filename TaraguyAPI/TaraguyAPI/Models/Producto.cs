using System;
using System.Collections.Generic;

namespace TaraguyAPI.Models;

public partial class Producto
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public decimal Precio { get; set; }

    public int? Stock { get; set; }

    public string? ImagenUrl { get; set; }

    public string? CategoriaProducto { get; set; }

    public bool? Activo { get; set; }
    public string? Talles { get; set; }

    public virtual ICollection<DetalleVenta> DetalleVenta { get; set; } = new List<DetalleVenta>();
}
