/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║   BIOZAGRI — Eliminar artículo del blog                 ║
 * ╠══════════════════════════════════════════════════════════╣
 * ║  Uso (automático desde el .bat):                        ║
 * ║    node tools/eliminar-articulo.js --list               ║
 * ║    node tools/eliminar-articulo.js --delete N           ║
 * ╚══════════════════════════════════════════════════════════╝
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

/* ── rutas ── */
const ROOT      = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'data', 'biozagri-data.js');

/* ── colores ANSI ── */
const C = {
  reset: '\x1b[0m', bold: '\x1b[1m',
  green: '\x1b[32m', gold: '\x1b[33m',
  blue: '\x1b[36m', red: '\x1b[31m', muted: '\x1b[90m',
};
const ok   = s => console.log(`  ${C.green}+  ${s}${C.reset}`);
const info = s => console.log(`  ${C.blue}->  ${s}${C.reset}`);
const warn = s => console.log(`  ${C.gold}!  ${s}${C.reset}`);
const err  = s => console.log(`  ${C.red}x  ${s}${C.reset}`);
const sep  = () => console.log(`${C.muted}${'─'.repeat(54)}${C.reset}`);

/* ════════════════════════════════════════
   PARSEAR DATA FILE CON vm
════════════════════════════════════════ */

function cargarData() {
  if (!fs.existsSync(DATA_FILE)) {
    throw new Error('No se encontró data/biozagri-data.js');
  }
  const src     = fs.readFileSync(DATA_FILE, 'utf8');
  const sandbox = { window: {} };
  try {
    vm.runInNewContext(src, sandbox);
  } catch (e) {
    throw new Error('Error al leer biozagri-data.js: ' + e.message);
  }
  if (!sandbox.window.BZ) {
    throw new Error('El archivo data/biozagri-data.js no define window.BZ correctamente.');
  }
  return { bz: sandbox.window.BZ, src };
}

/* ════════════════════════════════════════
   LOCALIZAR BLOQUE EN EL TEXTO FUENTE
════════════════════════════════════════ */

/**
 * Devuelve { inicio, fin } del bloque { ... } cuyo campo id coincide.
 * Respeta template literals (backticks) para no confundir { } dentro del contenido.
 */
function encontrarBloque(src, id) {
  const re = new RegExp(`id:\\s*"${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'm');
  const m  = re.exec(src);
  if (!m) return null;

  // Caminar hacia atrás hasta el { de apertura
  let inicio = m.index;
  while (inicio > 0 && src[inicio] !== '{') inicio--;

  // Caminar hacia adelante respetando template literals
  let depth = 0, inTemplate = false, i = inicio, fin = -1;
  while (i < src.length) {
    const ch = src[i];
    if (inTemplate) {
      if (ch === '\\') { i += 2; continue; }
      if (ch === '`')  inTemplate = false;
    } else {
      if (ch === '`') inTemplate = true;
      else if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) { fin = i; break; } }
    }
    i++;
  }
  if (fin === -1) return null;
  return { inicio, fin };
}

/**
 * Elimina el bloque del artículo (y su coma separadora) del texto fuente.
 * Devuelve el texto modificado.
 */
function eliminarBloqueDelSrc(src, id) {
  const bloque = encontrarBloque(src, id);
  if (!bloque) throw new Error(`No se encontró el bloque con id="${id}" en el archivo.`);

  const { inicio, fin } = bloque;

  // Expandir hacia atrás: capturar sangría y saltos de línea antes del bloque
  let desde = inicio;
  while (desde > 0 && (src[desde - 1] === ' ' || src[desde - 1] === '\t')) desde--;
  if (desde > 0 && src[desde - 1] === '\n') desde--;
  if (desde > 0 && src[desde - 1] === '\r') desde--;

  // Expandir hacia adelante: coma trailing + saltos de línea
  let hasta = fin + 1;
  while (hasta < src.length && (src[hasta] === ' ' || src[hasta] === '\t')) hasta++;
  if (hasta < src.length && src[hasta] === ',') hasta++;
  while (hasta < src.length && (src[hasta] === '\n' || src[hasta] === '\r')) hasta++;

  return src.slice(0, desde) + src.slice(hasta);
}

