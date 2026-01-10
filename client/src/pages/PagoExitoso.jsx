import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PagoExitoso = () => {
    const { clearCart } = useCart();
    const [searchParams] = useSearchParams();
    const [orden, setOrden] = useState(null);

    useEffect(() => {
        clearCart();
        const ordenId = searchParams.get('external_reference');
        if (ordenId) {
            api.get(`/Ordenes/${ordenId}`)
                .then(res => setOrden(res.data))
                .catch(err => console.error("Error al cargar orden", err));
        }
    }, [searchParams]);

    const descargarPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("TARAGUY RUGBY CLUB", 10, 20);
        doc.setFontSize(12);
        doc.text("Comprobante de Pago Oficial", 10, 28);
        doc.line(10, 32, 200, 32);

        doc.text(`Orden Nro: #${orden.id}`, 10, 42);
        doc.text(`Fecha: ${new Date(orden.fecha).toLocaleDateString()}`, 10, 49);
        doc.text(`Cliente: ${orden.nombreCliente} ${orden.apellidoCliente}`, 10, 56);

        const filas = orden.detalles.map(d => [
            d.nombreProducto,
            d.talle || 'N/A',
            d.cantidad,
            `$${d.precioUnitario.toLocaleString()}`,
            `$${(d.cantidad * d.precioUnitario).toLocaleString()}`
        ]);

        doc.autoTable({
            startY: 65,
            head: [['Producto', 'Talle', 'Cant', 'Precio Unit.', 'Subtotal']],
            body: filas,
            headStyles: { fillColor: [0, 0, 0] }
        });

        doc.setFontSize(16);
        doc.text(`TOTAL PAGADO: $${orden.total.toLocaleString()}`, 140, doc.lastAutoTable.finalY + 15);
        doc.save(`Comprobante_Taraguy_Orden_${orden.id}.pdf`);
    };

    if (!orden) return <div className="text-center py-20 font-bold uppercase tracking-widest">Cargando Comprobante...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white max-w-xl w-full rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-black p-8 text-center text-white">
                    <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h1 className="text-2xl font-black uppercase">¡Pago Confirmado!</h1>
                    <p className="text-gray-400 text-xs">Orden #{orden.id}</p>
                </div>

                <div className="p-8">
                    <div className="space-y-3 mb-8">
                        {orden.detalles.map(item => (
                            <div key={item.id} className="flex justify-between text-sm border-b pb-2">
                                <span className="text-gray-600 font-bold">{item.cantidad}x {item.nombreProducto} {item.talle && `(${item.talle})`}</span>
                                <span className="font-black">${(item.cantidad * item.precioUnitario).toLocaleString()}</span>
                            </div>
                        ))}
                        <div className="pt-4 flex justify-between items-center">
                            <span className="font-black text-xl uppercase">Total</span>
                            <span className="font-black text-2xl text-green-600">${orden.total.toLocaleString()}</span>
                        </div>
                    </div>

                    <button onClick={descargarPDF} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl uppercase tracking-widest hover:bg-blue-700 transition mb-4">
                        Descargar Comprobante PDF
                    </button>
                    <Link to="/tienda" className="block text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-black">Volver a la tienda</Link>
                </div>
            </div>
        </div>
    );
};

export default PagoExitoso;