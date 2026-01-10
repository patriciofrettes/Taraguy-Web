using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace TaraguyAPI.Services
{
    public class ImagenService
    {
        // ⚠️ PEGÁ ACÁ LA CADENA DE CONEXIÓN QUE COPIASTE DE AZURE
        private readonly string _connectionString = "DefaultEndpointsProtocol=https;AccountName=storagetaraguy2026;AccountKey=Yjhhranbub2U4/qL0zwZkA0nOEZ//ovHMHlGjvV+oYvzOLn8ouZBSPNVdjWEHpMgr+01947PjecT+AStLsorWg==;EndpointSuffix=core.windows.net";
        
        private readonly string _containerName = "imagenes";

        public async Task<string> SubirImagenAsync(IFormFile archivo)
        {
            if (archivo == null || archivo.Length == 0) return null;

            try 
            {
                // Conectamos a Azure
                var blobServiceClient = new BlobServiceClient(_connectionString);
                var containerClient = blobServiceClient.GetBlobContainerClient(_containerName);
                
                // Creamos el contenedor si no existe (por las dudas)
                await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

                // Nombre único para la foto
                string extension = Path.GetExtension(archivo.FileName);
                string nombreArchivo = Guid.NewGuid().ToString() + extension;

                // Subimos la foto
                var blobClient = containerClient.GetBlobClient(nombreArchivo);
                using (var stream = archivo.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = archivo.ContentType });
                }

                // Devolvemos la URL directa de internet (ej: https://taraguy.blob.core.../foto.jpg)
                return blobClient.Uri.ToString();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error subiendo imagen: " + ex.Message);
                return null;
            }
        }
    }
}