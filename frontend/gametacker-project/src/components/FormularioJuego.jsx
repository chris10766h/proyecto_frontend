import React, { useState } from 'react';
import axios from 'axios';
import './FormularioJuego.css';

const FormularioJuego = ({ onJuegoAgregado }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    genero: '',
    plataforma: '',
    añoLanzamiento: '',
    desarrollador: '',
    imagenPortada: '',
    descripcion: '',
    completado: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await axios.post('http://localhost:5000/api/juegos', {
        ...formData,
        añoLanzamiento: parseInt(formData.añoLanzamiento)
      });
      onJuegoAgregado(respuesta.data);
      // Limpiar formulario
      setFormData({
        titulo: '',
        genero: '',
        plataforma: '',
        añoLanzamiento: '',
        desarrollador: '',
        imagenPortada: '',
        descripcion: '',
        completado: false
      });
      alert('¡Juego agregado exitosamente!');
    } catch (error) {
      console.error('Error agregando juego:', error);
      alert('Error al agregar el juego');
    }
  };

  return (
    <div className="formulario-juego-container">
      {/* FORMULARIO DIRECTO - SIN BOTÓN DE MOSTRAR/OCULTAR */}
      <form onSubmit={handleSubmit} className="formulario-juego">
        <div className="form-fila">
          <div className="form-grupo">
            <label>Título del Juego *</label>
            <input
              type="text"
              name="titulo"
              placeholder="Ej: The Legend of Zelda: Breath of the Wild"
              value={formData.titulo}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-grupo">
            <label>Género *</label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
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
              name="plataforma"
              value={formData.plataforma}
              onChange={handleChange}
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
              name="añoLanzamiento"
              min="1980"
              max="2025"
              placeholder="2023"
              value={formData.añoLanzamiento}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-grupo">
          <label>Desarrollador *</label>
          <input
            type="text"
            name="desarrollador"
            placeholder="Ej: Nintendo, Rockstar Games, Mojang Studios"
            value={formData.desarrollador}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-grupo">
          <label>URL de la Imagen de Portada *</label>
          <input
            type="url"
            name="imagenPortada"
            placeholder="https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7y.jpg"
            value={formData.imagenPortada}
            onChange={handleChange}
            required
          />
          {formData.imagenPortada && (
            <div className="vista-previa">
              <img 
                src={formData.imagenPortada} 
                alt="Vista previa" 
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span>Vista previa de portada</span>
            </div>
          )}
        </div>

        <div className="form-grupo">
          <label>Descripción *</label>
          <textarea
            name="descripcion"
            placeholder="Describe el juego, su historia, características principales, modo de juego..."
            rows="4"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="completado"
            checked={formData.completado}
            onChange={handleChange}
          />
          <span className="checkmark"></span>
          ¿Ya completaste este juego?
        </label>

        <button type="submit" className="btn-agregar">
          🎯 Agregar a mi Biblioteca
        </button>
      </form>
    </div>
  );
};

export default FormularioJuego;