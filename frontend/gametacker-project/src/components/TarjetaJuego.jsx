import React from 'react';
import './TarjetaJuego.css';



const TarjetaJuego = ({ juego, onEditar, onEliminar }) => {
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
        </div>
      </div>
      
      <div className="tarjeta-contenido">
        <h3 className="tarjeta-titulo">{juego.titulo}</h3>
        <p className="tarjeta-desarrollador">por {juego.desarrollador}</p>
        <p className="tarjeta-genero">🎮 {juego.genero}</p>
        <p className="tarjeta-descripcion">{juego.descripcion}</p>
        
        <div className="tarjeta-estado-container">
          <span className={`estado ${juego.completado ? 'completado' : 'pendiente'}`}>
            {juego.completado ? '✅ Completado' : '⏳ Pendiente'}
          </span>
        </div>
        
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