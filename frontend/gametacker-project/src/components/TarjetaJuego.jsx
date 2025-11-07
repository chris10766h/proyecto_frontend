import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TarjetaJuego.css';

const TarjetaJuego = ({ juego, onEditar, onEliminar }) => {
  const [reseñas, setReseñas] = useState([]);
  const [mostrarReseñas, setMostrarReseñas] = useState(false);
  const [cargandoReseñas, setCargandoReseñas] = useState(false);

  // CARGAR RESEÑAS AUTOMÁTICAMENTE al montar el componente
  useEffect(() => {
    const cargarReseñas = async () => {
      try {
        const respuesta = await axios.get(`http://localhost:5000/api/resenas/juego/${juego._id}`);
        setReseñas(respuesta.data);
      } catch (error) {
        console.error('Error cargando reseñas:', error);
      }
    };
    cargarReseñas();
  }, [juego._id]); // Se recarga cuando cambia el ID del juego

  const obtenerReseñas = async () => {
    if (!mostrarReseñas) {
      setCargandoReseñas(true);
      try {
        const respuesta = await axios.get(`http://localhost:5000/api/resenas/juego/${juego._id}`);
        setReseñas(respuesta.data);
      } catch (error) {
        console.error('Error obteniendo reseñas:', error);
      }
      setCargandoReseñas(false);
    }
    setMostrarReseñas(!mostrarReseñas);
  };

  const calcularPuntuacionPromedio = () => {
    if (reseñas.length === 0) return 0;
    const suma = reseñas.reduce((total, reseña) => total + reseña.puntuacion, 0);
    return (suma / reseñas.length).toFixed(1);
  };

  const puntuacionPromedio = calcularPuntuacionPromedio();

  return (
    <div className="tarjeta-juego">
      <div className="tarjeta-imagen-container">
        <img 
          src={juego.imagenPortada} 
          alt={juego.titulo} 
          className="tarjeta-imagen"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x400/ecf0f1/7f8c8d?text=Imagen+No+Disponible';
          }}
        />
        <div className="tarjeta-badges">
          <span className="badge plataforma">{juego.plataforma}</span>
          <span className="badge año">{juego.añoLanzamiento}</span>
          {reseñas.length > 0 && (
            <span className="badge reseñas">
              ⭐ {puntuacionPromedio} ({reseñas.length})
            </span>
          )}
        </div>
      </div>
      
      <div className="tarjeta-contenido">
        <h3 className="tarjeta-titulo">{juego.titulo}</h3>
        <p className="tarjeta-desarrollador">por {juego.desarrollador}</p>
        <p className="tarjeta-genero">🎮 {juego.genero}</p>
        <p className="tarjeta-descripcion">{juego.descripcion}</p>
        
        <div className="tarjeta-estadisticas">
          <span className={`estado ${juego.completado ? 'completado' : 'pendiente'}`}>
            {juego.completado ? '✅ Completado' : '⏳ Pendiente'}
          </span>
          <span className="contador-reseñas" onClick={obtenerReseñas}>
            📝 {reseñas.length} reseña{reseñas.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Sección de reseñas */}
        {mostrarReseñas && (
          <div className="reseñas-container">
            <h4>📋 Reseñas ({reseñas.length})</h4>
            {cargandoReseñas ? (
              <p>Cargando reseñas...</p>
            ) : reseñas.length > 0 ? (
              <div className="lista-reseñas">
                {reseñas.map(reseña => (
                  <div key={reseña._id} className="reseña-item">
                    <div className="reseña-header">
                      <span className="reseña-estrellas">
                        {'⭐'.repeat(reseña.puntuacion)}
                        {'☆'.repeat(5 - reseña.puntuacion)}
                      </span>
                      <span className="reseña-meta">
                        {reseña.horasJugadas}h • {reseña.dificultad}
                      </span>
                    </div>
                    <p className="reseña-texto">"{reseña.textoReseña}"</p>
                    <div className="reseña-footer">
                      <span className={`recomendacion ${reseña.recomendaria ? 'recomendado' : 'no-recomendado'}`}>
                        {reseña.recomendaria ? '👍 Recomendado' : '👎 No recomendado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="sin-reseñas">Aún no hay reseñas para este juego.</p>
            )}
          </div>
        )}
        
        <div className="tarjeta-acciones">
          <button 
            className="btn btn-editar"
            onClick={() => onEditar(juego)}
            title="Editar juego"
          >
            ✏️ Editar
          </button>
          <button 
            className="btn btn-eliminar"
            onClick={() => onEliminar(juego._id)}
            title="Eliminar juego"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TarjetaJuego;