import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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

  const [cargando, setCargando] = useState(true);

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
        setCargando(false);
      } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        setCargando(false);
      }
    };

    obtenerEstadisticas();
  }, []);

  const calcularPorcentaje = (valor, total) => {
    return total > 0 ? ((valor / total) * 100).toFixed(0) : 0;
  };

  const getGeneroMasPopular = () => {
    const entries = Object.entries(estadisticas.juegosPorGenero);
    return entries.length > 0 ? entries.reduce((a, b) => a[1] > b[1] ? a : b) : ['N/A', 0];
  };

  const getPlataformaMasPopular = () => {
    const entries = Object.entries(estadisticas.juegosPorPlataforma);
    return entries.length > 0 ? entries.reduce((a, b) => a[1] > b[1] ? a : b) : ['N/A', 0];
  };

  const [generoMasPopular] = getGeneroMasPopular();
  const [plataformaMasPopular] = getPlataformaMasPopular();

  // 📄 Función para exportar estadísticas a PDF
  const exportarEstadisticasPDF = () => {
    const elemento = document.querySelector(".estadisticas-container");

    if (!elemento) {
      console.error("❌ No se encontró el contenedor de estadísticas (.estadisticas-container)");
      return;
    }

    html2canvas(elemento, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      pdf.setFontSize(16);
      pdf.text("📊 Dashboard de GameTracker", 10, 15);

      const ancho = pdf.internal.pageSize.getWidth();
      const alto = (canvas.height * ancho) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 25, ancho, alto);

      const fecha = new Date().toLocaleDateString();
      pdf.setFontSize(10);
      pdf.text(`📅 Exportado el: ${fecha}`, 150, 15);

      pdf.save("Estadisticas_GameTracker.pdf");
    });
  };

  if (cargando) {
    return (
      <div className="estadisticas-container">
        <div className="cargando-estadisticas">
          <div className="spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="estadisticas-container">
      <div className="estadisticas-header">
        <h2 className="estadisticas-titulo">📊 Dashboard de Gaming</h2>
        <button className="btn-exportar" onClick={exportarEstadisticasPDF}>
          📄 Exportar a PDF
        </button>
      </div>

      {/* TARJETAS PRINCIPALES */}
      <div className="estadisticas-grid">
        <div className="estadistica-card total">
          <div className="estadistica-icon">🎮</div>
          <div className="estadistica-content">
            <h3>Biblioteca Total</h3>
            <span className="estadistica-valor">{estadisticas.totalJuegos}</span>
            <span className="estadistica-desc">juegos en colección</span>
          </div>
        </div>

        <div className="estadistica-card progreso">
          <div className="estadistica-icon">📈</div>
          <div className="estadistica-content">
            <h3>Progreso</h3>
            <div className="progreso-info">
              <span className="progreso-completados">{estadisticas.juegosCompletados} completados</span>
              <span className="progreso-porcentaje">
                {calcularPorcentaje(estadisticas.juegosCompletados, estadisticas.totalJuegos)}%
              </span>
            </div>
            <div className="progreso-bar">
              <div 
                className="progreso-fill"
                style={{
                  width: `${calcularPorcentaje(estadisticas.juegosCompletados, estadisticas.totalJuegos)}%`
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="estadistica-card reseñas">
          <div className="estadistica-icon">⭐</div>
          <div className="estadistica-content">
            <h3>Reseñas</h3>
            <span className="estadistica-valor">{estadisticas.totalResenas}</span>
            <span className="estadistica-desc">opiniones escritas</span>
          </div>
        </div>

        <div className="estadistica-card puntuacion">
          <div className="estadistica-icon">🏆</div>
          <div className="estadistica-content">
            <h3>Puntuación Promedio</h3>
            <span className="estadistica-valor">{estadisticas.promedioPuntuacion}/5</span>
            <div className="estrellas-promedio">
              {'⭐'.repeat(Math.round(estadisticas.promedioPuntuacion))}
              {'☆'.repeat(5 - Math.round(estadisticas.promedioPuntuacion))}
            </div>
          </div>
        </div>

        <div className="estadistica-card horas">
          <div className="estadistica-icon">⏰</div>
          <div className="estadistica-content">
            <h3>Tiempo Invertido</h3>
            <span className="estadistica-valor">{estadisticas.totalHorasJugadas}h</span>
            <span className="estadistica-desc">total jugadas</span>
          </div>
        </div>

        <div className="estadistica-card preferencias">
          <div className="estadistica-icon">❤️</div>
          <div className="estadistica-content">
            <h3>Preferencias</h3>
            <div className="preferencias-list">
              <div className="preferencia-item">
                <span>Género favorito:</span>
                <strong>{generoMasPopular}</strong>
              </div>
              <div className="preferencia-item">
                <span>Plataforma principal:</span>
                <strong>{plataformaMasPopular}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GRÁFICOS DE DISTRIBUCIÓN */}
      <div className="distribuciones-grid">
        {/* Distribución por género */}
        <div className="distribucion-card">
          <h3>🎮 Distribución por Género</h3>
          <div className="distribucion-lista">
            {Object.entries(estadisticas.juegosPorGenero)
              .sort(([,a], [,b]) => b - a)
              .map(([genero, cantidad]) => (
                <div key={genero} className="distribucion-item">
                  <div className="distribucion-header">
                    <span className="distribucion-label">{genero}</span>
                    <span className="distribucion-porcentaje">
                      {calcularPorcentaje(cantidad, estadisticas.totalJuegos)}%
                    </span>
                  </div>
                  <div className="distribucion-bar">
                    <div 
                      className="distribucion-fill"
                      style={{
                        width: `${calcularPorcentaje(cantidad, estadisticas.totalJuegos)}%`,
                        background: `hsl(${Math.random() * 360}, 70%, 60%)`
                      }}
                    ></div>
                  </div>
                  <span className="distribucion-valor">{cantidad} juegos</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Distribución por plataforma */}
        <div className="distribucion-card">
          <h3>🖥️ Plataformas</h3>
          <div className="plataformas-grid">
            {Object.entries(estadisticas.juegosPorPlataforma)
              .sort(([,a], [,b]) => b - a)
              .map(([plataforma, cantidad]) => (
                <div key={plataforma} className="plataforma-item">
                  <div className="plataforma-icon">
                    {plataforma.includes('PlayStation') && '🎮'}
                    {plataforma.includes('Xbox') && '🎯'}
                    {plataforma.includes('Nintendo') && '🍄'}
                    {plataforma === 'PC' && '💻'}
                    {plataforma === 'Mobile' && '📱'}
                    {!['PlayStation', 'Xbox', 'Nintendo', 'PC', 'Mobile'].some(p => plataforma.includes(p)) && '🎪'}
                  </div>
                  <div className="plataforma-info">
                    <span className="plataforma-nombre">{plataforma}</span>
                    <span className="plataforma-cantidad">{cantidad} juegos</span>
                  </div>
                  <div className="plataforma-porcentaje">
                    {calcularPorcentaje(cantidad, estadisticas.totalJuegos)}%
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* RESUMEN FINAL */}
      <div className="resumen-final">
        <h3>📋 Resumen General</h3>
        <div className="resumen-grid">
          <div className="resumen-item">
            <span className="resumen-label">Tasa de Completado</span>
            <span className="resumen-valor">
              {calcularPorcentaje(estadisticas.juegosCompletados, estadisticas.totalJuegos)}%
            </span>
          </div>
          <div className="resumen-item">
            <span className="resumen-label">Ratio Reseñas/Juego</span>
            <span className="resumen-valor">
              {(estadisticas.totalResenas / estadisticas.totalJuegos).toFixed(1)}
            </span>
          </div>
          <div className="resumen-item">
            <span className="resumen-label">Horas por Juego</span>
            <span className="resumen-valor">
              {(estadisticas.totalHorasJugadas / estadisticas.totalJuegos).toFixed(0)}h
            </span>
          </div>
          <div className="resumen-item">
            <span className="resumen-label">Género Más Popular</span>
            <span className="resumen-valor">{generoMasPopular}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasPersonales;
