import React, { useEffect, useState } from "react";
import axios from "axios";
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

  if (cargando) return <p>Cargando reseñas...</p>;

  return (
    <div className="listado-reseñas">
      <h2>{juegoId ? "📝 Reseñas del juego" : "📚 Todas las reseñas"}</h2>
      {reseñas.length === 0 ? (
        <p>No hay reseñas registradas aún.</p>
      ) : (
        reseñas.map((r) => (
          <div key={r._id} className="reseña-card">
            <h3>{r.juegoId?.titulo || "Juego no disponible"}</h3>
            <p>⭐ Puntuación: {r.puntuacion}/5</p>
            <p>🎮 Horas jugadas: {r.horasJugadas}</p>
            <p>🎯 Dificultad: {r.dificultad}</p>
            <p>{r.textoReseña}</p>
            <p>
              {r.recomendaria ? "✅ Recomendaría este juego" : "❌ No lo recomendaría"}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default ListaResenas;
