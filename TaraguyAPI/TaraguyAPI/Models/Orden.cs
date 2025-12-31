using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaraguyAPI.Models
{
    public class Orden
    {
        public int Id { get; set; }

        public DateTime Fecha { get; set; } = DateTime.Now;

        [Required]
        public string Estado { get; set; } = "PENDIENTE"; // PENDIENTE, PAGADO, ENTREGADO

        public decimal Total { get; set; }

        // --- DATOS DEL CLIENTE ---
        [Required]
        public string NombreCliente { get; set; }
        [Required]
        public string ApellidoCliente { get; set; }
        [Required]
        public string Dni { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Telefono { get; set; }

        // --- DATOS DE ENTREGA ---
        public string TipoEnvio { get; set; } = "RETIRO";

        // Estos campos son opcionales (?) para cuando actives envíos a todo el país
        public string? Provincia { get; set; }
        public string? Ciudad { get; set; }
        public string? DireccionCalle { get; set; }
        public string? CodigoPostal { get; set; }
        public string? CodigoSeguimiento { get; set; } // Para el tracking del correo

        // --- MERCADO PAGO ---
        public string? MercadoPagoId { get; set; }

        // Relación con los detalles
        public List<DetalleOrden> Detalles { get; set; }
    }
}