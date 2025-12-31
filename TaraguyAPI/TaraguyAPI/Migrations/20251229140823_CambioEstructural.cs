using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TaraguyAPI.Migrations
{
    /// <inheritdoc />
    public partial class CambioEstructural : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "categorias",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("categorias_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "partidos",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    disciplina = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Categoria = table.Column<string>(type: "text", nullable: false),
                    rival = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    escudo_rival_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    fecha_hora = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    cancha = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    es_local = table.Column<bool>(type: "boolean", nullable: true, defaultValue: true),
                    Resultado = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("partidos_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "productos",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    descripcion = table.Column<string>(type: "text", nullable: true),
                    precio = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    stock = table.Column<int>(type: "integer", nullable: true, defaultValue: 0),
                    imagen_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    categoria_producto = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true, defaultValueSql: "'Indumentaria'::character varying"),
                    activo = table.Column<bool>(type: "boolean", nullable: true, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("productos_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "sponsors",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    logo_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    link_web = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    activo = table.Column<bool>(type: "boolean", nullable: true, defaultValue: true),
                    orden = table.Column<int>(type: "integer", nullable: true, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("sponsors_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre_usuario = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    password_hash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    rol = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true, defaultValueSql: "'admin'::character varying"),
                    fecha_creacion = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("usuarios_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ventas",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    fecha = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP"),
                    nombre_comprador = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    telefono_contacto = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    total = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    estado = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true, defaultValueSql: "'Pendiente'::character varying"),
                    id_transaccion_mp = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("ventas_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "noticias",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    titulo = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    copete = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    cuerpo = table.Column<string>(type: "text", nullable: false),
                    imagen_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    fecha_publicacion = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP"),
                    es_destacada = table.Column<bool>(type: "boolean", nullable: true, defaultValue: false),
                    categoria_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("noticias_pkey", x => x.id);
                    table.ForeignKey(
                        name: "noticias_categoria_id_fkey",
                        column: x => x.categoria_id,
                        principalTable: "categorias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "detalle_ventas",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    venta_id = table.Column<int>(type: "integer", nullable: true),
                    producto_id = table.Column<int>(type: "integer", nullable: true),
                    cantidad = table.Column<int>(type: "integer", nullable: false),
                    precio_unitario = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("detalle_ventas_pkey", x => x.id);
                    table.ForeignKey(
                        name: "detalle_ventas_producto_id_fkey",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "detalle_ventas_venta_id_fkey",
                        column: x => x.venta_id,
                        principalTable: "ventas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_detalle_ventas_producto_id",
                table: "detalle_ventas",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "IX_detalle_ventas_venta_id",
                table: "detalle_ventas",
                column: "venta_id");

            migrationBuilder.CreateIndex(
                name: "IX_noticias_categoria_id",
                table: "noticias",
                column: "categoria_id");

            migrationBuilder.CreateIndex(
                name: "usuarios_nombre_usuario_key",
                table: "usuarios",
                column: "nombre_usuario",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "detalle_ventas");

            migrationBuilder.DropTable(
                name: "noticias");

            migrationBuilder.DropTable(
                name: "partidos");

            migrationBuilder.DropTable(
                name: "sponsors");

            migrationBuilder.DropTable(
                name: "usuarios");

            migrationBuilder.DropTable(
                name: "productos");

            migrationBuilder.DropTable(
                name: "ventas");

            migrationBuilder.DropTable(
                name: "categorias");
        }
    }
}
