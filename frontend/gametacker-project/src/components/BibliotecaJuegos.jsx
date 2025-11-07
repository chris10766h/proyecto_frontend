import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BibliotecaJuegos.css';

const BibliotecaJuegos = () => {
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editandoJuego, setEditandoJuego] = useState(null);

  const obtenerJuegos = async () => {
    try {
      const respuesta = await axios.get('http://localhost:5000/api/juegos');
      setJuegos(respuesta.data);
      setCargando(false);
    } catch (error) {
      console.error('Error obteniendo juegos:', error);
      setCargando(false);
    }
  };

  const eliminarJuego = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este juego?')) {
      try {
        await axios.delete(`http://localhost:5000/api/juegos/${id}`);
        obtenerJuegos(); // Recargar la lista
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
      obtenerJuegos(); // Recargar la lista
      alert('Juego actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando juego:', error);
      alert('Error al actualizar el juego');
    }
  };

  useEffect(() => {
    obtenerJuegos();
  }, []);

  if (cargando) {
    return <div className="cargando">Cargando juegos...</div>;
  }

  return (
    <div className="biblioteca-container">
      <h1 className="biblioteca-titulo">🎮 Mi Biblioteca de Juegos</h1>
      
      {/* Modal de edición */}
      {editandoJuego && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar Juego</h3>
            <form onSubmit={actualizarJuego}>
              <input
                type="text"
                value={editandoJuego.titulo}
                onChange={(e) => setEditandoJuego({...editandoJuego, titulo: e.target.value})}
                required
              />
              <input
                type="text"
                value={editandoJuego.genero}
                onChange={(e) => setEditandoJuego({...editandoJuego, genero: e.target.value})}
                required
              />
              <input
                type="text"
                value={editandoJuego.plataforma}
                onChange={(e) => setEditandoJuego({...editandoJuego, plataforma: e.target.value})}
                required
              />
              <div className="modal-buttons">
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setEditandoJuego(null)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="juegos-grid">
        {juegos.map(juego => (
          <div key={juego._id} className="juego-card">
            <img src={juego.imagenPortada} alt={juego.titulo} className="juego-imagen" />
            <h3 className="juego-titulo">{juego.titulo}</h3>
            <p className="juego-genero">{juego.genero}</p>
            <p className="juego-plataforma">{juego.plataforma}</p>
            <span className={`juego-estado ${juego.completado ? 'completado' : 'pendiente'}`}>
              {juego.completado ? '✅ Completado' : '⏳ Pendiente'}
            </span>
            
            {/* Botones de acciones */}
            <div className="juego-acciones">
              <button 
                className="btn-editar"
                onClick={() => setEditandoJuego(juego)}
              >
                ✏️ Editar
              </button>
              <button 
                className="btn-eliminar"
                onClick={() => eliminarJuego(juego._id)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BibliotecaJuegos;
