import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FormularioResena.css';

const FormularioResena = ({ juegos, onResenaAgregada }) => {
  const [formData, setFormData] = useState({
    juegoId: '',
    puntuacion: 0,
    textoReseña: '',
    horasJugadas: 0,
    dificultad: 'Normal',
    recomendaria: true
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePuntuacion = (estrellas) => {
    setFormData(prevState => ({
      ...prevState,
      puntuacion: estrellas
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await axios.post('http://localhost:5000/api/resenas', formData);
      onResenaAgregada(respuesta.data);
      setFormData({
        juegoId: '',
        puntuacion: 0,
        textoReseña: '',
        horasJugadas: 0,
        dificultad: 'Normal',
        recomendaria: true
      });
      setMostrarFormulario(false);
      alert('¡Reseña agregada exitosamente!');
    } catch (error) {
      console.error('Error agregando reseña:', error);
      alert('Error al agregar la reseña');
    }
  };

  return (
    <div className="formulario-resena-container">
      <button 
        className="btn-mostrar-formulario"
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
      >
        {mostrarFormulario ? '❌ Cancelar' : '📝 Agregar Reseña'}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="formulario-resena">
          <h3>✍️ Escribir Nueva Reseña</h3>
          
          <select
            name="juegoId"
            value={formData.juegoId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un juego</option>
            {juegos.map(juego => (
              <option key={juego._id} value={juego._id}>
                {juego.titulo}
              </option>
            ))}
          </select>

          <div className="puntuacion-estrellas">
            <label>Puntuación:</label>
            <div className="estrellas">
              {[1, 2, 3, 4, 5].map(estrella => (
                <span
                  key={estrella}
                  className={`estrella ${estrella <= formData.puntuacion ? 'activa' : ''}`}
                  onClick={() => handlePuntuacion(estrella)}
                >
                  ⭐
                </span>
              ))}
            </div>
            <span className="puntuacion-texto">
              {formData.puntuacion > 0 ? `${formData.puntuacion} estrella${formData.puntuacion !== 1 ? 's' : ''}` : 'Sin puntuar'}
            </span>
          </div>

          <textarea
            name="textoReseña"
            placeholder="Escribe tu reseña aquí..."
            value={formData.textoReseña}
            onChange={handleChange}
            required
          />

          <div className="form-fila">
            <div className="form-grupo">
              <label>Horas jugadas:</label>
              <input
                type="number"
                name="horasJugadas"
                min="0"
                value={formData.horasJugadas}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-grupo">
              <label>Dificultad:</label>
              <select
                name="dificultad"
                value={formData.dificultad}
                onChange={handleChange}
                required
              >
                <option value="Fácil">Fácil</option>
                <option value="Normal">Normal</option>
                <option value="Difícil">Difícil</option>
                <option value="Muy Difícil">Muy Difícil</option>
              </select>
            </div>
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="recomendaria"
              checked={formData.recomendaria}
              onChange={handleChange}
            />
            ¿Recomendarías este juego?
          </label>

          <button type="submit" className="btn-agregar-resena">
            📤 Publicar Reseña
          </button>
        </form>
      )}
    </div>
  );
};

export default FormularioResena;