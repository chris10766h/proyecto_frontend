import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BibliotecaJuegos from './components/BibliotecaJuegos';
import FormularioJuego from './components/FormularioJuego';
import FormularioResena from './components/FormularioResena';
import EstadisticasPersonales from './components/EstadisticasPersonales';
import ListaResenas from './components/ListaResenas';
import './App.css';

function App() {
  const [juegosActualizados, setJuegosActualizados] = useState(0);
  const [reseñasActualizadas, setReseñasActualizadas] = useState(0);
  const [juegos, setJuegos] = useState([]);
  const [vistaActual, setVistaActual] = useState('biblioteca'); // 'biblioteca', 'reseñas' o 'estadisticas'

  // Obtener juegos
  useEffect(() => {
    const obtenerJuegos = async () => {
      try {
        const respuesta = await axios.get('http://localhost:5000/api/juegos');
        setJuegos(respuesta.data);
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
      {/* ENCABEZADO */}
      <header className="app-header">
        <h1>🎮 GameTracker</h1>
        <p>Tu biblioteca personal de videojuegos</p>
        
        {/* NAVEGACIÓN CON BOTONES */}
        <nav className="app-nav">
          <button 
            className={`nav-btn ${vistaActual === 'biblioteca' ? 'nav-btn-active' : ''}`}
            onClick={() => setVistaActual('biblioteca')}
          >
            📚 Biblioteca
          </button>

          <button 
            className={`nav-btn ${vistaActual === 'reseñas' ? 'nav-btn-active' : ''}`}
            onClick={() => setVistaActual('reseñas')}
          >
            📝 Reseñas
          </button>

          <button 
            className={`nav-btn ${vistaActual === 'estadisticas' ? 'nav-btn-active' : ''}`}
            onClick={() => setVistaActual('estadisticas')}
          >
            📊 Estadísticas
          </button>
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="app-contenido">
        {vistaActual === 'biblioteca' && (
          <>
            {/* SECCIÓN BIBLIOTECA */}
            <section className="biblioteca-section">
              <BibliotecaJuegos 
                key={juegosActualizados + reseñasActualizadas} 
              />
            </section>

            {/* SECCIÓN FORMULARIOS */}
            <section className="formularios-section">
              <h2 className="seccion-titulo">➕ Agregar Contenido</h2>
              <div className="formularios-grid">
                <div className="formulario-container">
                  <h3>🎮 Nuevo Juego</h3>
                  <FormularioJuego onJuegoAgregado={handleJuegoAgregado} />
                </div>
                <div className="formulario-container">
                  <h3>⭐ Nueva Reseña</h3>
                  <FormularioResena 
                    juegos={juegos} 
                    onResenaAgregada={handleResenaAgregada} 
                  />
                </div>
              </div>
            </section>
          </>
        )}

        {vistaActual === 'reseñas' && (
          /* SECCIÓN LISTA DE RESEÑAS */
          <section className="reseñas-section">
            <h2 className="seccion-titulo">📝 Reseñas Registradas</h2>
            <ListaResenas />
          </section>
        )}

        {vistaActual === 'estadisticas' && (
          /* SECCIÓN ESTADÍSTICAS */
          <section className="estadisticas-section">
            <EstadisticasPersonales />
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
