import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EstadisticasPersonales.css';

const EstadisticasPersonales = () => {
  const [estadisticas, setEstadisticas] = useState({
    totalJuegos: 0,
    juegosCompletados: 0,
    juegosPendientes: 0,
    totalResenas: 0,
    promedioPuntuacion: 0,
    totalHorasJugadas: 0,
    juegosPorGenero: {},
    juegosPorPlataforma: {}
  });

  useEffect(() => {
    const obtenerEstadisticas = async () => {
      try {
        const [juegosRes, reseñasRes] = await Promise.all([
          axios.get('http://localhost:5000/api/juegos'),
          axios.get('http://localhost:5000/api/resenas')
        ]);

        const juegos = juegosRes.data;
        const reseñas = reseñasRes.data;

        // Calcular estadísticas
        const totalJuegos = juegos.length;
        const juegosCompletados = juegos.filter(j => j.completado).length;
        const juegosPendientes = totalJuegos - juegosCompletados;
        const totalResenas = reseñas.length;
        
        const promedioPuntuacion = reseñas.length > 0 
          ? (reseñas.reduce((sum, r) => sum + r.puntuacion, 0) / reseñas.length).toFixed(1)
          : 0;

        const totalHorasJugadas = reseñas.reduce((sum, r) => sum + r.horasJugadas, 0);

        // Juegos por género
        const juegosPorGenero = {};
        juegos.forEach(juego => {
          juegosPorGenero[juego.genero] = (juegosPorGenero[juego.genero] || 0) + 1;
        });

        // Juegos por plataforma
        const juegosPorPlataforma = {};
        juegos.forEach(juego => {
          juegosPorPlataforma[juego.plataforma] = (juegosPorPlataforma[juego.plataforma] || 0) + 1;
        });

        setEstadisticas({
          totalJuegos,
          juegosCompletados,
          juegosPendientes,
          totalResenas,
          promedioPuntuacion,
          totalHorasJugadas,
          juegosPorGenero,
          juegosPorPlataforma
        });
      } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
      }
    };

    obtenerEstadisticas();
  }, []);

  const calcularPorcentaje = (valor, total) => {
    return total > 0 ? ((valor / total) * 100).toFixed(0) : 0;
  };

  return (
    <div className="estadisticas-container">
      <h2>📊 Mis Estadísticas de Gaming</h2>
      
      <div className="estadisticas-grid">
        {/* Tarjetas de resumen */}
        <div className="estadistica-card total">
          <div className="estadistica-icon">🎮</div>
          <div className="estadistica-info">
            <h3>Total Juegos</h3>
            <span className="estadistica-valor">{estadisticas.totalJuegos}</span>
          </div>
        </div>

        <div className="estadistica-card completados">
          <div className="estadistica-icon">✅</div>
          <div className="estadistica-info">
            <h3>Completados</h3>
            <span className="estadistica-valor">{estadisticas.juegosCompletados}</span>
            <span className="estadistica-porcentaje">
              {calcularPorcentaje(estadisticas.juegosCompletados, estadisticas.totalJuegos)}%
            </span>
          </div>
        </div>

        <div className="estadistica-card pendientes">
          <div className="estadistica-icon">⏳</div>
          <div className="estadistica-info">
            <h3>Pendientes</h3>
            <span className="estadistica-valor">{estadisticas.juegosPendientes}</span>
            <span className="estadistica-porcentaje">
              {calcularPorcentaje(estadisticas.juegosPendientes, estadisticas.totalJuegos)}%
            </span>
          </div>
        </div>

        <div className="estadistica-card reseñas">
          <div className="estadistica-icon">⭐</div>
          <div className="estadistica-info">
            <h3>Reseñas</h3>
            <span className="estadistica-valor">{estadisticas.totalResenas}</span>
          </div>
        </div>

        <div className="estadistica-card puntuacion">
          <div className="estadistica-icon">🏆</div>
          <div className="estadistica-info">
            <h3>Puntuación Promedio</h3>
            <span className="estadistica-valor">{estadisticas.promedioPuntuacion}/5</span>
          </div>
        </div>

        <div className="estadistica-card horas">
          <div className="estadistica-icon">⏰</div>
          <div className="estadistica-info">
            <h3>Horas Jugadas</h3>
            <span className="estadistica-valor">{estadisticas.totalHorasJugadas}h</span>
          </div>
        </div>
      </div>

      {/* Distribución por género */}
      <div className="distribucion-section">
        <h3>🎯 Distribución por Género</h3>
        <div className="distribucion-grid">
          {Object.entries(estadisticas.juegosPorGenero).map(([genero, cantidad]) => (
            <div key={genero} className="distribucion-item">
              <span className="distribucion-label">{genero}</span>
              <div className="distribucion-bar">
                <div 
                  className="distribucion-fill"
                  style={{
                    width: `${calcularPorcentaje(cantidad, estadisticas.totalJuegos)}%`
                  }}
                ></div>
              </div>
              <span className="distribucion-valor">{cantidad}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Distribución por plataforma */}
      <div className="distribucion-section">
        <h3>🖥️ Distribución por Plataforma</h3>
        <div className="distribucion-grid">
          {Object.entries(estadisticas.juegosPorPlataforma).map(([plataforma, cantidad]) => (
            <div key={plataforma} className="distribucion-item">
              <span className="distribucion-label">{plataforma}</span>
              <div className="distribucion-bar">
                <div 
                  className="distribucion-fill"
                  style={{
                    width: `${calcularPorcentaje(cantidad, estadisticas.totalJuegos)}%`
                  }}
                ></div>
              </div>
              <span className="distribucion-valor">{cantidad}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EstadisticasPersonales;