using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaraguyAPI.Migrations
{
    /// <inheritdoc />
    public partial class AgregarTalles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Talles",
                table: "productos",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Talles",
                table: "productos");
        }
    }
}
