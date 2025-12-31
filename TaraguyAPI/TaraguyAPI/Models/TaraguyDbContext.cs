using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace TaraguyAPI.Models;

public partial class TaraguyDbContext : DbContext
{
    public TaraguyDbContext()
    {
    }

    public TaraguyDbContext(DbContextOptions<TaraguyDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Categoria> Categorias { get; set; }

    public virtual DbSet<DetalleVenta> DetalleVentas { get; set; }

    public virtual DbSet<Noticia> Noticias { get; set; }

    public virtual DbSet<Partido> Partidos { get; set; }

    public virtual DbSet<Producto> Productos { get; set; }

    public virtual DbSet<Sponsor> Sponsors { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    public virtual DbSet<Venta> Ventas { get; set; }

    // --- AGREGADO PARA MERCADO PAGO ---
    public virtual DbSet<Orden> Ordenes { get; set; }
    public virtual DbSet<DetalleOrden> DetalleOrdenes { get; set; }

    // NOTA: Se eliminó el método OnConfiguring para evitar guardar la contraseña aquí.
    // La conexión ahora se maneja en Program.cs

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("categorias_pkey");

            entity.ToTable("categorias");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .HasColumnName("nombre");
        });

        modelBuilder.Entity<DetalleVenta>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("detalle_ventas_pkey");

