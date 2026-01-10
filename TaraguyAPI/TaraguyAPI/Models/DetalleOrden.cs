using System.Text.Json.Serialization;

namespace TaraguyAPI.Models
{
    public class DetalleOrden
    {
        public int Id { get; set; }

        public int OrdenId { get; set; }

        [JsonIgnore]
        public Orden? Orden { get; set; }

        public int ProductoId { get; set; }

        public string NombreProducto { get; set; } = string.Empty;

        public string? Talle { get; set; }

        public int Cantidad { get; set; }

        public decimal PrecioUnitario { get; set; }
    }
}