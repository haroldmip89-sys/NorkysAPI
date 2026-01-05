import { FaFacebook, FaWhatsapp, FaInstagram, FaLinkedin } from "react-icons/fa";
import kratos from '../assets/kratos.png';

export function Footer() {
    return (
        <>
            {/* Íconos */}
            {/* Imagen + texto */}
            <footer className="bg-gray-900 text-gray-300 mt-16">

            {/* CONTENIDO PRINCIPAL */}
            <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-3 items-center">

                {/* LOGO + TEXTO (MISMA FILA VISUAL) */}
                <div className="flex items-start gap-4">
                    <img
                        src={kratos}
                        alt="Logo"
                        className="w-20 h-auto flex-shrink-0"
                    />
                    <p className="text-sm leading-relaxed">
                        Disfruta del mejor pollo a la brasa con el sabor que nos identifica.
                        Calidad, tradición y pasión en cada pedido.
                    </p>
                </div>

                {/* REDES */}
                <div>
                    <h4 className="text-white font-semibold mb-4">
                        Síguenos
                    </h4>
                    <div className="flex gap-4 text-xl">
                        <a className="hover:text-norkys-naranja transition">
                            <FaFacebook />
                        </a>
                        <a className="hover:text-norkys-naranja transition">
                            <FaWhatsapp />
                        </a>
                        <a className="hover:text-norkys-naranja transition">
                            <FaInstagram />
                        </a>
                        <a className="hover:text-norkys-naranja transition">
                            <FaLinkedin />
                        </a>
                    </div>
                </div>

                {/* INFO */}
                <div>
                    <h4 className="text-white font-semibold mb-4">
                        Contacto
                    </h4>
                    <p className="text-sm">Pedidos online 24/7</p>
                    <p className="text-sm">Delivery rápido y seguro</p>
                </div>
            </div>

            {/* FRANJA INFERIOR MÁS OSCURA */}
            <div className="bg-gray-950 border-t border-gray-800 text-center py-4 text-xs text-gray-400">
                © 2025 — Desarrollado por <strong className="text-gray-200">Harold Inga</strong> & ChatGPT
            </div>

        </footer>
        </>
    );
}
