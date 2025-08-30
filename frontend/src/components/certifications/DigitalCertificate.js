// src/components/certifications/DigitalCertificate.js
import { useState } from 'react';

export default function DigitalCertificate({ certificate }) {
  const [showDetails, setShowDetails] = useState(false);

  const certificateData = {
    id: "CERT-2024-001",
    title: "Especialista en Ciencia de Datos",
    issuer: "AI University Global",
    date: "15 de Enero, 2024",
    student: "Juan Pérez",
    skills: ["Python", "Machine Learning", "Visualización", "Estadística"],
    blockchain: "Ethereum",
    hash: "0x7f9...a3b4",
    qrCode: "data:image/svg+xml;base64,..."
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center border-b border-white/10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">CERTIFICADO DE LOGRO</h1>
          <p className="text-blue-200">Otorgado por AI University Global</p>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">{certificateData.title}</h2>
            <p className="text-xl text-blue-200 mb-2">Se otorga a</p>
            <p className="text-2xl font-bold mb-6">{certificateData.student}</p>
            <p className="text-blue-200">por completar exitosamente el programa de estudios</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-2">Habilidades Adquiridas</h3>
              <div className="flex flex-wrap gap-2">
                {certificateData.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-white/20 text-sm px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-2">Detalles del Certificado</h3>
              <div className="space-y-1 text-sm">
                <p>ID: {certificateData.id}</p>
                <p>Fecha: {certificateData.date}</p>
                <p>Blockchain: {certificateData.blockchain}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-white p-2 rounded-lg">
              {/* QR Code placeholder */}
              <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500">QR Code</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/5 text-center text-sm text-blue-200">
          <p>Verificado en blockchain: {certificateData.hash.substring(0, 10)}...</p>
          <p className="mt-1">Este certificado es verificable y único</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="btn btn-outline"
        >
          {showDetails ? 'Ocultar Detalles' : 'Ver Detalles Técnicos'}
        </button>
      </div>

      {showDetails && (
        <div className="mt-4 card p-6">
          <h3 className="font-bold mb-3">Detalles Técnicos del Certificado</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Hash del Certificado:</p>
              <p className="break-all text-gray-600">{certificateData.hash}</p>
            </div>
            <div>
              <p className="font-semibold">Fecha de Emisión:</p>
              <p className="text-gray-600">{certificateData.date}</p>
            </div>
            <div>
              <p className="font-semibold">Emisor:</p>
              <p className="text-gray-600">{certificateData.issuer}</p>
            </div>
            <div>
              <p className="font-semibold">Blockchain:</p>
              <p className="text-gray-600">{certificateData.blockchain}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}