import axios from 'axios';

// Aquí definimos la dirección base.
// Cuando subamos a la nube, SOLO cambiaremos esta línea.
const api = axios.create({
    baseURL: 'https://localhost:7235/api' 
});

export default api;