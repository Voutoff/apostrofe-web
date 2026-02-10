import React, { useState } from 'react';
import './App.css';

// --- COMPONENTE PRINCIPAL ---
function App() {
  // --- ESTADO DEL FORMULARIO ---
  const [formData, setFormData] = useState({
    nombre: '',
    cel: '',
    banda: '',
    integrantes: '',
    sala: '',
    fecha: '',
    horaInicio: '14:00',
    horaFin: '16:00'
  });

  // --- MANEJO DE CAMBIOS EN INPUTS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // --- LÓGICA DE AJUSTE DE MINUTOS (00 o 30) ---
  const ajustarMinutos = (e, campo) => {
    const valor = e.target.value;
    if (!valor) return;

    let partes = valor.split(':');
    let hora = parseInt(partes[0]);
    let minutos = parseInt(partes[1]);

    // Redondear a 00 o 30
    if (minutos < 15) {
      minutos = 0;
    } else if (minutos > 45) {
      minutos = 0;
      hora++; 
      if (hora >= 24) hora = 0; 
    } else {
      minutos = 30; 
    }

    // Formatear HH:MM
    let hStr = hora < 10 ? '0' + hora : hora;
    let mStr = minutos < 10 ? '0' + minutos : minutos;
    
    const nuevoValor = hStr + ':' + mStr;
    
    setFormData((prev) => ({ ...prev, [campo]: nuevoValor }));
  };

  // --- ENVÍO DE WHATSAPP ---
  const enviarWhatsApp = () => {
    const { nombre, cel, banda, integrantes, sala, fecha, horaInicio, horaFin } = formData;

    // Validaciones básicas
    if (!nombre || !cel || !banda || !integrantes || !sala || !fecha || !horaInicio || !horaFin) {
      alert("Por favor, completá todos los campos antes de enviar la consulta.");
      return;
    }

    // Validación de Mínimo 2 Horas
    const [sh, sm] = horaInicio.split(':').map(Number);
    const [eh, em] = horaFin.split(':').map(Number);

    let startMin = sh * 60 + sm;
    let endMin = eh * 60 + em;

    if (horaFin === "00:00") {
      endMin = 24 * 60;
    }

    const diff = endMin - startMin;

    if (diff < 120) {
      alert("El turno debe tener una duración mínima de 2 horas. Por favor, corregí los horarios.");
      return;
    }
    
    if (diff < 0) {
      alert("El horario de fin debe ser posterior al horario de inicio.");
      return;
    }

    // Determinar teléfono
    let telefono = sala === 'apostrofe' ? '5492216376619' : '5492214941472';
    let nombreSala = sala === 'apostrofe' ? 'Apostrofe de Tolosa' : 'La Casa Club LP';

    // Construcción del mensaje
    const mensaje = `Hola! Quiero reservar turno en *${nombreSala}*.%0A%0A` +
                    `👤 *Nombre:* ${nombre}%0A` +
                    `📱 *Cel:* ${cel}%0A` +
                    `🎸 *Banda/Músico:* ${banda}%0A` +
                    `👥 *Integrantes:* ${integrantes}%0A%0A` +
                    `📅 *Fecha:* ${fecha}%0A` +
                    `⏰ *Horario:* ${horaInicio} a ${horaFin}%0A` +
                    `💰 *Seña:* Quiero abonar el 50% para confirmar.%0A%0A` +
                    `¿Tienen disponibilidad?`;

    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
  };

  // --- COMPARTIR PÁGINA ---
  const compartirPagina = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'Apostrofe & La Casa Club',
        text: 'Mirá estos estudios de ensayo, grabación y el nuevo servicio de Estudio Móvil.',
        url: url,
      })
      .catch((error) => console.log('Error al compartir', error));
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert("¡Enlace copiado al portapapeles!");
      });
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header>
        <div className="container nav-container">
          <div className="logo-area">
            {/* LOGO 1: APOSTROFE */}
            <img src="/imagenes/logo-apostrofe.png" className="logo-img-placeholder" alt="Logo Apostrofe" />
            
            {/* LOGO 2: LA CASA CLUB */}
            <img src="/imagenes/logo-casaclub.png" className="logo-img-placeholder" alt="Logo Casa Club" />
            
            <div className="brand-name">APOSTROFE <span style={{color: '#8e44ad'}}>&</span> CASA CLUB</div>
          </div>
          <nav>
            <ul>
              <li><a href="#reservas">Reservar</a></li>
              <li><a href="#servicios">Servicios</a></li>
              <li><a href="#videos">Videos</a></li>
              <li><a href="#estudios">Las Sedes</a></li>
              {/* Se eliminó el link de Galería del menú */}
              <li><a href="#contacto">Contacto</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container hero-content">
          <h1>RESERVÁ TU TURNO<br/><span className="gradient-text">ONLINE</span></h1>
          <p>Horarios flexibles de 10am a 00am. Mínimo 2 horas de ensayo.</p>
          
          <div className="hero-buttons">
            <a href="#reservas" className="btn btn-primary">
              <i className="fas fa-calendar-alt"></i> Ver Disponibilidad
            </a>
            <a href="https://wa.me/5492216376619" className="btn btn-whatsapp" target="_blank" rel="noreferrer">
              <i className="fab fa-whatsapp"></i> WhatsApp Apostrofe
            </a>
            <a href="https://wa.me/5492214941472" className="btn btn-whatsapp" target="_blank" rel="noreferrer">
              <i className="fab fa-whatsapp"></i> WhatsApp Casa Club
            </a>
          </div>
        </div>
      </section>

      {/* SECCIÓN RESERVAS */}
      <section id="reservas" className="section-padding">
        <div className="container">
          <div className="text-center" style={{marginBottom: '40px'}}>
            <h2>Reserva de Turno</h2>
            <p style={{color: '#a0a0a0'}}>Elegí tus horarios libremente (Mínimo 2hs).</p>
          </div>

          <div className="booking-container">
            {/* Columna Izquierda: Formulario */}
            <div className="booking-form">
              
              <h4 style={{color: '#8e44ad', marginBottom: '15px'}}>1. Tus Datos</h4>
              
              <div className="form-group">
                <label>Nombre y Apellido</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Ricardo Iorio" />
              </div>

              <div className="form-group">
                <label>Celular (con código de área)</label>
                <input type="tel" name="cel" value={formData.cel} onChange={handleChange} placeholder="Ej: 221 555 5555" />
              </div>

              <div className="form-group">
                <label>Nombre de Banda / Músico</label>
                <input type="text" name="banda" value={formData.banda} onChange={handleChange} placeholder="Ej: Patricio Rey..." />
              </div>

              <div className="form-group">
                <label>Cantidad de Integrantes</label>
                <input type="number" name="integrantes" value={formData.integrantes} onChange={handleChange} placeholder="Ej: 4" min="1" />
              </div>

              <br />
              <h4 style={{color: '#8e44ad', marginBottom: '15px'}}>2. El Turno</h4>

              <div className="form-group">
                <label>Sala</label>
                <select name="sala" value={formData.sala} onChange={handleChange}>
                  <option value="" disabled>-- Seleccionar --</option>
                  <option value="apostrofe">Apostrofe de Tolosa</option>
                  <option value="casclub">La Casa Club LP</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fecha</label>
                <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Horario (Disponible 10:00 a 00:00)</label>
                <div className="time-inputs">
                  <div className="time-group">
                    <input type="time" name="horaInicio" min="10:00" max="22:00" step="1800" value={formData.horaInicio} onChange={(e) => { handleChange(e); ajustarMinutos(e, 'horaInicio'); }} />
                  </div>
                  <div className="time-group">
                    <input type="time" name="horaFin" min="12:00" max="00:00" step="1800" value={formData.horaFin} onChange={(e) => { handleChange(e); ajustarMinutos(e, 'horaFin'); }} />
                  </div>
                </div>
                <small style={{color: '#a0a0a0', fontSize: '0.8rem', marginTop: '5px', display: 'block'}}>* La reserva mínima es de 2 horas. Turnos media hora.</small>
              </div>

              <div className="booking-actions">
                <button className="btn btn-whatsapp" onClick={enviarWhatsApp}>
                  <i className="fab fa-whatsapp"></i> Enviar Consulta
                </button>
                
                <div className="payment-note">
                  <i className="fas fa-info-circle"></i> Disponibilidad sujeta a confirmación. Se requiere el pago del 50% del turno para confirmar la reserva (mediante detalles por WhatsApp).
                </div>
              </div>
            </div>

            {/* Columna Derecha: Info */}
            <div className="booking-info">
              <h3>Condiciones</h3>
              <ul className="feature-list" style={{fontSize: '1rem', color: '#e0e0e0'}}>
                <li><i className="fas fa-clock"></i> <strong>Horarios:</strong> 10:00 AM a 00:00 AM.</li>
                <li><i className="fas fa-hourglass-half"></i> <strong>Turnos mínimos:</strong> 2 horas.</li>
                <li><i className="fas fa-percent"></i> <strong>Seña:</strong> 50% del valor del turno.</li>
                <li><i className="fas fa-ban"></i> <strong>Cancelación:</strong> Sin seña, la reserva expira en 2hs.</li>
                <li><i className="fas fa-users"></i> <strong>Capacidad:</strong> Consultar según formación.</li>
              </ul>
              <br />
              <p style={{color: '#a0a0a0'}}>
                Una vez confirmada la disponibilidad, te indicaremos los métodos para abonar la seña y asegurar el horario.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="section-padding">
        <div className="container">
          <div className="text-center">
            <h2>Nuestros Servicios</h2>
            <p style={{color: '#a0a0a0'}}>Soluciones integrales para tus shows y grabaciones</p>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <i className="fas fa-drum service-icon"></i>
              <h3>Turnos de Ensayo</h3>
              <p>Salas climatizadas en Tolosa y La Plata. Equipamiento profesional y buena acústica.</p>
            </div>
            <div className="service-card">
              <i className="fas fa-microphone-lines service-icon"></i>
              <h3>Grabación Multitrack</h3>
              <p>Graba tu ensayo en vivo. Cada instrumento por separado para mezclar posteriormente.</p>
            </div>
            <div className="service-card">
              <i className="fas fa-sliders service-icon"></i>
              <h3>Producción Musical</h3>
              <p>Desde la idea hasta el master final. Mezcla y masterización profesional.</p>
            </div>
            <div className="service-card">
              <i className="fas fa-truck-loading service-icon"></i>
              <h3>Alquiler de Sonido</h3>
              <p>Cotizaciones para eventos. Backline completo e ingeniería de sonido en vivo.</p>
            </div>
            <div className="service-card" style={{borderColor: '#25D366'}}>
              <i className="fas fa-suitcase service-icon" style={{color: '#25D366'}}></i>
              <h3>Estudio Móvil</h3>
              <p style={{marginBottom: '10px', fontWeight: '700'}}>Llevamos el estudio a tu lugar</p>
              <ul className="feature-list">
                <li><i className="fas fa-check-circle"></i> Consola Digital</li>
                <li><i className="fas fa-check-circle"></i> Micrófonos de Alta Gama</li>
                <li><i className="fas fa-check-circle"></i> Sistema In-Ear (Monitoreo)</li>
                <li><i className="fas fa-check-circle"></i> Grabación de Ensayo Off-Site</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEOS */}
      <section id="videos" className="section-padding">
        <div className="container">
          <div className="text-center" style={{marginBottom: '40px'}}>
            <h2>Portfolio Video</h2>
            <p style={{color: '#a0a0a0'}}>Mirá algunas producciones, ensayos y shows grabados en nuestras salas.</p>
          </div>

          <div className="video-grid">
            <div className="video-wrapper">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/5SoU1en6Grc" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <div className="video-wrapper">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/cem7RuUopCQ" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <div className="video-wrapper">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/rLfPAwDYTUc" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <div className="video-wrapper">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/kQkQe2jWxSk" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Los Estudios (Split) */}
      <section id="estudios">
        <div className="studios-wrapper">
          {/* Apostrofe */}
          <div className="studio-col">
            <div className="studio-bg" style={{backgroundImage: 'url(/imagenes/sala-apostrofe.jpg)'}}></div>
            <div className="studio-overlay">
              <div className="studio-logo-placeholder" style={{backgroundImage: 'url(/imagenes/logo-apostrofe.jpg)'}}></div>
              <h2>Apostrofe de Tolosa</h2>
              <p>Grabación & Ensayo</p>
              
              <div className="studio-actions">
                <a href="https://www.instagram.com/apostrofe.studio/" target="_blank" className="studio-btn" rel="noreferrer">
                  <i className="fab fa-instagram"></i> Instagram
                </a>
                <a href="https://maps.app.goo.gl/AM9f8EsyyVFpugju9" target="_blank" className="studio-btn maps" rel="noreferrer">
                  <i className="fas fa-map-marker-alt"></i> Ubicación
                </a>
              </div>
            </div>
          </div>
          
          {/* La Casa Club */}
          <div className="studio-col">
            <div className="studio-bg" style={{backgroundImage: 'url(/imagenes/sala-casaclub.jpg)'}}></div>
            <div className="studio-overlay">
              <div className="studio-logo-placeholder" style={{backgroundImage: 'url(/imagenes/logo-casaclub.jpg)'}}></div>
              <h2>La Casa Club LP</h2>
              <p>El Club de Música</p>
              
              <div className="studio-actions">
                <a href="https://www.instagram.com/lacasaclub.lp/" target="_blank" className="studio-btn" rel="noreferrer">
                  <i className="fab fa-instagram"></i> Instagram
                </a>
                <a href="https://maps.app.goo.gl/CPbESMP3DWWY6j8i8" target="_blank" className="studio-btn maps" rel="noreferrer">
                  <i className="fas fa-map-marker-alt"></i> Ubicación
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Contacto */}
      <footer id="contacto">
        <div className="container">
          <div className="contact-box">
            <h2>¿Consultas sobre Estudio Móvil?</h2>
            <p style={{margin: '20px 0', color: '#a0a0a0'}}>
              Llevamos la consola a tu ensayo, te grabamos y te armamos los monitores In-Ear.
              <br />Escribinos a la sede que prefieras.
            </p>
            
            <div className="hero-buttons">
              <a href="https://wa.me/5492216376619" className="btn btn-whatsapp" target="_blank" rel="noreferrer">
                <i className="fab fa-whatsapp"></i> Apostrofe
              </a>
              <a href="https://wa.me/5492214941472" className="btn btn-whatsapp" target="_blank" rel="noreferrer">
                <i className="fab fa-whatsapp"></i> La Casa Club
              </a>
            </div>

            <div className="social-links">
              <a href="https://www.instagram.com/apostrofe.studio/" className="social-icon" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i> Apostrofe</a>
              <a href="https://www.instagram.com/lacasaclub.lp/" className="social-icon" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i> La Casa Club</a>
            </div>

            <div className="share-section">
              <button onClick={compartirPagina} className="btn" style={{border: '1px solid #555', color: '#aaa', fontSize: '0.9rem'}}>
                <i className="fas fa-share-alt"></i> Compartir Página
              </button>
            </div>
          </div>
          
          <div className="text-center" style={{marginTop: '50px', fontSize: '0.8rem', color: '#555'}}>
            &copy; 2023 Apostrofe Studio & La Casa Club. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* Botones Flotantes con Etiquetas */}
      <div className="wa-container top">
        <a href="https://wa.me/5492216376619" className="float-wa apostrofe" target="_blank" rel="noreferrer">
          <i className="fab fa-whatsapp"></i>
        </a>
        <span className="wa-label">Apostrofe</span>
      </div>

      <div className="wa-container bottom">
        <a href="https://wa.me/5492214941472" className="float-wa casaclub" target="_blank" rel="noreferrer">
          <i className="fab fa-whatsapp"></i>
        </a>
        <span className="wa-label">La Casa Club</span>
      </div>
    </div>
  );
}

export default App;