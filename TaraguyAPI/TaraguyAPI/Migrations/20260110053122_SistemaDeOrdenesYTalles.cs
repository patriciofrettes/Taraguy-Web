using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaraguyAPI.Migrations
{
    /// <inheritdoc />
    public partial class SistemaDeOrdenesYTalles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "es_local",
                table: "partidos",
                type: "boolean",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AddColumn<string>(
                name: "Talle",
                table: "detalle_ordenes",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Talle",
                table: "detalle_ordenes");

            migrationBuilder.AlterColumn<bool>(
                name: "es_local",
                table: "partidos",
                type: "boolean",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldDefaultValue: true);
        }
    }
}
