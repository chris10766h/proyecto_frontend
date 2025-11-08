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
      
      {/* MODAL DE EDICIÓN COMPLETO */}
      {editandoJuego && (
        <div className="modal-overlay">
          <div className="modal-edicion">
            <div className="modal-header">
              <h3>✏️ Editar Juego</h3>
              <button 
                className="btn-cerrar"
                onClick={() => setEditandoJuego(null)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={actualizarJuego} className="formulario-edicion">
              <div className="form-fila">
                <div className="form-grupo">
                  <label>Título del Juego *</label>
                  <input
                    type="text"
                    value={editandoJuego.titulo}
                    onChange={(e) => setEditandoJuego({...editandoJuego, titulo: e.target.value})}
                    placeholder="Ej: The Legend of Zelda"
                    required
                  />
                </div>
                
                <div className="form-grupo">
                  <label>Género *</label>
                  <select
                    value={editandoJuego.genero}
                    onChange={(e) => setEditandoJuego({...editandoJuego, genero: e.target.value})}
                    required
                  >
                    <option value="">Selecciona un género</option>
                    <option value="Acción">Acción</option>
                    <option value="Aventura">Aventura</option>
                    <option value="RPG">RPG</option>
                    <option value="Estrategia">Estrategia</option>
                    <option value="Shooter">Shooter</option>
                    <option value="Deportes">Deportes</option>
                    <option value="Sandbox">Sandbox</option>
                    <option value="Plataformas">Plataformas</option>
                    <option value="MMO">MMO</option>
                    <option value="Simulación">Simulación</option>
                    <option value="Puzzle">Puzzle</option>
                    <option value="Terror">Terror</option>
                  </select>
                </div>
              </div>

              <div className="form-fila">
                <div className="form-grupo">
                  <label>Plataforma *</label>
                  <select
                    value={editandoJuego.plataforma}
                    onChange={(e) => setEditandoJuego({...editandoJuego, plataforma: e.target.value})}
                    required
                  >
                    <option value="">Selecciona plataforma</option>
                    <option value="PC">PC</option>
                    <option value="PlayStation 5">PlayStation 5</option>
                    <option value="PlayStation 4">PlayStation 4</option>
                    <option value="Xbox Series X">Xbox Series X</option>
                    <option value="Xbox One">Xbox One</option>
                    <option value="Nintendo Switch">Nintendo Switch</option>
                    <option value="Nintendo 3DS">Nintendo 3DS</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Multiplataforma">Multiplataforma</option>
                  </select>
                </div>
                
                <div className="form-grupo">
                  <label>Año de Lanzamiento *</label>
                  <input
                    type="number"
                    value={editandoJuego.añoLanzamiento}
                    onChange={(e) => setEditandoJuego({...editandoJuego, añoLanzamiento: parseInt(e.target.value)})}
                    min="1980"
                    max="2025"
                    placeholder="2023"
                    required
                  />
                </div>
              </div>

              <div className="form-grupo">
                <label>Desarrollador *</label>
                <input
                  type="text"
                  value={editandoJuego.desarrollador}
                  onChange={(e) => setEditandoJuego({...editandoJuego, desarrollador: e.target.value})}
                  placeholder="Ej: Nintendo, Rockstar Games"
                  required
                />
              </div>

              <div className="form-grupo">
                <label>URL de la Imagen de Portada *</label>
                <input
                  type="url"
                  value={editandoJuego.imagenPortada}
                  onChange={(e) => setEditandoJuego({...editandoJuego, imagenPortada: e.target.value})}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  required
                />
                {editandoJuego.imagenPortada && (
                  <div className="vista-previa">
                    <img 
                      src={editandoJuego.imagenPortada} 
                      alt="Vista previa" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <span>Vista previa</span>
                  </div>
                )}
              </div>

              <div className="form-grupo">
                <label>Descripción *</label>
                <textarea
                  value={editandoJuego.descripcion}
                  onChange={(e) => setEditandoJuego({...editandoJuego, descripcion: e.target.value})}
                  placeholder="Describe el juego, su historia, características principales..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-fila-final">
                <label className="checkbox-completado">
                  <input
                    type="checkbox"
                    checked={editandoJuego.completado}
                    onChange={(e) => setEditandoJuego({...editandoJuego, completado: e.target.checked})}
                  />
                  <span className="checkmark"></span>
                  ¿Has completado este juego?
                </label>

                <div className="modal-buttons">
                  <button type="button" className="btn-cancelar" onClick={() => setEditandoJuego(null)}>
                    ❌ Cancelar
                  </button>
                  <button type="submit" className="btn-guardar">
                    💾 Guardar Cambios
                  </button>
                </div>
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