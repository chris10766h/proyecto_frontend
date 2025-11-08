import React, { useState, useEffect } from 'react';
import BibliotecaJuegos from './components/BibliotecaJuegos';
import FormularioJuego from './components/FormularioJuego';
import FormularioResena from './components/FormularioResena';
import EstadisticasPersonales from './components/EstadisticasPersonales';
import './App.css';

function App() {
  const [juegosActualizados, setJuegosActualizados] = useState(0);
  const [reseñasActualizadas, setReseñasActualizadas] = useState(0);
  const [juegos, setJuegos] = useState([]);

  useEffect(() => {
    const obtenerJuegos = async () => {
      try {
        const respuesta = await fetch('http://localhost:5000/api/juegos');
        const datos = await respuesta.json();
        setJuegos(datos);
      } catch (error) {
        console.error('Error obteniendo juegos:', error);
      }
    };
    obtenerJuegos();
  }, [juegosActualizados]);

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
        {/* SECCIÓN BIBLIOTECA - ARRIBA */}
        <section className="biblioteca-section">
          <BibliotecaJuegos 
            key={juegosActualizados + reseñasActualizadas} 
          />
        </section>

        {/* SECCIÓN ESTADÍSTICAS - EN MEDIO */}
        <section className="estadisticas-section">
          <EstadisticasPersonales />
        </section>

        {/* SECCIÓN FORMULARIOS - ABAJO (SIN BOTONES, FORMULARIOS DIRECTOS) */}
        <section className="formularios-section">
          <h2 className="text-center">➕ Agregar Contenido</h2>
          <div className="formularios-grid">
            <div className="formulario-container">
              <h3>🎮 Nuevo Juego</h3>
              {/* FORMULARIO DIRECTO SIN BOTÓN DE MOSTRAR/OCULTAR */}
              <FormularioJuego onJuegoAgregado={handleJuegoAgregado} />
            </div>
            <div className="formulario-container">
              <h3>⭐ Nueva Reseña</h3>
              {/* FORMULARIO DIRECTO SIN BOTÓN DE MOSTRAR/OCULTAR */}
              <FormularioResena 
                juegos={juegos} 
                onResenaAgregada={handleResenaAgregada} 
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;