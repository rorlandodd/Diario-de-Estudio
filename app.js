/* ============================================
   Diario de Estudio - Lógica
   ============================================ */

// Clave con la que guardamos las sesiones en localStorage.
const CLAVE_STORAGE = "diarioDeEstudio.sesiones";

// Referencias a los elementos del HTML que vamos a usar.
const formulario = document.getElementById("formulario");
const campoFecha = document.getElementById("fecha");
const campoTema = document.getElementById("tema");
const campoMinutos = document.getElementById("minutos");
const listaSesiones = document.getElementById("lista-sesiones");
const mensajeVacio = document.getElementById("mensaje-vacio");
const numeroRacha = document.getElementById("racha");
const textoRacha = document.getElementById("texto-racha");

// Lista de sesiones en memoria. Cada sesión es un objeto:
// { id: número, fecha: "AAAA-MM-DD", tema: texto, minutos: número }
let sesiones = cargarSesiones();

/* --------------------------------------------
   Utilidades de fechas (siempre en hora local)
   -------------------------------------------- */

// Convierte un objeto Date a texto "AAAA-MM-DD" usando la hora local.
// No usamos toISOString() porque devuelve la fecha en UTC y podría
// dar un día distinto al del usuario.
function fechaATexto(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

// Convierte un texto "AAAA-MM-DD" a un objeto Date en hora local.
// No usamos new Date(texto) porque el navegador lo interpreta en UTC.
function textoAFecha(texto) {
  const [anio, mes, dia] = texto.split("-").map(Number);
  return new Date(anio, mes - 1, dia);
}

// Devuelve la fecha de hoy como texto "AAAA-MM-DD" (hora local).
function hoy() {
  return fechaATexto(new Date());
}

// Convierte "AAAA-MM-DD" en algo legible, por ejemplo "jue, 1 oct".
function formatearFecha(textoFecha) {
  const fecha = textoAFecha(textoFecha);
  return new Intl.DateTimeFormat("es", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(fecha);
}

/* --------------------------------------------
   Cargar y guardar en localStorage
   -------------------------------------------- */

function cargarSesiones() {
  const datos = localStorage.getItem(CLAVE_STORAGE);
  if (!datos) return [];
  try {
    return JSON.parse(datos);
  } catch {
    // Si los datos están dañados, empezamos con una lista vacía.
    return [];
  }
}

function guardarSesiones() {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(sesiones));
}

/* --------------------------------------------
   Cálculo de la racha
   -------------------------------------------- */

function calcularRacha() {
  // Un día cuenta si tiene al menos una sesión.
  // Usamos un Set para tener las fechas sin repetir.
  const diasConSesion = new Set(sesiones.map((sesion) => sesion.fecha));

  // Empezamos mirando hoy. Si hoy aún no hay sesión, empezamos en
  // ayer: la racha no se rompe hasta que termine el día de hoy.
  let dia = textoAFecha(hoy());
  if (!diasConSesion.has(fechaATexto(dia))) {
    dia.setDate(dia.getDate() - 1);
  }

  // Contamos días hacia atrás mientras haya sesión.
  let racha = 0;
  while (diasConSesion.has(fechaATexto(dia))) {
    racha = racha + 1;
    dia.setDate(dia.getDate() - 1);
  }
  return racha;
}

/* --------------------------------------------
   Pintar la pantalla
   -------------------------------------------- */

function pintarRacha() {
  const racha = calcularRacha();
  numeroRacha.textContent = racha;
  textoRacha.textContent =
    racha === 1 ? "🔥 día seguido estudiando" : "🔥 días seguidos estudiando";
}

function pintarLista() {
  listaSesiones.innerHTML = "";

  // Ordenamos de más reciente a más antigua. Si dos sesiones son
  // del mismo día, aparece primero la que se registró después.
  const ordenadas = [...sesiones].sort(function (a, b) {
    if (a.fecha === b.fecha) return b.id - a.id;
    return a.fecha < b.fecha ? 1 : -1;
  });

  // El mensaje de "lista vacía" solo se muestra si no hay sesiones.
  mensajeVacio.style.display = ordenadas.length === 0 ? "block" : "none";

  for (const sesion of ordenadas) {
    const li = document.createElement("li");
    li.className = "sesion";

    const info = document.createElement("div");
    info.className = "sesion-info";

    const tema = document.createElement("span");
    tema.className = "sesion-tema";
    // Usamos textContent para que el texto nunca se interprete como HTML.
    tema.textContent = sesion.tema;

    const fecha = document.createElement("span");
    fecha.className = "sesion-fecha";
    fecha.textContent = formatearFecha(sesion.fecha);

    const minutos = document.createElement("span");
    minutos.className = "sesion-minutos";
    minutos.textContent = sesion.minutos + " min";

    info.appendChild(tema);
    info.appendChild(fecha);
    li.appendChild(info);
    li.appendChild(minutos);
    listaSesiones.appendChild(li);
  }
}

function pintarPantalla() {
  pintarRacha();
  pintarLista();
}

/* --------------------------------------------
   Evento: guardar una sesión nueva
   -------------------------------------------- */

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const fecha = campoFecha.value;
  const tema = campoTema.value.trim();
  const minutos = Number(campoMinutos.value);

  // Validación sencilla por si el formulario llega incompleto.
  if (!fecha || tema === "" || isNaN(minutos) || minutos <= 0) {
    alert("Revisa el formulario: el tema es obligatorio y los minutos deben ser un número mayor que 0.");
    return;
  }

  sesiones.push({
    id: Date.now(), // marca de tiempo, para ordenar sesiones del mismo día
    fecha: fecha,
    tema: tema,
    minutos: minutos,
  });

  guardarSesiones();
  pintarPantalla();

  // Dejamos el formulario listo para la siguiente sesión.
  formulario.reset();
  campoFecha.value = hoy();
  campoTema.focus();
});

/* --------------------------------------------
   Inicio
   -------------------------------------------- */

// La fecha del formulario empieza con el día de hoy.
campoFecha.value = hoy();
pintarPantalla();
