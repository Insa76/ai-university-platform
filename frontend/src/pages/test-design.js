export default function TestTailwind() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          Test de Tailwind CSS
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Card 1</h2>
            <p className="mb-4">
              Esta es una tarjeta de prueba para verificar que Tailwind esté funcionando.
            </p>
            <button className="btn btn-primary">
              Botón Primario
            </button>
          </div>
          
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Card 2</h2>
            <p className="mb-4">
              Si ves estilos aplicados correctamente, Tailwind está funcionando.
            </p>
            <div className="flex space-x-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Éxito
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Info
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}