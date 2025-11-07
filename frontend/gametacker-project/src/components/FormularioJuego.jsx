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
      const respuesta = await axios.post('http://localhost:5000/api/juegos', formData);
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
    <div className="formulario-container">
      <h2>➕ Agregar Nuevo Juego</h2>
      <form onSubmit={handleSubmit} className="formulario-juego">
        <input
          type="text"
          name="titulo"
          placeholder="Título del juego"
          value={formData.titulo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="genero"
          placeholder="Género (Ej: Aventura, RPG)"
          value={formData.genero}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="plataforma"
          placeholder="Plataforma (Ej: PC, PlayStation)"
          value={formData.plataforma}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="añoLanzamiento"
          placeholder="Año de lanzamiento"
          value={formData.añoLanzamiento}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="desarrollador"
          placeholder="Desarrollador"
          value={formData.desarrollador}
          onChange={handleChange}
          required
        />
        <input
          type="url"
          name="imagenPortada"
          placeholder="URL de la imagen de portada"
          value={formData.imagenPortada}
          onChange={handleChange}
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción del juego"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="completado"
            checked={formData.completado}
            onChange={handleChange}
          />
          ¿Completado?
        </label>
        <button type="submit" className="btn-agregar">Agregar Juego</button>
      </form>
    </div>
  );
};

export default FormularioJuego;