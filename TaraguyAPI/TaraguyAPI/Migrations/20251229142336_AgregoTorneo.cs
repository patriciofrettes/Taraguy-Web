using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaraguyAPI.Migrations
{
    /// <inheritdoc />
    public partial class AgregoTorneo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Torneo",
                table: "partidos",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Torneo",
                table: "partidos");
        }
    }
}
