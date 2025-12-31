using System;
using System.Collections.Generic;

namespace TaraguyAPI.Models;

public partial class Venta
{
    public int Id { get; set; }

    public DateTime? Fecha { get; set; }

    public string NombreComprador { get; set; } = null!;

    public string TelefonoContacto { get; set; } = null!;

    public decimal Total { get; set; }

    public string? Estado { get; set; }

    public string? IdTransaccionMp { get; set; }

    public virtual ICollection<DetalleVenta> DetalleVenta { get; set; } = new List<DetalleVenta>();
}
