# BIOZAGRI — Sitio Web

Sitio web estático (sin framework, sin build step) de **Control Research BIOZAGRI SAS**, comercializadora colombiana de insumos agrícolas.

## Stack y cómo correr el sitio localmente

- HTML/CSS/JS puro. No hay build ni bundler.
- `package.json` solo trae `mammoth` como dependencia (usada por `tools/*.js`, no por el sitio en sí).
- El repo trae `serve.ps1` (servidor estático en PowerShell) pensado para Windows. **Este Mac no tiene Node ni PowerShell instalados.**
- Para previsualizar en esta máquina, levantar un servidor estático simple con Python (viene preinstalado en Mac):
  ```
  cd /Users/mari_lozada/Downloads/pagina_web_BIOZAGRI && python3 -m http.server 3333
  ```
- Nota técnica: la herramienta de preview integrada (`preview_start`) no puede servir esta carpeta porque corre en un sandbox limitado al directorio de trabajo de la sesión (`~/Downloads/BIOZAGRI`), que es una carpeta **distinta** a esta (`~/Downloads/pagina_web_BIOZAGRI`, donde vive el sitio real). Por eso el servidor se levanta manualmente por Bash en segundo plano.

## Estructura

- `index.html` — página principal (una sola página con secciones ancla: `#about`, `#portafolio`, `#servicios`, `#estadisticas`, `#testimonios`, `#blog`, `#redes`, `#ubicaciones`, `#contacto`).
- `politica-privacidad.html` — página aparte.
- `css/styles.css`, `js/main.js` (interacciones, filtros, chatbot, contadores), `js/three-scene.js` (fondo 3D del hero).
- `data/biozagri-data.js` — contenido editable de **testimonios** y **blog**, documentado con comentarios en el propio archivo.
- `images/`, `videos/`, `docs/fichas-tecnicas/` — assets. Las fichas técnicas en PDF se linkean desde las tarjetas de producto.
- `tools/agregar-articulo.js` y `tools/eliminar-articulo.js` + los `.bat` en la raíz — utilidades para gestionar artículos del blog vía Node. Son scripts de Windows (`.bat`); en Mac se ejecutarían directo con `node tools/agregar-articulo.js`, pero **Node no está instalado en esta máquina** todavía.

## Datos del negocio (verificados en esta conversación)

- **Sede Principal (bodega):** Apartadó, Antioquia — Kr 100 #43-262 LC 23 · Región de Urabá · Tel +57 320 563 2733
- **Sede Administrativa:** Sabaneta, Antioquia — Cra 46C #80 Sur 155 · Área Metropolitana · Tel +57 314 895 3551
- **Correo:** cr.biozagri.sas@gmail.com
- Antes la sede principal figuraba en **Chigorodó**; ya no — se movió a Apartadó (dato actualizado 2026-07-02, no volver a poner Chigorodó).
- Marca representada: **Agraforum**. Ya **no** se representan las marcas **EASTCHEM** ni **Alife** (se retiraron sus productos del portafolio).

## Portafolio de productos

5 productos activos: Agra-ComCat, CibuSil, AgraAlgen, AgraCoMoP, AgraActivator 12 (categorías: Bioestimulantes, Nutrición Vegetal).

Se retiraron **CETUS 880 OL** (EASTCHEM, fungicida químico) y **CAPITÁN SC** (Alife, biofungicida) — ya no van en el portafolio. Al quitarlos también se eliminaron las categorías/filtros "Fungicidas Biológicos" y "Fungicidas Químicos" (quedaron sin productos) en: grid de productos, filtros del portafolio, footer, y las respuestas del chatbot de WhatsApp en `js/main.js`.

## Estadísticas (sección `#estadisticas`)

Valores actuales (`data-count` en `index.html`):
- Ha Impactadas: **5000+**
- Productos en Catálogo: **5** (sin sufijo "+", es cifra exacta)
- Años de Experiencia: **3+**
- Incremento Promedio en Rendimiento: **14%**

## Secciones desactivadas temporalmente

**Testimonios**, **Blog** y **Síguenos en Redes** están ocultas con `style="display:none"` en sus `<section>` — aún no hay testimonios, artículos ni redes sociales reales. También se ocultaron los íconos de Facebook/Instagram/LinkedIn del footer (se dejó solo el WhatsApp de la sección Contáctanos, para no ser redundante). Los enlaces de navegación a `#blog` se quitaron del menú y del footer mientras esté oculto.

**Para reactivarlas:** quitar el `style="display:none"` de la sección correspondiente (y volver a agregar el link `#blog` al nav si se reactiva el blog). El contenido de fondo (testimonios, artículos) sigue intacto en `data/biozagri-data.js` — incluye una mención a CAPITÁN SC y a Chigorodó que quedaron desactualizadas y habría que revisar antes de reactivar esa sección.

## Convenciones para futuros cambios

- Preferir **desactivar** (ocultar con `display:none` + comentario explicativo) en vez de borrar contenido, cuando el motivo es "no tenemos esto todavía" — es reversible y fácil de reactivar.
- Al quitar/cambiar un producto o un dato (dirección, teléfono, cifra), buscarlo en **todo el sitio**, no solo en la sección obvia — suele repetirse en: hero, "Quiénes Somos", stats, footer, JSON-LD (SEO, `<head>`), y las respuestas del chatbot en `js/main.js`.
