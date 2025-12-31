namespace TaraguyAPI.Models
{
    public class Partido
    {
        public int Id { get; set; }
        public string Disciplina { get; set; } = "Rugby";
        public string Categoria { get; set; } = "Primera";
        public string? Torneo { get; set; }
        public string Rival { get; set; } = null!;
        public string? EscudoRivalUrl { get; set; }
        public DateTime FechaHora { get; set; }
        public string? Cancha { get; set; }
        public bool? EsLocal { get; set; }
        public string? Resultado { get; set; }
    }
}