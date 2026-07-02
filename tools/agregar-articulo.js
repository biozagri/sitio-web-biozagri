/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║   BIOZAGRI — Conversor de Word/PDF/TXT a Blog           ║
 * ╠══════════════════════════════════════════════════════════╣
 * ║  INSTRUCCIONES:                                         ║
 * ║                                                         ║
 * ║  1. Coloca tu archivo en la carpeta  blog-fuente/       ║
 * ║     Formatos aceptados: .docx  .pdf  .txt               ║
 * ║                                                         ║
 * ║  2. Nombre del archivo (opcional):                      ║
 * ║     [Categoría] Título del artículo.docx                ║
 * ║     Ejemplo:                                            ║
 * ║     [Fitosanidad] Control de Fusarium en banano.docx    ║
 * ║     Si no pones [Categoría], se usa "Agronomía"         ║
 * ║                                                         ║
 * ║  3. FOTO DE PORTADA (opcional — muy fácil):             ║
 * ║     Pon una imagen JPG o PNG con el MISMO NOMBRE        ║
 * ║     que el documento en la misma carpeta.               ║
 * ║     Ejemplo:                                            ║
 * ║     [Fitosanidad] Control de Fusarium en banano.pdf     ║
 * ║     [Fitosanidad] Control de Fusarium en banano.jpg  ← foto
 * ║     El script la detecta y la sube automáticamente.     ║
 * ║                                                         ║
 * ║  4. Haz doble clic en:                                  ║
 * ║     AGREGAR ARTICULO AL BLOG.bat                        ║
 * ║                                                         ║
 * ║  ¡Listo! Recarga el sitio web para ver el artículo.     ║
 * ╚══════════════════════════════════════════════════════════╝
 */

'use strict';

const fs           = require('fs');
const path         = require('path');
const { execSync } = require('child_process');

/* ── rutas ── */
const ROOT      = path.resolve(__dirname, '..');
const FUENTE    = path.join(ROOT, 'blog-fuente');
const PROC      = path.join(FUENTE, 'procesados');
const DATA_FILE = path.join(ROOT, 'data', 'biozagri-data.js');
const PDFTOTEXT = 'C:\\Users\\usuario\\AppData\\Local\\Microsoft\\WinGet\\Packages\\oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe\\poppler-25.07.0\\Library\\bin\\pdftotext.exe';

/* ── colores ANSI ── */
const C = {
  reset: '\x1b[0m', bold: '\x1b[1m',
  green: '\x1b[32m', gold: '\x1b[33m',
  blue: '\x1b[36m', red: '\x1b[31m', muted: '\x1b[90m',
};
const ok   = (s) => console.log(`  ${C.green}✔  ${s}${C.reset}`);
const info = (s) => console.log(`  ${C.blue}→  ${s}${C.reset}`);
const warn = (s) => console.log(`  ${C.gold}⚠  ${s}${C.reset}`);
const err  = (s) => console.log(`  ${C.red}✖  ${s}${C.reset}`);
const sep  = ()  => console.log(`${C.muted}${'─'.repeat(54)}${C.reset}`);

/* ════════════════════════════════════════
   UTILIDADES DE TEXTO
════════════════════════════════════════ */

/** Convierte texto plano a HTML limpio */
function textoAHtml(texto) {
  const lines  = texto.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const out    = [];
  let lista    = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (lista) { out.push('<ul>' + lista.join('') + '</ul>'); lista = null; }
      continue;
    }
    /* viñetas */
    if (/^[•\-\*]\s+/.test(line)) {
      if (!lista) lista = [];
      lista.push(`<li>${line.replace(/^[•\-\*]\s+/, '')}</li>`);
      continue;
    }
    if (lista) { out.push('<ul>' + lista.join('') + '</ul>'); lista = null; }

    /* subtítulos: todo en mayúsculas o línea corta terminada en ":" */
    if (line.length < 80 && (line === line.toUpperCase() || line.endsWith(':'))) {
      const t = line.endsWith(':') ? line.slice(0, -1) : line;
      out.push(`<h3>${primeraMayus(t)}</h3>`);
    } else {
      out.push(`<p>${line}</p>`);
    }
  }
  if (lista) out.push('<ul>' + lista.join('') + '</ul>');
  return out.join('\n        ');
}

