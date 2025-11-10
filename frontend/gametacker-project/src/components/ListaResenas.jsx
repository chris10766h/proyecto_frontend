import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./ListaResenas.css";

const ListaResenas = ({ juegoId = null }) => {
  const [reseñas, setReseñas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerReseñas = async () => {
      try {
        const url = juegoId
          ? `http://localhost:5000/api/resenas/juego/${juegoId}`
          : "http://localhost:5000/api/resenas";
        const respuesta = await axios.get(url);
        setReseñas(respuesta.data);
      } catch (error) {
        console.error("Error al obtener reseñas:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerReseñas();
  }, [juegoId]);

  // 📄 Función para exportar reseñas a PDF
  const exportarResenasPDF = () => {
    const elemento = document.querySelector(".listado-reseñas");

    if (!elemento) {
      console.error("❌ No se encontró el contenedor de reseñas (.listado-reseñas)");
      return;
    }

    html2canvas(elemento, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      pdf.setFontSize(16);
      pdf.text("📚 Reseñas de Juegos", 10, 15);

      const ancho = pdf.internal.pageSize.getWidth();
      const alto = (canvas.height * ancho) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 25, ancho, alto);

      const fecha = new Date().toLocaleDateString();
      pdf.setFontSize(10);
      pdf.text(`📅 Exportado el: ${fecha}`, 150, 15);

      pdf.save("Reseñas_Juegos.pdf");
    });
  };

  if (cargando) return <p>Cargando reseñas...</p>;

  return (
    <div className="listado-reseñas">
      <div className="reseñas-header">
        <h2>{juegoId ? "📝 Reseñas del juego" : "📚 Todas las reseñas"}</h2>
        <button className="btn-exportar" onClick={exportarResenasPDF}>
          📄 Exportar a PDF
        </button>
      </div>

      {reseñas.length === 0 ? (
        <p>No hay reseñas registradas aún.</p>
      ) : (
        <div className="reseñas-grid">
          {reseñas.map((r) => (
            <div key={r._id} className="reseña-card">
              <h3>{r.juegoId?.titulo || "Juego no disponible"}</h3>
              <p>⭐ Puntuación: {r.puntuacion}/5</p>
              <p>🎮 Horas jugadas: {r.horasJugadas}</p>
              <p>🎯 Dificultad: {r.dificultad}</p>
              <p>{r.textoReseña}</p>
              <p>
                {r.recomendaria
                  ? "✅ Recomendaría este juego"
                  : "❌ No lo recomendaría"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaResenas;