            entity.ToTable("detalle_ventas");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Cantidad).HasColumnName("cantidad");
            entity.Property(e => e.PrecioUnitario)
                .HasPrecision(10, 2)
                .HasColumnName("precio_unitario");
            entity.Property(e => e.ProductoId).HasColumnName("producto_id");
            entity.Property(e => e.VentaId).HasColumnName("venta_id");

            entity.HasOne(d => d.Producto).WithMany(p => p.DetalleVenta)
                .HasForeignKey(d => d.ProductoId)
                .HasConstraintName("detalle_ventas_producto_id_fkey");

            entity.HasOne(d => d.Venta).WithMany(p => p.DetalleVenta)
                .HasForeignKey(d => d.VentaId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("detalle_ventas_venta_id_fkey");
        });

        modelBuilder.Entity<Noticia>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("noticias_pkey");

            entity.ToTable("noticias");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CategoriaId).HasColumnName("categoria_id");
            entity.Property(e => e.Copete)
                .HasMaxLength(300)
                .HasColumnName("copete");
            entity.Property(e => e.Cuerpo).HasColumnName("cuerpo");
            entity.Property(e => e.EsDestacada)
                .HasDefaultValue(false)
                .HasColumnName("es_destacada");
            entity.Property(e => e.FechaPublicacion)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("fecha_publicacion");
            entity.Property(e => e.ImagenUrl)
                .HasMaxLength(500)
                .HasColumnName("imagen_url");
            entity.Property(e => e.Titulo)
                .HasMaxLength(150)
                .HasColumnName("titulo");

            entity.HasOne(d => d.Categoria).WithMany(p => p.Noticia)
                .HasForeignKey(d => d.CategoriaId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("noticias_categoria_id_fkey");
        });

        modelBuilder.Entity<Partido>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("partidos_pkey");

            entity.ToTable("partidos");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Cancha)
                .HasMaxLength(100)
                .HasColumnName("cancha");
            entity.Property(e => e.Disciplina)
                .HasMaxLength(50)
                .HasColumnName("disciplina");
            entity.Property(e => e.EsLocal)
                .HasDefaultValue(true)
                .HasColumnName("es_local");
            entity.Property(e => e.EscudoRivalUrl)
                .HasMaxLength(500)
                .HasColumnName("escudo_rival_url");
            entity.Property(e => e.FechaHora)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("fecha_hora");
            entity.Property(e => e.Rival)
                .HasMaxLength(100)
                .HasColumnName("rival");
        });

        modelBuilder.Entity<Producto>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("productos_pkey");

            entity.ToTable("productos");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Activo)
                .HasDefaultValue(true)
                .HasColumnName("activo");
            entity.Property(e => e.CategoriaProducto)
                .HasMaxLength(50)
                .HasDefaultValueSql("'Indumentaria'::character varying")
                .HasColumnName("categoria_producto");
            entity.Property(e => e.Descripcion).HasColumnName("descripcion");
            entity.Property(e => e.ImagenUrl)
                .HasMaxLength(500)
                .HasColumnName("imagen_url");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .HasColumnName("nombre");
            entity.Property(e => e.Precio)
                .HasPrecision(10, 2)
                .HasColumnName("precio");
            entity.Property(e => e.Stock)
                .HasDefaultValue(0)
                .HasColumnName("stock");
        });

        modelBuilder.Entity<Sponsor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("sponsors_pkey");

            entity.ToTable("sponsors");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Activo)
                .HasDefaultValue(true)
                .HasColumnName("activo");
            entity.Property(e => e.LinkWeb)
                .HasMaxLength(500)
                .HasColumnName("link_web");
            entity.Property(e => e.LogoUrl)
                .HasMaxLength(500)
                .HasColumnName("logo_url");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .HasColumnName("nombre");
            entity.Property(e => e.Orden)
                .HasDefaultValue(0)
                .HasColumnName("orden");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("usuarios_pkey");

            entity.ToTable("usuarios");

            entity.HasIndex(e => e.NombreUsuario, "usuarios_nombre_usuario_key").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("fecha_creacion");
            entity.Property(e => e.NombreUsuario)
                .HasMaxLength(50)
                .HasColumnName("nombre_usuario");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .HasColumnName("password_hash");
            entity.Property(e => e.Rol)
                .HasMaxLength(20)
                .HasDefaultValueSql("'admin'::character varying")
                .HasColumnName("rol");
        });

        modelBuilder.Entity<Venta>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("ventas_pkey");

            entity.ToTable("ventas");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Estado)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Pendiente'::character varying")
                .HasColumnName("estado");
            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("fecha");
            entity.Property(e => e.IdTransaccionMp)
                .HasMaxLength(100)
                .HasColumnName("id_transaccion_mp");
            entity.Property(e => e.NombreComprador)
                .HasMaxLength(100)
                .HasColumnName("nombre_comprador");
            entity.Property(e => e.TelefonoContacto)
                .HasMaxLength(50)
                .HasColumnName("telefono_contacto");
            entity.Property(e => e.Total)
                .HasPrecision(12, 2)
                .HasColumnName("total");
        });

        // --- CONFIGURACIÓN PARA LAS NUEVAS TABLAS DE ORDENES (Estilo Postgres) ---
        modelBuilder.Entity<Orden>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("ordenes_pkey");
            entity.ToTable("ordenes");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("fecha");
            entity.Property(e => e.Estado).HasColumnName("estado");
            entity.Property(e => e.Total).HasColumnName("total").HasPrecision(12, 2);
            entity.Property(e => e.NombreCliente).HasColumnName("nombre_cliente");
            entity.Property(e => e.ApellidoCliente).HasColumnName("apellido_cliente");
            entity.Property(e => e.Dni).HasColumnName("dni");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.Telefono).HasColumnName("telefono");
            entity.Property(e => e.TipoEnvio).HasColumnName("tipo_envio");
            entity.Property(e => e.Provincia).HasColumnName("provincia");
            entity.Property(e => e.Ciudad).HasColumnName("ciudad");
            entity.Property(e => e.DireccionCalle).HasColumnName("direccion_calle");
            entity.Property(e => e.CodigoPostal).HasColumnName("codigo_postal");
            entity.Property(e => e.MercadoPagoId).HasColumnName("mercado_pago_id");
            entity.Property(e => e.CodigoSeguimiento).HasColumnName("codigo_seguimiento");
        });

        modelBuilder.Entity<DetalleOrden>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("detalle_ordenes_pkey");
            entity.ToTable("detalle_ordenes");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OrdenId).HasColumnName("orden_id");
            entity.Property(e => e.ProductoId).HasColumnName("producto_id");
            entity.Property(e => e.NombreProducto).HasColumnName("nombre_producto");
            entity.Property(e => e.Cantidad).HasColumnName("cantidad");
            entity.Property(e => e.PrecioUnitario).HasColumnName("precio_unitario").HasPrecision(12, 2);

            entity.HasOne(d => d.Orden)
                .WithMany(p => p.Detalles)
                .HasForeignKey(d => d.OrdenId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("detalle_ordenes_orden_id_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}