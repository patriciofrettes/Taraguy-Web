using System.Net;
using System.Net.Mail;

public class EmailService
{
    // CONFIGURACIÓN (Pon tus datos reales aquí)
    private string MiCorreo = "patriciofrettesrespaldo@gmail.com";
    private string MiPasswordApp = "frkf anhz hfpz mzyy"; // ¡Las 16 letras que te dio Google!
    private string CorreoDestino = "patriciofrettesrespaldo@gmail.com"; // A donde quieres que llegue el aviso

    public void EnviarAvisoVenta(string nombreCliente, decimal total, string idOrden)
    {
        try
        {
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(MiCorreo, MiPasswordApp),
                EnableSsl = true,
            };

            var mensaje = new MailMessage
            {
                From = new MailAddress(MiCorreo, "Club Taraguy - Ventas"),
                Subject = $"💰 Nueva Venta #${idOrden} - ${total}",
                Body = $@"
                    <div style='font-family: Arial; border: 1px solid #ccc; padding: 20px; border-radius: 10px;'>
                        <h1 style='color: #000;'>¡Nueva compra recibida! 🏉</h1>
                        <p>El cliente <b>{nombreCliente}</b> ha realizado una compra.</p>
                        <h2 style='color: green;'>Total: ${total}</h2>
                        <hr>
                        <p>Entra al panel administrativo para ver el detalle y preparar el pedido.</p>
                        <a href='http://localhost:5173/admin' style='background: black; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Ir al Panel</a>
                    </div>",
                IsBodyHtml = true,
            };

            mensaje.To.Add(CorreoDestino);

            smtpClient.Send(mensaje);
            Console.WriteLine("📧 Email enviado correctamente.");
        }
        catch (Exception ex)
        {
            Console.WriteLine("❌ Error enviando email: " + ex.Message);
        }
    }
}