using System;
using System.ComponentModel.DataAnnotations.Schema; // Necesario para [Column]

namespace TaraguyAPI.Models
{
    // Mapeo exacto a tu tabla "partidos"
    [Table("partidos")]
    public class Partido
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("rival")]
        public string Rival { get; set; }

        [Column("fecha_hora")]
        public DateTime FechaHora { get; set; }

        [Column("cancha")] // En la foto dice 'cancha'
        public string? Lugar { get; set; }

        [Column("es_local")]
        public bool EsLocal { get; set; } = true;

        [Column("Resultado")] // En tu foto está con Mayúscula
        public string? Resultado { get; set; }

        [Column("Torneo")] // En tu foto está con Mayúscula
        public string? Torneo { get; set; }

        // --- TUS COLUMNAS NUEVAS ---

        [Column("disciplina")] // En tu foto está con minúscula
        public string Disciplina { get; set; } = "Rugby";

        [Column("Categoria")] // En tu foto está con Mayúscula
        public string Categoria { get; set; } = "Primera";

        [Column("escudo_rival_url")] // En tu foto está con minúscula y guiones
        public string? EscudoRivalUrl { get; set; }
    }
}