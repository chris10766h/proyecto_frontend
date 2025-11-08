import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TarjetaJuego from './TarjetaJuego';
import './BibliotecaJuegos.css';

const BibliotecaJuegos = () => {
  const [juegos, setJuegos] = useState([]);
  const [juegosFiltrados, setJuegosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editandoJuego, setEditandoJuego] = useState(null);
  
  // Estados para filtros y búsqueda
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroGenero, setFiltroGenero] = useState('');
  const [filtroPlataforma, setFiltroPlataforma] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroAño, setFiltroAño] = useState('');

  const obtenerJuegos = async () => {
    try {
      console.log('🔄 Obteniendo juegos...');
      const respuesta = await axios.get('http://localhost:5000/api/juegos');
      console.log('✅ Juegos obtenidos:', respuesta.data);
      setJuegos(respuesta.data);
      setJuegosFiltrados(respuesta.data);
      setCargando(false);
    } catch (error) {
      console.error('❌ Error obteniendo juegos:', error);
      setCargando(false);
    }
  };

  // Función para aplicar filtros
  const aplicarFiltros = () => {
    let resultados = [...juegos];

    // Filtro por búsqueda (título o desarrollador)
    if (terminoBusqueda) {
      resultados = resultados.filter(juego =>
        juego.titulo.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        juego.desarrollador.toLowerCase().includes(terminoBusqueda.toLowerCase())
      );
    }

    // Filtro por género
    if (filtroGenero) {
      resultados = resultados.filter(juego => juego.genero === filtroGenero);
    }

    // Filtro por plataforma
    if (filtroPlataforma) {
      resultados = resultados.filter(juego => juego.plataforma === filtroPlataforma);
    }

    // Filtro por estado (completado/pendiente)
    if (filtroEstado) {
      const estadoBool = filtroEstado === 'completado';
      resultados = resultados.filter(juego => juego.completado === estadoBool);
    }

    // Filtro por año
    if (filtroAño) {
      resultados = resultados.filter(juego => juego.añoLanzamiento.toString() === filtroAño);
    }

    setJuegosFiltrados(resultados);
  };

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setTerminoBusqueda('');
    setFiltroGenero('');
    setFiltroPlataforma('');
    setFiltroEstado('');
    setFiltroAño('');
    setJuegosFiltrados(juegos);
  };

  // Aplicar filtros cuando cambie cualquier filtro
  useEffect(() => {
    aplicarFiltros();
  }, [terminoBusqueda, filtroGenero, filtroPlataforma, filtroEstado, filtroAño, juegos]);

  const eliminarJuego = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este juego?')) {
      try {
        await axios.delete(`http://localhost:5000/api/juegos/${id}`);
        obtenerJuegos();
        alert('Juego eliminado correctamente');
      } catch (error) {
        console.error('Error eliminando juego:', error);
        alert('Error al eliminar el juego');
      }
    }
  };

  const actualizarJuego = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/juegos/${editandoJuego._id}`, editandoJuego);
      setEditandoJuego(null);
      obtenerJuegos();
      alert('Juego actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando juego:', error);
      alert('Error al actualizar el juego');
    }
  };

  useEffect(() => {
    obtenerJuegos();
  }, []);

  // Obtener valores únicos para los filtros
  const generosUnicos = [...new Set(juegos.map(juego => juego.genero))];
  const plataformasUnicas = [...new Set(juegos.map(juego => juego.plataforma))];
  const añosUnicos = [...new Set(juegos.map(juego => juego.añoLanzamiento))].sort((a, b) => b - a);

  return (
    <div className="biblioteca-container">
      <h1 className="biblioteca-titulo">🎮 Mi Biblioteca de Juegos</h1>
      
      {/* SECCIÓN DE FILTROS Y BÚSQUEDA */}
      <div className="filtros-container">
        <div className="filtros-header">
          <h2>🔍 Buscar y Filtrar</h2>
          <button 
            className="btn-limpiar-filtros"
            onClick={limpiarFiltros}
            disabled={!terminoBusqueda && !filtroGenero && !filtroPlataforma && !filtroEstado && !filtroAño}
          >
            🗑️ Limpiar Filtros
          </button>
        </div>

        <div className="filtros-grid">
          {/* Búsqueda por texto */}
          <div className="filtro-grupo">
            <label>🔎 Buscar por título o desarrollador</label>
            <input
              type="text"
              placeholder="Ej: Zelda, Nintendo..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              className="input-busqueda"
            />
          </div>

          {/* Filtro por género */}
          <div className="filtro-grupo">
            <label>🎮 Género</label>
            <select
              value={filtroGenero}
              onChange={(e) => setFiltroGenero(e.target.value)}
            >
              <option value="">Todos los géneros</option>
              {generosUnicos.map(genero => (
                <option key={genero} value={genero}>{genero}</option>
              ))}
            </select>
          </div>

          {/* Filtro por plataforma */}
          <div className="filtro-grupo">
            <label>🖥️ Plataforma</label>
            <select
              value={filtroPlataforma}
              onChange={(e) => setFiltroPlataforma(e.target.value)}
            >
              <option value="">Todas las plataformas</option>
              {plataformasUnicas.map(plataforma => (
                <option key={plataforma} value={plataforma}>{plataforma}</option>
              ))}
            </select>
          </div>

          {/* Filtro por estado */}
          <div className="filtro-grupo">
            <label>📊 Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="completado">✅ Completados</option>
              <option value="pendiente">⏳ Pendientes</option>
            </select>
          </div>

          {/* Filtro por año */}
          <div className="filtro-grupo">
            <label>📅 Año de lanzamiento</label>
            <select
              value={filtroAño}
              onChange={(e) => setFiltroAño(e.target.value)}
            >
              <option value="">Todos los años</option>
              {añosUnicos.map(año => (
                <option key={año} value={año}>{año}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Información de resultados */}
        <div className="resultados-info">
          <p>
            Mostrando <strong>{juegosFiltrados.length}</strong> de <strong>{juegos.length}</strong> juegos
            {(terminoBusqueda || filtroGenero || filtroPlataforma || filtroEstado || filtroAño) && 
              " (filtrados)"}
          </p>
        </div>
      </div>

      <p className="biblioteca-subtitulo">
        {juegosFiltrados.length} juego{juegosFiltrados.length !== 1 ? 's' : ''} en tu colección
      </p>
      
      {/* MODAL DE EDICIÓN (se mantiene igual) */}
      {editandoJuego && (
        <div className="modal-overlay">
          {/* ... tu modal de edición existente ... */}
        </div>
      )}

      {cargando ? (
        <div className="cargando-container">
          <div className="cargando-spinner"></div>
          <p>Cargando tu biblioteca...</p>
        </div>
      ) : juegosFiltrados.length === 0 ? (
        <div className="sin-resultados">
          <h3>😔 No se encontraron juegos</h3>
          <p>Intenta ajustar tus filtros de búsqueda o agregar nuevos juegos.</p>
          <button className="btn-limpiar-filtros" onClick={limpiarFiltros}>
            🔄 Mostrar todos los juegos
          </button>
        </div>
      ) : (
        <div className="juegos-grid">
          {juegosFiltrados.map(juego => (
            <TarjetaJuego 
              key={juego._id}
              juego={juego}
              onEditar={setEditandoJuego}
              onEliminar={eliminarJuego}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BibliotecaJuegos;