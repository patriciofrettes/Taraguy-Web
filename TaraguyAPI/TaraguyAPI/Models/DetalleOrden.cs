using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaraguyAPI.Models
{
    public class DetalleOrden
    {
        public int Id { get; set; }

        public int OrdenId { get; set; }
        [JsonIgnore] // Evita ciclos al convertir a JSON
        public Orden Orden { get; set; }

        public int ProductoId { get; set; }
        // public Producto Producto { get; set; } // Opcional, si quieres navegar al producto

        public string NombreProducto { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
    }
}