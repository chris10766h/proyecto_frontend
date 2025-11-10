import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import TarjetaJuego from "./TarjetaJuego";
import "./BibliotecaJuegos.css";

const BibliotecaJuegos = () => {
  const [juegos, setJuegos] = useState([]);
  const [juegosFiltrados, setJuegosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editandoJuego, setEditandoJuego] = useState(null);

  // Estados de filtros y búsqueda
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("");
  const [filtroPlataforma, setFiltroPlataforma] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroAño, setFiltroAño] = useState("");

  // 🔹 Obtener lista de juegos
  const obtenerJuegos = async () => {
    try {
      console.log("🔄 Obteniendo juegos...");
      const respuesta = await axios.get("http://localhost:5000/api/juegos");
      console.log("✅ Juegos obtenidos:", respuesta.data);
      setJuegos(respuesta.data);
      setJuegosFiltrados(respuesta.data);
      setCargando(false);
    } catch (error) {
      console.error("❌ Error obteniendo juegos:", error);
      setCargando(false);
    }
  };

  // 🔎 Aplicar filtros
  const aplicarFiltros = () => {
    let resultados = [...juegos];

    if (terminoBusqueda) {
      resultados = resultados.filter(
        (juego) =>
          juego.titulo.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
          juego.desarrollador.toLowerCase().includes(terminoBusqueda.toLowerCase())
      );
    }

    if (filtroGenero) resultados = resultados.filter((j) => j.genero === filtroGenero);
    if (filtroPlataforma) resultados = resultados.filter((j) => j.plataforma === filtroPlataforma);
    if (filtroEstado) {
      const estadoBool = filtroEstado === "completado";
      resultados = resultados.filter((j) => j.completado === estadoBool);
    }
    if (filtroAño)
      resultados = resultados.filter((j) => j.añoLanzamiento.toString() === filtroAño);

    setJuegosFiltrados(resultados);
  };

  useEffect(() => {
    aplicarFiltros();
  }, [terminoBusqueda, filtroGenero, filtroPlataforma, filtroEstado, filtroAño, juegos]);

  // Limpiar filtros
  const limpiarFiltros = () => {
    setTerminoBusqueda("");
    setFiltroGenero("");
    setFiltroPlataforma("");
    setFiltroEstado("");
    setFiltroAño("");
    setJuegosFiltrados(juegos);
  };

  // Eliminar un juego
  const eliminarJuego = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este juego?")) {
      try {
        await axios.delete(`http://localhost:5000/api/juegos/${id}`);
        obtenerJuegos();
        alert("Juego eliminado correctamente");
      } catch (error) {
        console.error("Error eliminando juego:", error);
        alert("Error al eliminar el juego");
      }
    }
  };

  // Actualizar un juego
  const actualizarJuego = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/juegos/${editandoJuego._id}`, editandoJuego);
      setEditandoJuego(null);
      obtenerJuegos();
      alert("Juego actualizado correctamente");
    } catch (error) {
      console.error("Error actualizando juego:", error);
      alert("Error al actualizar el juego");
    }
  };

  useEffect(() => {
    obtenerJuegos();
  }, []);

  // 📄 Exportar biblioteca a PDF
  const exportarPDF = () => {
    const elemento = document.querySelector(".juegos-grid");

    if (!elemento) {
      console.error("❌ No se encontró el contenedor .juegos-grid");
      return;
    }

    html2canvas(elemento, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      pdf.setFontSize(16);
      pdf.text("🎮 Mi Biblioteca - GameTracker", 10, 15);

      const ancho = pdf.internal.pageSize.getWidth();
      const alto = (canvas.height * ancho) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 25, ancho, alto);

      const fecha = new Date().toLocaleDateString();
      pdf.setFontSize(10);
      pdf.text(`📅 Exportado el: ${fecha}`, 150, 15);

      pdf.save("Mi_Biblioteca.pdf");
    });
  };

  // Valores únicos para filtros
  const generosUnicos = [...new Set(juegos.map((j) => j.genero))];
  const plataformasUnicas = [...new Set(juegos.map((j) => j.plataforma))];
  const añosUnicos = [...new Set(juegos.map((j) => j.añoLanzamiento))].sort((a, b) => b - a);

  return (
    <div className="biblioteca-container">
      {/* Encabezado con botón PDF */}
      <div className="biblioteca-header">
        <h1 className="biblioteca-titulo">🎮 Mi Biblioteca de Juegos</h1>
        <button className="btn-exportar" onClick={exportarPDF}>
          📄 Exportar a PDF
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="filtros-container">
        <div className="filtros-header">
          <h2>🔍 Buscar y Filtrar</h2>
          <button
            className="btn-limpiar-filtros"
            onClick={limpiarFiltros}
            disabled={
              !terminoBusqueda &&
              !filtroGenero &&
              !filtroPlataforma &&
              !filtroEstado &&
              !filtroAño
            }
          >
            🗑️ Limpiar Filtros
          </button>
        </div>

        <div className="filtros-grid">
          {/* Buscar */}
          <div className="filtro-grupo">
            <label>🔎 Buscar por título o desarrollador</label>
            <input
              type="text"
              placeholder="Ej: Zelda, Nintendo..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              className="input-busqueda"
            />
          </div>

          {/* Género */}
          <div className="filtro-grupo">
            <label>🎮 Género</label>
            <select value={filtroGenero} onChange={(e) => setFiltroGenero(e.target.value)}>
              <option value="">Todos los géneros</option>
              {generosUnicos.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Plataforma */}
          <div className="filtro-grupo">
            <label>🖥️ Plataforma</label>
            <select value={filtroPlataforma} onChange={(e) => setFiltroPlataforma(e.target.value)}>
              <option value="">Todas las plataformas</option>
              {plataformasUnicas.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div className="filtro-grupo">
            <label>📊 Estado</label>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="completado">✅ Completados</option>
              <option value="pendiente">⏳ Pendientes</option>
            </select>
          </div>

          {/* Año */}
          <div className="filtro-grupo">
            <label>📅 Año de lanzamiento</label>
            <select value={filtroAño} onChange={(e) => setFiltroAño(e.target.value)}>
              <option value="">Todos los años</option>
              {añosUnicos.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Info resultados */}
        <div className="resultados-info">
          <p>
            Mostrando <strong>{juegosFiltrados.length}</strong> de{" "}
            <strong>{juegos.length}</strong> juegos
            {(terminoBusqueda || filtroGenero || filtroPlataforma || filtroEstado || filtroAño) &&
              " (filtrados)"}
          </p>
        </div>
      </div>

      <p className="biblioteca-subtitulo">
        {juegosFiltrados.length} juego{juegosFiltrados.length !== 1 ? "s" : ""} en tu colección
      </p>

      {/* Modal de edición */}
      {editandoJuego && (
        <div className="modal-overlay">
          {/* ...tu modal de edición tal como ya lo tienes... */}
        </div>
      )}

      {/* Cargando o sin resultados */}
      {cargando ? (
        <div className="cargando-container">
          <div className="cargando-spinner"></div>
          <p>Cargando tu biblioteca...</p>
        </div>
      ) : juegosFiltrados.length === 0 ? (
        <div className="sin-resultados">
          <h3>😔 No se encontraron juegos</h3>
          <p>Intenta ajustar tus filtros o agregar nuevos juegos.</p>
          <button className="btn-limpiar-filtros" onClick={limpiarFiltros}>
            🔄 Mostrar todos los juegos
          </button>
        </div>
      ) : (
        <div className="juegos-grid">
          {juegosFiltrados.map((juego) => (
            <TarjetaJuego
              key={juego._id}
              juego={juego}
              onEditar={setEditandoJuego}
              onEliminar={eliminarJuego}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BibliotecaJuegos;
