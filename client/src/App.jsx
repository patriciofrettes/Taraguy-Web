import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import { CartProvider } from './context/CartContext';

// PÁGINAS
import Home from './pages/Home';
import Noticias from './pages/Noticias';
import NoticiaDetalle from './pages/NoticiaDetalle'; // <--- 1. ¡IMPORTANTE! Agregamos esto
import Partidos from './pages/Partidos';
import Tienda from './pages/Tienda';
import Historia from './pages/Historia';
import Admin from './pages/Admin';
import Sponsors from './pages/Sponsors';
import Beneficios from './pages/Beneficios';
import Asociate from './pages/Asociate';
import Login from './pages/Login';
import PagoExitoso from './pages/PagoExitoso';
import ProductoDetalle from './pages/ProductoDetalle';

// SEGURIDAD
import ProtectedRoute from './components/ProtectedRoute';

const Layout = () => {
    const location = useLocation();
    const esHome = location.pathname === '/';

    // Ocultamos Navbar y Footer si estamos en el Login (para que se vea limpio)
    const esLogin = location.pathname === '/login';

    return (
        <div className="flex flex-col min-h-screen relative bg-gray-50">

            {!esLogin && <CartSidebar />}

            {/* Header solo en Home */}
            {esHome && <Header />}

            {/* Navbar en todas menos en Login */}
            {!esLogin && <Navbar />}

            <div className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/historia" element={<Historia />} />

                    {/* RUTAS DE NOTICIAS */}
                    <Route path="/noticias" element={<Noticias />} />
                    <Route path="/noticias/:id" element={<NoticiaDetalle />} /> {/* <--- 2. ¡ESTA ES LA RUTA MÁGICA QUE FALTABA! */}

                    <Route path="/partidos" element={<Partidos />} />
                    <Route path="/tienda" element={<Tienda />} />
                    <Route path="/sponsors" element={<Sponsors />} />
                    <Route path="/beneficios" element={<Beneficios />} />
                    <Route path="/asociate" element={<Asociate />} />
                    <Route path="/pago-exitoso" element={<PagoExitoso />} />
                    <Route path="/producto/:id" element={<ProductoDetalle />} />

                    {/* RUTA DE LOGIN */}
                    <Route path="/login" element={<Login />} />

                    {/* RUTA PROTEGIDA DEL ADMIN */}
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <Admin />
                        </ProtectedRoute>
                    } />

                </Routes>
            </div>

            {/* Footer en todas menos en Login */}
            {!esLogin && <Footer />}
        </div>
    );
};

function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        </CartProvider>
    );
}

export default App;