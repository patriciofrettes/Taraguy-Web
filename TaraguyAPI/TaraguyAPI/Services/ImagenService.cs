using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration; // Necesario para leer config
using System;
using System.IO;
using System.Threading.Tasks;

namespace TaraguyAPI.Services
{
    public class ImagenService
    {
        private readonly string _connectionString;
        private readonly string _containerName = "imagenes";

        // Inyectamos IConfiguration para leer la clave de forma segura
        public ImagenService(IConfiguration configuration)
        {
            // Busca una variable llamada "AzureStorageConnection"
            _connectionString = configuration.GetConnectionString("AzureStorageConnection");
        }

        public async Task<string> SubirImagenAsync(IFormFile archivo)
        {
            if (archivo == null || archivo.Length == 0) return null;

            try
            {
                var blobServiceClient = new BlobServiceClient(_connectionString);
                var containerClient = blobServiceClient.GetBlobContainerClient(_containerName);
                await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

                string extension = Path.GetExtension(archivo.FileName);
                string nombreArchivo = Guid.NewGuid().ToString() + extension;

                var blobClient = containerClient.GetBlobClient(nombreArchivo);
                using (var stream = archivo.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = archivo.ContentType });
                }

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