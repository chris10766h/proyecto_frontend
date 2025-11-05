import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BibliotecaJuegos.css';

const BibliotecaJuegos = () => {
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Obtener juegos desde el backend
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

  useEffect(() => {
    obtenerJuegos();
  }, []);

  if (cargando) {
    return <div className="cargando">Cargando juegos...</div>;
  }

  return (
    <div className="biblioteca-container">
      <h1 className="biblioteca-titulo">🎮 Mi Biblioteca de Juegos</h1>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default BibliotecaJuegos;