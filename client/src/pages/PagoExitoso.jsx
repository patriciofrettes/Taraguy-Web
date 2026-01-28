import { Link } from 'react-router-dom';

const PagoExitoso = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
                <div className="mb-6 text-green-500">
                    <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h2 className="text-3xl font-black italic mb-4">¡PAGO EXITOSO!</h2>

                <p className="text-gray-600 mb-8">
                    Tu operación se realizó correctamente.
                </p>

                <Link
                    to="/"
                    className="block w-full bg-black text-white font-bold py-3 px-6 rounded uppercase tracking-wider hover:bg-gray-800 transition-colors"
                >
                    VOLVER AL INICIO
                </Link>
            </div>
        </div>
    );
};

export default PagoExitoso;