/** Limpia el HTML que produce mammoth */
function limpiarHtmlDocx(html) {
  return html
    .replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>')
    .replace(/<i>(.*?)<\/i>/g, '<em>$1</em>')
    .replace(/style="[^"]*"/g, '')
    .replace(/<br\s*\/?>/gi, '')
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '<h3>$1</h3>')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '<h3>$1</h3>')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '<h3>$1</h3>')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '<h3>$1</h3>')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Extrae el título del HTML (primer h3 o primer p) */
function extraerTituloHtml(html) {
  const m = html.match(/<h3[^>]*>(.*?)<\/h3>/i)
             || html.match(/<p[^>]*>(.*?)<\/p>/i);
  return m ? m[1].replace(/<[^>]+>/g, '').trim() : '';
}

/** Quita el primer elemento (título) del HTML */
function quitarPrimerElemento(html) {
  return html.replace(/<(?:h3|p)[^>]*>.*?<\/(?:h3|p)>/i, '').trim();
}

/** Extrae categoría y título del nombre del archivo.
 *  "[Fitosanidad] Control de Fusarium.docx"  → { tag: "Fitosanidad", tituloArchivo: "Control de Fusarium" }
 *  "Control de Fusarium.docx"                → { tag: "Agronomía",   tituloArchivo: "Control de Fusarium" }
 */
function parsearNombreArchivo(archivo) {
  const sinExt = path.basename(archivo, path.extname(archivo));
  const m      = sinExt.match(/^\[([^\]]+)\]\s*(.+)$/);
  if (m) return { tag: m[1].trim(), tituloArchivo: m[2].trim() };
  return { tag: 'Agronomía', tituloArchivo: sinExt.trim() };
}

/** Genera un id tipo slug */
function slugify(txt) {
  return txt.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
    .slice(0, 60);
}

