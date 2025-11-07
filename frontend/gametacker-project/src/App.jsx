import React, { useState } from 'react';
import BibliotecaJuegos from './components/BibliotecaJuegos';
import FormularioJuego from './components/FormularioJuego';
import './App.css';

function App() {
  const [juegosActualizados, setJuegosActualizados] = useState(0);

  const handleJuegoAgregado = () => {
    setJuegosActualizados(prev => prev + 1);
  };

  return (
    <div className="App">
      <FormularioJuego onJuegoAgregado={handleJuegoAgregado} />
      <BibliotecaJuegos key={juegosActualizados} />
    </div>
  );
}

export default App;