/* ════════════════════════════════════════
   MODO --list
════════════════════════════════════════ */

function modoListar() {
  let bz, src;
  try { ({ bz, src } = cargarData()); } catch (e) { err(e.message); process.exit(1); }

  const blog = bz.blog || [];
  if (blog.length === 0) {
    warn('No hay artículos publicados en el blog todavía.');
    return;
  }

  console.log(`\n${C.bold}  Artículos publicados en el blog (${blog.length} total):${C.reset}\n`);
  blog.forEach((post, i) => {
    const num  = String(i + 1).padStart(2, ' ');
    const feat = post.featured ? ' [DESTACADO]' : '';
    console.log(`  ${C.gold}${num}.${C.reset} ${C.bold}${post.titulo}${C.reset}${C.blue}${feat}${C.reset}`);
    console.log(`      ${C.muted}${post.tag}  |  ${post.fecha}  |  ${post.lectura}${C.reset}`);
    if (post.imagen) console.log(`      ${C.muted}Imagen: ${post.imagen}${C.reset}`);
    if (post.pdf)    console.log(`      ${C.muted}PDF:    ${post.pdf}${C.reset}`);
    console.log();
  });
}

/* ════════════════════════════════════════
   MODO --delete N
════════════════════════════════════════ */

function modoEliminar(numeroStr) {
  const n = parseInt(numeroStr, 10);

  let bz, src;
  try { ({ bz, src } = cargarData()); } catch (e) { err(e.message); process.exit(1); }

  const blog = bz.blog || [];

  if (isNaN(n) || n < 1 || n > blog.length) {
    err(`Numero invalido. Escribe un numero entre 1 y ${blog.length}.`);
    process.exit(1);
  }

  const post = blog[n - 1];
  sep();
  console.log(`\n  ${C.bold}Eliminando articulo:${C.reset}`);
  console.log(`  ${C.gold}Titulo:${C.reset}    ${post.titulo}`);
  console.log(`  ${C.gold}Categoria:${C.reset} ${post.tag}`);
  console.log(`  ${C.gold}Fecha:${C.reset}     ${post.fecha}`);
  console.log(`  ${C.muted}id: ${post.id}${C.reset}\n`);

  /* Eliminar del data file */
  let srcNuevo;
  try {
    srcNuevo = eliminarBloqueDelSrc(src, post.id);
  } catch (e) {
    err('Error al eliminar del archivo de datos: ' + e.message);
    process.exit(1);
  }
  fs.writeFileSync(DATA_FILE, srcNuevo, 'utf8');
  ok('Eliminado de biozagri-data.js');

  /* Eliminar imagen asociada */
  if (post.imagen) {
    const imgPath = path.join(ROOT, post.imagen);
    if (fs.existsSync(imgPath)) {
      try {
        fs.unlinkSync(imgPath);
        ok(`Imagen eliminada: ${post.imagen}`);
      } catch (e) {
        warn(`No se pudo eliminar la imagen: ${e.message}`);
      }
    } else {
      info(`Imagen no encontrada en disco (ya fue eliminada o nunca existio): ${post.imagen}`);
    }
  }

  /* Eliminar PDF asociado */
  if (post.pdf) {
    const pdfPath = path.join(ROOT, post.pdf);
    if (fs.existsSync(pdfPath)) {
      try {
        fs.unlinkSync(pdfPath);
        ok(`PDF eliminado: ${post.pdf}`);
      } catch (e) {
        warn(`No se pudo eliminar el PDF: ${e.message}`);
      }
    } else {
      info(`PDF no encontrado en disco: ${post.pdf}`);
    }
  }

  sep();
  console.log(`\n${C.bold}${C.green}  Articulo eliminado correctamente.${C.reset}`);
  console.log(`${C.muted}  Recarga la pagina del sitio web para confirmar.${C.reset}\n`);
}

/* ════════════════════════════════════════
   MAIN
════════════════════════════════════════ */

const args = process.argv.slice(2);

if (args[0] === '--list') {
  modoListar();
} else if (args[0] === '--delete' && args[1] !== undefined) {
  modoEliminar(args[1]);
} else {
  err('Uso: node tools/eliminar-articulo.js --list');
  err('     node tools/eliminar-articulo.js --delete N');
  process.exit(1);
}
