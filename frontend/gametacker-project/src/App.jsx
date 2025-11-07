import React, { useState } from 'react';
import BibliotecaJuegos from './components/BibliotecaJuegos';
import FormularioJuego from './components/FormularioJuego';
import FormularioResena from './components/FormularioResena';
import './App.css';

function App() {
  const [juegosActualizados, setJuegosActualizados] = useState(0);
  const [reseñasActualizadas, setReseñasActualizadas] = useState(0);
  const [juegos, setJuegos] = useState([]);

  const handleJuegoAgregado = () => {
    setJuegosActualizados(prev => prev + 1);
  };

  const handleResenaAgregada = () => {
    setReseñasActualizadas(prev => prev + 1);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎮 GameTracker</h1>
        <p>Tu biblioteca personal de videojuegos</p>
      </header>
      
      <div className="app-contenido">
        <FormularioJuego onJuegoAgregado={handleJuegoAgregado} />
        <FormularioResena 
          juegos={juegos} 
          onResenaAgregada={handleResenaAgregada} 
        />
        <BibliotecaJuegos 
          key={juegosActualizados + reseñasActualizadas} 
        />
      </div>
    </div>
  );
}

export default App;