/** Calcula tiempo de lectura */
function calcLectura(html) {
  const words = html.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min lectura`;
}

/** Primera letra en mayúsculas, resto minúsculas */
function primeraMayus(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/** Si el texto está todo en MAYÚSCULAS, lo convierte a Título Normal */
function normalizarMayus(s) {
  if (!s || s === s.toLowerCase()) return s; // ya tiene minúsculas, dejarlo
  if (s === s.toUpperCase()) {
    // Convertir a Title Case (cada palabra con primera en mayús)
    return s.toLowerCase().replace(/(?:^|\s|[-–(])\S/g, c => c.toUpperCase());
  }
  return s;
}

/** Líneas que parecen metadatos de artículo académico — omitirlas del resumen */
function esMetadato(linea) {
  return /^(fecha|author|autores?|resumen|abstract|doi|issn|vol\.|núm\.|recibido|aceptado|received|keywords?|palabras\s+clave|\d{1,3}\s)/i.test(linea.trim());
}

/** Fecha actual en español */
function fechaHoy() {
  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const d = new Date();
  return `${meses[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** Escapa caracteres especiales para template literals */
function escTpl(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

/* ════════════════════════════════════════
   LECTORES
════════════════════════════════════════ */

async function leerDocx(filePath) {
  const mammoth = require('mammoth');
  /* Copiar a ruta temporal sin caracteres especiales */
  const os    = require('os');
  const tmpIn = path.join(os.tmpdir(), 'bz_tmp_input.docx');
  fs.copyFileSync(filePath, tmpIn);
  try {
    const result = await mammoth.convertToHtml({ path: tmpIn });
    return limpiarHtmlDocx(result.value);
  } finally {
    try { fs.unlinkSync(tmpIn); } catch(_) {}
  }
}

function leerPdf(filePath) {
  if (!fs.existsSync(PDFTOTEXT)) {
    throw new Error('pdftotext no encontrado. Verifica la ruta en tools/agregar-articulo.js');
  }
  /* Copiar a ruta temporal sin caracteres especiales para evitar
     problemas con paréntesis, corchetes y tildes en nombres de archivo */
  const os    = require('os');
  const tmpIn = path.join(os.tmpdir(), 'bz_tmp_input.pdf');
  const tmpOut= path.join(os.tmpdir(), 'bz_tmp_out.txt');
  fs.copyFileSync(filePath, tmpIn);
  try {
    execSync(`"${PDFTOTEXT}" "${tmpIn}" "${tmpOut}"`, { encoding: 'utf8' });
    const texto = fs.readFileSync(tmpOut, 'utf8');
    return textoAHtml(texto);
  } finally {
    try { fs.unlinkSync(tmpIn);  } catch(_) {}
    try { fs.unlinkSync(tmpOut); } catch(_) {}
  }
}

function leerTxt(filePath) {
  const txt = fs.readFileSync(filePath, 'utf8');
  return textoAHtml(txt);
}

/* ════════════════════════════════════════
   INSERTAR / ACTUALIZAR EN biozagri-data.js
════════════════════════════════════════ */

/**
 * Encuentra el bloque { ... } de un artículo por su id en el texto fuente.
 * Respeta template literals (backticks) para no confundir llaves internas.
 */
function encontrarBloque(src, id) {
  const re  = new RegExp(`id:\\s*"${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'm');
  const m   = re.exec(src);
  if (!m) return null;

  // Caminar hacia atrás hasta el { de apertura
  let inicio = m.index;
  while (inicio > 0 && src[inicio] !== '{') inicio--;

  // Caminar hacia adelante contando llaves (ignorando las que están dentro de ` `)
  let depth = 0, inTemplate = false, i = inicio, fin = -1;
  while (i < src.length) {
    const ch = src[i];
    if (inTemplate) {
      if (ch === '\\') { i += 2; continue; }  // carácter escapado
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

function generarEntrada(post) {
  return `    {
      id:        "${post.id}",
      tag:       "${post.tag}",
      fecha:     "${post.fecha}",
      lectura:   "${post.lectura}",
      featured:  false,
      imagen:    "${post.imagen || ''}",
      pdf:       "${post.pdf || ''}",
      titulo:    "${escTpl(normalizarMayus(post.titulo))}",
      resumen:   "${escTpl(post.resumen)}",
      contenido: \`
        ${escTpl(post.contenido)}
      \`
    }`;
}

function insertarEnData(post) {
  let src = fs.readFileSync(DATA_FILE, 'utf8');

  /* ── ¿Ya existe un artículo con este ID? ── */
  const existente = encontrarBloque(src, post.id);
  if (existente) {
    warn(`Este artículo ya estaba publicado: "${post.titulo}"`);

    /* Si viene con imagen o PDF nuevos, actualizar solo esos campos */
    let bloque    = src.slice(existente.inicio, existente.fin + 1);
    let cambio    = false;

    if (post.imagen) {
      const nuevo = bloque.replace(/imagen:\s*"[^"]*"/, `imagen:    "${post.imagen}"`);
      if (nuevo !== bloque) { bloque = nuevo; cambio = true; }
    }
    if (post.pdf) {
      const nuevo = bloque.replace(/pdf:\s*"[^"]*"/, `pdf:       "${post.pdf}"`);
      if (nuevo !== bloque) { bloque = nuevo; cambio = true; }
    }

    if (cambio) {
      src = src.slice(0, existente.inicio) + bloque + src.slice(existente.fin + 1);
      fs.writeFileSync(DATA_FILE, src, 'utf8');
      ok('Imagen / PDF actualizados en el artículo existente');
    } else {
      info('Sin cambios nuevos — el artículo no fue modificado');
    }
    return;   // salir sin insertar duplicado
  }

  /* ── Artículo nuevo: insertar al INICIO del array blog ── */
  const BLOG_OPEN = /(\s*blog:\s*\[[\s\S]*?\/\* ── Los artículos más NUEVOS van primero ── \*\/\s*\n)/;
  if (BLOG_OPEN.test(src)) {
    src = src.replace(BLOG_OPEN, `$1\n${generarEntrada(post)},\n`);
  } else {
    /* fallback: insertar después de "blog: [" */
    const BLOG_START = /(\s*blog:\s*\[\s*\n)/;
    if (BLOG_START.test(src)) {
      src = src.replace(BLOG_START, `$1\n${generarEntrada(post)},\n`);
    } else {
      throw new Error('No se encontró el marcador "blog: [" en biozagri-data.js');
    }
  }

  fs.writeFileSync(DATA_FILE, src, 'utf8');
}

/* ════════════════════════════════════════
   PROCESAR UN ARCHIVO
════════════════════════════════════════ */

async function procesarArchivo(archivo) {
  const filePath = path.join(FUENTE, archivo);
  const ext      = path.extname(archivo).toLowerCase();

  sep();
  console.log(`\n${C.bold}${C.blue}  📄 ${archivo}${C.reset}\n`);

  /* — leer — */
  let html;
  try {
    if (ext === '.docx')      { info('Leyendo Word (.docx)…');   html = await leerDocx(filePath); }
    else if (ext === '.pdf')  { info('Leyendo PDF…');            html = leerPdf(filePath); }
    else if (ext === '.txt')  { info('Leyendo texto plano…');    html = leerTxt(filePath); }
    else { warn(`Formato "${ext}" no soportado (usa .docx, .pdf o .txt)`); return false; }
    ok('Documento leído');
  } catch (e) {
    err('Error leyendo el archivo: ' + e.message);
    return false;
  }

  /* — detectar título — */
  const { tag, tituloArchivo } = parsearNombreArchivo(archivo);

  const tituloDoc = extraerTituloHtml(html);
  const tituloRaw = tituloArchivo !== path.basename(archivo, ext) || !tituloDoc
                    ? tituloArchivo
                    : tituloDoc;
  const titulo = normalizarMayus(tituloRaw);

  // Quitar el título del contenido si coincide
  const contenido = quitarPrimerElemento(html);

  /* — resumen automático: busca el primer párrafo real (no metadatos) — */
  const parrafos = contenido
    .replace(/<h3[^>]*>.*?<\/h3>/gi, '')  // quitar subtítulos
    .match(/<p[^>]*>(.*?)<\/p>/gi) || [];

  let resumenBase = '';
  for (const p of parrafos) {
    const txt = p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (txt.length > 40 && !esMetadato(txt)) {
      resumenBase = txt;
      break;
    }
  }
  if (!resumenBase) {
    resumenBase = contenido.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const resumen = normalizarMayus(resumenBase.slice(0, 160).trimEnd()) + '…';

  /* — detectar foto de portada con el mismo nombre que el documento — */
  let imagenPath = '';
  const baseNombre = path.basename(archivo, ext);
  const imgExts    = ['.jpg', '.jpeg', '.png', '.webp'];
  for (const imgExt of imgExts) {
    const imgSrc = path.join(FUENTE, baseNombre + imgExt);
    if (fs.existsSync(imgSrc)) {
      const blogImgDir = path.join(ROOT, 'images', 'blog');
      if (!fs.existsSync(blogImgDir)) fs.mkdirSync(blogImgDir, { recursive: true });
      const imgDest = path.join(blogImgDir, `${slugify(titulo)}${imgExt}`);
      try {
        fs.copyFileSync(imgSrc, imgDest);
        imagenPath = `images/blog/${slugify(titulo)}${imgExt}`;
        ok(`Foto de portada detectada → ${imagenPath}`);
        /* mover imagen a procesados también */
        const imgProc = path.join(PROC, baseNombre + imgExt);
        fs.renameSync(imgSrc, fs.existsSync(imgProc)
          ? path.join(PROC, `${Date.now()}_${baseNombre}${imgExt}`)
          : imgProc);
      } catch (e) {
        warn(`No se pudo copiar la imagen: ${e.message}`);
      }
      break;
    }
  }

  /* — copiar PDF a docs/blog/ para verlo en el modal — */
  let pdfPath = '';
  if (ext === '.pdf') {
    const docsDir = path.join(ROOT, 'docs', 'blog');
    if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
    const pdfDest = path.join(docsDir, `${slugify(titulo)}.pdf`);
    try {
      fs.copyFileSync(filePath, pdfDest);
      pdfPath = `docs/blog/${slugify(titulo)}.pdf`;
      ok(`PDF guardado en ${pdfPath}`);
    } catch (e) {
      warn(`No se pudo copiar el PDF a docs/blog/: ${e.message}`);
    }
  }

  const post = {
    id:       slugify(titulo),
    tag,
    fecha:    fechaHoy(),
    lectura:  calcLectura(contenido),
    titulo,
    resumen,
    contenido,
    imagen:   imagenPath,
    pdf:      pdfPath,
  };

  /* — mostrar resumen — */
  console.log(`\n  ${C.gold}Título:${C.reset}    ${post.titulo}`);
  console.log(`  ${C.gold}Categoría:${C.reset} ${post.tag}`);
  console.log(`  ${C.gold}Fecha:${C.reset}     ${post.fecha}`);
  console.log(`  ${C.gold}Lectura:${C.reset}   ${post.lectura}`);
  console.log(`  ${C.gold}Resumen:${C.reset}   ${post.resumen.slice(0, 80)}…\n`);

  /* — guardar — */
  try {
    insertarEnData(post);
    ok(`Artículo agregado al blog exitosamente`);
  } catch (e) {
    err('Error al guardar: ' + e.message);
    return false;
  }

  /* — mover a procesados/ — */
  if (!fs.existsSync(PROC)) fs.mkdirSync(PROC, { recursive: true });
  const destino = path.join(PROC, archivo);
  const dest    = fs.existsSync(destino)
    ? path.join(PROC, `${Date.now()}_${archivo}`)
    : destino;
  fs.renameSync(filePath, dest);
  ok(`Archivo guardado en blog-fuente/procesados/`);

  return true;
}

/* ════════════════════════════════════════
   MAIN
════════════════════════════════════════ */

async function main() {
  console.log(`\n${C.bold}${C.gold}  ╔══════════════════════════════════════╗${C.reset}`);
  console.log(`${C.bold}${C.gold}  ║   BIOZAGRI — Agregar artículo blog   ║${C.reset}`);
  console.log(`${C.bold}${C.gold}  ╚══════════════════════════════════════╝${C.reset}\n`);

  if (!fs.existsSync(FUENTE)) {
    err('No existe la carpeta blog-fuente/');
    process.exit(1);
  }

  const EXTS    = ['.docx', '.pdf', '.txt'];
  const archivos = fs.readdirSync(FUENTE).filter(f => {
    return EXTS.includes(path.extname(f).toLowerCase())
        && fs.statSync(path.join(FUENTE, f)).isFile();
  });

  if (archivos.length === 0) {
    warn('No se encontraron archivos en blog-fuente/');
    console.log(`\n${C.muted}  Coloca un archivo .docx, .pdf o .txt en esa carpeta`);
    console.log(`  y vuelve a ejecutar este script.${C.reset}\n`);
    return;
  }

  info(`${archivos.length} archivo(s) encontrado(s): ${archivos.join(', ')}\n`);

  let ok_count = 0;
  for (const archivo of archivos) {
    const exito = await procesarArchivo(archivo);
    if (exito) ok_count++;
  }

  sep();
  console.log();
  if (ok_count > 0) {
    console.log(`${C.bold}${C.green}  ✔  ${ok_count} artículo(s) publicado(s) en el blog.${C.reset}`);
    console.log(`${C.muted}     Recarga la página del sitio web para verlos.${C.reset}\n`);
  } else {
    warn('No se procesó ningún artículo. Revisa los errores arriba.');
  }
}

main().catch(e => {
  console.log(`\n${C.red}  ERROR INESPERADO: ${e.message}${C.reset}\n`);
  process.exit(1);
});
