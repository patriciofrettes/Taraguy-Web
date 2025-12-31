import axios from 'axios';

// Aquí definimos la dirección base.
// Cuando subamos a la nube, SOLO cambiaremos esta línea.
const api = axios.create({
    baseURL: 'https://https://taraguyrugbyclub-hhgkcrevcgerf7bg.centralus-01.azurewebsites.net//api' 
});

export default api;