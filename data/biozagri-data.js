/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║         BIOZAGRI SAS — ARCHIVO DE CONTENIDO             ║
 * ╠══════════════════════════════════════════════════════════╣
 * ║  Aquí puedes actualizar testimonios y artículos del     ║
 * ║  blog SIN tocar el HTML principal.                      ║
 * ║                                                         ║
 * ║  ► TESTIMONIOS: edita el array window.BZ.testimonios    ║
 * ║  ► BLOG:        edita el array window.BZ.blog           ║
 * ║                                                         ║
 * ║  Cada campo está explicado con un comentario.           ║
 * ╚══════════════════════════════════════════════════════════╝
 */

window.BZ = {

  /* ─────────────────────────────────────────────────────────
     TESTIMONIOS
     ─────────────────────────────────────────────────────────
     Agrega, edita o elimina bloques { ... } separados por coma.
     estrellas: número entre 1 y 5 (acepta .5 para media estrella)
     color:     fondo del círculo con las iniciales (gradiente CSS)
  ───────────────────────────────────────────────────────── */
  testimonios: [

    {
      nombre:    "Carlos Restrepo",
      cargo:     "Productor de aguacate · Rionegro, Antioquia",
      texto:     "Los productos de BIOZAGRI transformaron completamente mis cultivos de aguacate. El CAPITÁN SC controló los hongos de suelo de manera increíble desde la primera aplicación. El soporte técnico es excepcional y siempre disponible.",
      estrellas: 5,
      iniciales: "CR",
      color:     "linear-gradient(135deg,#2e7d32,#4caf50)"
    },

    {
      nombre:    "Familia Zapata",
      cargo:     "Productores de banano · Chigorodó, Antioquia",
      texto:     "Trabajar con BIOZAGRI nos dio la tranquilidad de usar productos certificados ICA. El equipo técnico siempre está disponible. Los resultados en nuestros cultivos de banano en Chigorodó son increíbles y medibles.",
      estrellas: 5,
      iniciales: "FZ",
      color:     "linear-gradient(135deg,#c9a84c,#e65100)"
    },

    {
      nombre:    "Agroempresa Las Flores",
      cargo:     "Flores de exportación · La Ceja, Antioquia",
      texto:     "La calidad de sus bioinsumos y la asesoría personalizada nos ayudó a reducir costos de producción en un 25% sin afectar la calidad exportable de nuestras flores. Absolutamente recomendados.",
      estrellas: 4.5,
      iniciales: "AF",
      color:     "linear-gradient(135deg,#6a1b9a,#4a148c)"
    },

    {
      nombre:    "Ing. María Jiménez",
      cargo:     "Caficultora · Andes, Antioquia",
      texto:     "El servicio técnico de BIOZAGRI es excepcional. Me guiaron paso a paso en la implementación del programa de nutrición en mis cafetales y los resultados superaron mis expectativas en la cosecha.",
      estrellas: 5,
      iniciales: "MJ",
      color:     "linear-gradient(135deg,#c62828,#b71c1c)"
    }

    /* ── PLANTILLA para copiar y pegar un testimonio nuevo: ──
    ,{
      nombre:    "Nombre del cliente",
      cargo:     "Tipo de productor · Municipio, Departamento",
      texto:     "El testimonio completo va aquí entre comillas.",
      estrellas: 5,
      iniciales: "XX",
      color:     "linear-gradient(135deg,#1a5276,#2e7fd4)"
    }
    ─────────────────────────────────────────────────────── */
  ],


  /* ─────────────────────────────────────────────────────────
     ARTÍCULOS DEL BLOG
     ─────────────────────────────────────────────────────────
     tag:      etiqueta visible en la tarjeta (ej. "Fitosanidad")
     fecha:    texto libre (ej. "Mayo 20, 2026")
     lectura:  texto libre (ej. "5 min lectura") — déjalo vacío "" si no sabes
     featured: true = tarjeta grande destacada (solo el primero)
     imagen:   ruta a una imagen (ej. "images/blog/mi-foto.jpg")
                o "" para usar el fondo de color por defecto
     contenido: el artículo completo en HTML.
                 Usa <p>, <h3>, <ul>, <li>, <strong>, <em>.
                 Puedes poner varios párrafos.
  ───────────────────────────────────────────────────────── */
  /* ─────────────────────────────────────────────────────────
     FOTO DE PORTADA DE CADA ARTÍCULO
     ─────────────────────────────────────────────────────────
     imagen: ruta a la foto de portada, ej. "images/blog/mi-foto.jpg"
             Déjalo "" para usar el color automático de la categoría.
             Tamaño recomendado: 800×400 px, formato JPG o PNG.
             Pon la foto en la carpeta  images/blog/

     pdf:    ruta al PDF original si quieres que los visitantes
             puedan leerlo con gráficas dentro de la página.
             Ej: "docs/blog/mi-estudio.pdf"
             Déjalo "" si el artículo no tiene PDF.
  ───────────────────────────────────────────────────────── */
  blog: [

    /* ── Los artículos más NUEVOS van primero ── */


    {
      id:        "efecto-del-uso-predominante-de-fungicidas-sistemicos-para-el",
      tag:       "Fitosanidad",
      fecha:     "Mayo 30, 2026",
      lectura:   "26 min lectura",
      featured:  true,
      imagen:    "images/blog/efecto-del-uso-predominante-de-fungicidas-sistemicos-para-el.jpg",
      pdf:       "docs/blog/efecto-del-uso-predominante-de-fungicidas-sistemicos-para-el.pdf",
      titulo:    "Efecto del uso predominante de fungicidas sistémicos para el control de Sigatoka negra en el área foliar del banano",
      resumen:   "Estudio de campo (2018) que analiza la eficiencia de fungicidas sistémicos y protectantes en el control de Mycosphaerella fijiensis en cuatro fincas bananeras, evaluando área foliar y estado fitosanitario.",
      contenido: `
        <p>La <strong>Sigatoka negra</strong> (<em>Mycosphaerella fijiensis</em> Morelet) es una de las enfermedades foliares más graves del cultivo de banano. En zonas de alta humedad relativa, como el sur de Guayas y el norte de El Oro (Ecuador), los productores han recurrido históricamente al uso intensivo de fungicidas sistémicos.</p>

        <h3>Objetivo del estudio</h3>
        <p>Evaluar la eficiencia de los fungicidas más utilizados en cuatro fincas bananeras, estimando su desempeño mediante el <strong>preaviso biológico</strong> en plantas próximas a la floración, con un diseño experimental de bloques al azar (Tukey, 0.05 de confiabilidad).</p>

        <h3>Principales hallazgos</h3>
        <ul>
          <li>Las fincas <strong>San Andrés 1-2 y San Andrés 3</strong> (que alternaron sistémicos y protectantes + abonos foliares) mostraron valores estadísticamente superiores.</li>
          <li>Las fincas <strong>Elizabeth 2 y La Italia</strong> (uso predominante de sistémicos) presentaron estados evolutivos más altos en hojas jóvenes y emisión foliar más lenta.</li>
          <li>La rotación y mezcla de grupos fungicidas, complementada con nutrición foliar, resultó en mayor número de hojas sanas a la cosecha.</li>
        </ul>

        <h3>Conclusión</h3>
        <p>El uso exclusivo de fungicidas sistémicos sin rotación con protectantes disminuye la eficacia del control y deteriora el estado foliar del banano. La alternancia de modos de acción, combinada con nutrición, es la estrategia más eficiente.</p>

        <p><strong>Fuente:</strong> Quevedo Guerrero, J. et al. (2018). Revista Científica Agroecosistemas, 6(1), 128-136.</p>
      `
    },

    {
      id:        "bioinsumos-banano-uraba",
      tag:       "Casos de Éxito",
      fecha:     "Mayo 20, 2026",
      lectura:   "5 min lectura",
      featured:  false,
      imagen:    "",
      pdf:       "",
      titulo:    "Bioinsumos en cultivos de banano del Urabá: resultados reales de campo",
      resumen:   "Productores de Chigorodó reportan incrementos del 35% en rendimiento tras adoptar un programa integral de biofertilización con productos BIOZAGRI durante dos temporadas consecutivas.",
      contenido: `
        <p>Durante las temporadas 2024 y 2025, productores bananeros del municipio de Chigorodó (Urabá antioqueño) implementaron un programa de biofertilización basado en los productos de BIOZAGRI SAS, con resultados que superaron las proyecciones iniciales del equipo técnico.</p>

        <h3>Programa aplicado</h3>
        <p>El protocolo incluyó aplicaciones de <strong>AgraAlgen</strong> (bioestimulante de algas marinas) cada 21 días durante el ciclo de llenado, combinado con <strong>AgraCoMoP</strong> (cofactor enzimático cobre-molibdeno-fósforo) y drenches de <strong>CAPITÁN SC</strong> para el control preventivo de Fusarium.</p>

        <h3>Resultados obtenidos</h3>
        <ul>
          <li>Incremento del <strong>35% en rendimiento</strong> (cajas/hectárea) frente al ciclo anterior sin bioinsumos.</li>
          <li>Reducción del <strong>22% en incidencia</strong> de Sigatoka negra gracias al mejor estado nutricional de la planta.</li>
          <li>Disminución de costos de fungicidas químicos en un <strong>18%</strong> al fortalecer la resistencia sistémica.</li>
          <li>Fruta con mejor calibre y color, mejorando la tasa de aceptación en empacadoras exportadoras.</li>
        </ul>

        <h3>Testimonio del productor</h3>
        <p><em>"Nunca pensé que un cambio en el programa de nutrición pudiera hacer tanta diferencia. El equipo de BIOZAGRI nos acompañó en cada visita y los resultados hablan solos."</em> — Productor participante, Chigorodó.</p>

        <p>¿Quieres implementar un programa similar en tu finca? <strong>Contáctanos</strong> y un asesor técnico te diseña el plan según tu cultivo y zona.</p>
      `
    },

    {
      id:        "control-biologico-fusarium",
      tag:       "Fitosanidad",
      fecha:     "Mayo 15, 2026",
      lectura:   "4 min lectura",
      featured:  false,
      imagen:    "",
      pdf:       "",
      titulo:    "Control biológico de Fusarium: alternativas sostenibles para productores",
      resumen:   "Cómo Trichoderma harzianum y Bacillus spp. ofrecen soluciones eficaces y duraderas frente al Fusarium en aguacate y café.",
      contenido: `
        <p>El <strong>Fusarium</strong> (Fusarium oxysporum y F. solani) sigue siendo una de las enfermedades de suelo más devastadoras para cultivos como aguacate, banano, café y flores de exportación en Colombia. La resistencia creciente a fungicidas químicos ha impulsado la búsqueda de alternativas biológicas eficaces.</p>

        <h3>¿Cómo funciona el control biológico?</h3>
        <p>Microorganismos como <strong>Trichoderma harzianum</strong> y <strong>Bacillus subtilis</strong> actúan mediante tres mecanismos complementarios:</p>
        <ul>
          <li><strong>Competencia:</strong> colonizan la rizosfera antes que el patógeno, ocupando el espacio y los nutrientes disponibles.</li>
          <li><strong>Micoparasitismo:</strong> Trichoderma ataca directamente las hifas de Fusarium, destruyendo su estructura.</li>
          <li><strong>Inducción de resistencia sistémica:</strong> activan las defensas naturales de la planta (SAR/ISR).</li>
        </ul>

        <h3>Productos BIOZAGRI para el manejo de Fusarium</h3>
        <p>El <strong>CAPITÁN SC</strong> (metalaxil + fludioxonil) ofrece control curativo y preventivo sistémico de alta eficacia. Para un enfoque integrado, se combina con biofertilizantes como <strong>AgraActivator 12</strong> que fortalecen la salud radicular y reducen la vulnerabilidad de la planta.</p>

        <h3>Recomendaciones prácticas</h3>
        <ul>
          <li>Aplicar al momento del trasplante o en los primeros síntomas.</li>
          <li>Rotar entre mecanismos de acción para evitar resistencia.</li>
          <li>Complementar con manejo cultural: buen drenaje, pH de suelo entre 6.0 y 6.5, evitar heridas en raíces.</li>
        </ul>

        <p>Consulta con nuestro equipo técnico el protocolo ideal para tu cultivo y región.</p>
      `
    },

    {
      id:        "regulaciones-ica-2026",
      tag:       "Regulaciones",
      fecha:     "Mayo 10, 2026",
      lectura:   "3 min lectura",
      featured:  false,
      imagen:    "",
      pdf:       "",
      titulo:    "Nuevas regulaciones ICA para insumos agrícolas 2026",
      resumen:   "Actualizaciones en las resoluciones del ICA sobre registro, importación y uso de insumos biológicos y cómo afectan a los productores colombianos.",
      contenido: `
        <p>El Instituto Colombiano Agropecuario (<strong>ICA</strong>) actualizó durante 2025-2026 varios marcos normativos que afectan directamente el registro, comercialización y uso de insumos agrícolas en Colombia. Estos son los puntos clave que todo productor e importador debe conocer.</p>

        <h3>Principales cambios normativos</h3>
        <ul>
          <li><strong>Resolución 00010 de 2026:</strong> actualiza los requisitos técnicos para el registro de bioinsumos de origen microbiano, exigiendo estudios de eficacia en condiciones locales y certificados de inocuidad actualizados.</li>
          <li><strong>Decreto 456 de 2025:</strong> amplía el período de transición para productos con registro antiguo, permitiendo su comercialización hasta diciembre de 2026 mientras se tramita la renovación.</li>
          <li><strong>Trazabilidad obligatoria:</strong> desde enero de 2026 los distribuidores deben llevar registro digital de lote, proveedor y destino para todos los productos con registro ICA activo.</li>
        </ul>

        <h3>¿Cómo afecta a los productores?</h3>
        <p>Los productores deben verificar que los insumos que compran cuenten con <strong>registro ICA vigente</strong>. Usar productos sin registro o con registro vencido puede generar sanciones y pérdida de la certificación de buenas prácticas agrícolas (BPA).</p>

        <h3>BIOZAGRI y el cumplimiento normativo</h3>
        <p>Todos los productos que BIOZAGRI SAS comercializa cuentan con registro ICA activo y vigente. Los registros de empresa <strong>PL0000932026 · CO0000122025 · CM0015022024</strong> respaldan nuestra operación como distribuidor autorizado en Colombia.</p>

        <p>Si tienes dudas sobre la legalidad de un insumo o necesitas asesoría, escríbenos — te ayudamos a revisar la situación normativa de tu proveedor actual.</p>
      `
    },

    /* ── PLANTILLA para copiar y pegar un artículo nuevo: ──
    ,{
      id:        "id-unico-sin-espacios",
      tag:       "Categoría del artículo",
      fecha:     "Mes DD, YYYY",
      lectura:   "X min lectura",
      featured:  false,
      imagen:    "",
      pdf:       "",
      titulo:    "Título del artículo",
      resumen:   "Resumen corto que aparece en la tarjeta (2-3 líneas).",
      contenido: `
        <p>Primer párrafo del artículo...</p>
        <h3>Subtítulo</h3>
        <p>Más texto...</p>
        <ul>
          <li>Punto 1</li>
          <li>Punto 2</li>
        </ul>
        <p>Párrafo de cierre con llamado a la acción.</p>
      `
    }
    ─────────────────────────────────────────────────────── */
  ]

}; // fin de window.BZ
