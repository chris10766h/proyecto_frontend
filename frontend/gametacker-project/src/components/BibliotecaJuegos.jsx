import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TarjetaJuego from './TarjetaJuego';
import './BibliotecaJuegos.css';

const BibliotecaJuegos = () => {
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editandoJuego, setEditandoJuego] = useState(null);


  const obtenerJuegos = async () => {
    try {
      console.log('🔄 Obteniendo juegos...');
      const respuesta = await axios.get('http://localhost:5000/api/juegos');
      console.log('✅ Juegos obtenidos:', respuesta.data);
      setJuegos(respuesta.data);
      setCargando(false);
    } catch (error) {
      console.error('❌ Error obteniendo juegos:', error);
      setCargando(false);
    }
  };

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

  return (
    <div className="biblioteca-container">
      <h1 className="biblioteca-titulo">🎮 Mi Biblioteca de Juegos</h1>
      <p className="biblioteca-subtitulo">
        {juegos.length} juego{juegos.length !== 1 ? 's' : ''} en tu colección
      </p>
      
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

      {cargando ? (
        <div className="cargando-container">
          <div className="cargando-spinner"></div>
          <p>Cargando tu biblioteca...</p>
        </div>
      ) : (
        <div className="juegos-grid">
          {juegos.map(juego => (
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