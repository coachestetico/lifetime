/* Landing de venta Lifetime: formulario antes del video, video sin adelantar, oferta al terminar
   y seguimiento de cada paso en la planilla. */
(function () {
  const $ = id => document.getElementById(id);
  const CLAVE = "lifetime:datos";
  const PRUEBA = new URLSearchParams(location.search).get("prueba"); // ?prueba=oferta abre la oferta sin ver el video

  const PAISES = [
    ["AR", "Argentina", "+54"], ["UY", "Uruguay", "+598"], ["CL", "Chile", "+56"], ["PY", "Paraguay", "+595"],
    ["BO", "Bolivia", "+591"], ["PE", "Perú", "+51"], ["EC", "Ecuador", "+593"], ["CO", "Colombia", "+57"],
    ["VE", "Venezuela", "+58"], ["PA", "Panamá", "+507"], ["CR", "Costa Rica", "+506"], ["NI", "Nicaragua", "+505"],
    ["HN", "Honduras", "+504"], ["SV", "El Salvador", "+503"], ["GT", "Guatemala", "+502"], ["MX", "México", "+52"],
    ["DO", "Rep. Dominicana", "+1"], ["PR", "Puerto Rico", "+1"], ["CU", "Cuba", "+53"], ["US", "Estados Unidos", "+1"],
    ["ES", "España", "+34"], ["IT", "Italia", "+39"], ["BR", "Brasil", "+55"], ["XX", "Otro país", "+"]
  ];
  const ZONAS = {
    "America/Montevideo": "UY", "America/Santiago": "CL", "America/Asuncion": "PY", "America/La_Paz": "BO",
    "America/Lima": "PE", "America/Guayaquil": "EC", "America/Bogota": "CO", "America/Caracas": "VE",
    "America/Panama": "PA", "America/Costa_Rica": "CR", "America/Managua": "NI", "America/Tegucigalpa": "HN",
    "America/El_Salvador": "SV", "America/Guatemala": "GT", "America/Santo_Domingo": "DO", "America/Puerto_Rico": "PR",
    "America/Havana": "CU", "Europe/Madrid": "ES", "Atlantic/Canary": "ES", "Europe/Rome": "IT", "America/Sao_Paulo": "BR"
  };
  function paisPorZona() {
    let z = "";
    try { z = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) { /* sin zona */ }
    if (z.startsWith("America/Argentina") || z === "America/Buenos_Aires") return "AR";
    if (ZONAS[z]) return ZONAS[z];
    if (/^America\/(Mexico_City|Cancun|Merida|Monterrey|Chihuahua|Hermosillo|Mazatlan|Tijuana|Bahia_Banderas)$/.test(z)) return "MX";
    if (/^America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Detroit)$/.test(z)) return "US";
    return "";
  }

  /* ---------- Datos guardados en este navegador ---------- */
  let datos = leer();
  function leer() { try { return JSON.parse(localStorage.getItem(CLAVE)) || null; } catch (e) { return null; } }
  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(datos)); } catch (e) { /* sin almacenamiento */ } }

  function origen() {
    const p = new URLSearchParams(location.search);
    const o = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "src", "ref"].forEach(k => { if (p.get(k)) o[k] = p.get(k); });
    if (document.referrer) o.referrer = document.referrer.slice(0, 120);
    return o;
  }

  /* ---------- Envío a la planilla ---------- */
  function enviar(cuerpo, alSalir) {
    if (!CONFIG.registroUrl) { console.info("[planilla]", cuerpo); return; }
    const texto = JSON.stringify(cuerpo);
    if (alSalir && navigator.sendBeacon) {
      navigator.sendBeacon(CONFIG.registroUrl, new Blob([texto], { type: "text/plain;charset=utf-8" }));
      return;
    }
    fetch(CONFIG.registroUrl, { method: "POST", mode: "no-cors", keepalive: true, headers: { "Content-Type": "text/plain;charset=utf-8" }, body: texto })
      .catch(() => { /* sin conexión: no frena la página */ });
  }
  function evento(nombre, extra = {}, alSalir = false) {
    if (!datos || !datos.id || PRUEBA) return;
    enviar({ tipo: "evento", id: datos.id, evento: nombre, segundo: Math.round(maxVisto), porcentaje: porcentaje(), region, ...extra }, alSalir);
  }

  /* ---------- Textos de arriba ---------- */
  $("titulo").innerHTML = CONFIG.titulo;
  $("bajada").textContent = CONFIG.bajada;
  $("puerta-fondo").src = CONFIG.portada;

  /* ---------- Región y precio ---------- */
  const regiones = CONFIG.regiones;
  const completa = r => Boolean(regiones[r] && regiones[r].precio && regiones[r].planes && regiones[r].planes.length);
  const regionDe = p => ({ AR: "AR", VE: "VE", ES: "EUR" })[p] || "USD";
  let regionPropia = "USD";
  let region = "USD";

  function fijarPais(pais) {
    const r = regionDe(pais);
    regionPropia = completa(r) ? r : "USD";
    region = regionPropia;
    pintarPrecio();
  }

  function linkWhatsapp() {
    return CONFIG.whatsapp[region === "EUR" ? "general" : region] || CONFIG.whatsapp[regionPropia] || CONFIG.whatsapp.general;
  }

  function pintarPrecio() {
    const r = regiones[region];
    $("lista").textContent = r.lista || "";
    $("lista").parentElement.hidden = !r.lista;
    $("precio-valor").textContent = r.precio;
    $("descuento").textContent = r.descuento || "";
    $("descuento").hidden = !r.descuento;
    $("precio-detalle").textContent = r.detalle || "";
    $("precio-detalle").hidden = !r.detalle;
    $("nota").textContent = r.nota || "";
    $("barra-fija-precio").textContent = r.precio;

    const planes = $("planes");
    planes.innerHTML = "";
    r.planes.forEach((plan, i) => {
      const a = document.createElement("a");
      a.className = "boton boton-grande" + (i ? " borde" : "");
      a.href = plan.pago;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = plan.boton;
      a.addEventListener("click", () => {
        const esWsp = /wa\.link|wa\.me|whatsapp/.test(plan.pago);
        evento(esWsp ? "clic_whatsapp" : "clic_pago", { plan: plan.boton, lugar: "oferta" }, true);
      });
      planes.appendChild(a);
    });

    $("otro-pais").hidden = regionPropia === "USD";
    $("otro-pais").textContent = region === "USD" ? `Volver a mi precio (${regiones[regionPropia].precio})` : "¿Pagas desde otro país? Ver el precio en dólares";

    $("wsp").href = linkWhatsapp();
    $("wsp-cierre").href = linkWhatsapp();
  }
  $("otro-pais").addEventListener("click", () => { region = region === "USD" ? regionPropia : "USD"; pintarPrecio(); });
  [["wsp", "flotante"], ["wsp-cierre", "cierre"]].forEach(([id, lugar]) =>
    $(id).addEventListener("click", () => evento("clic_whatsapp", { lugar }, true)));

  /* ---------- Cupos: arrancan el lunes (hora Argentina) y bajan durante la semana ---------- */
  function pintarCupos() {
    const { total, minimo } = CONFIG.cupos;
    const ar = new Date(Date.now() - 3 * 3600e3);
    const horas = ((ar.getUTCDay() + 6) % 7) * 24 + ar.getUTCHours();
    const quedan = Math.max(minimo, Math.round(total - (total - minimo) * horas / 168));
    $("cupos-quedan").textContent = quedan;
    $("cupos-total").textContent = total;
    $("cupos-barra").style.width = `${Math.round(quedan / total * 100)}%`;
  }

  /* ---------- Catálogo ---------- */
  function pintarCatalogo() {
    const caja = $("categorias");
    const lista = $("cursos");
    CONFIG.catalogo.forEach(cat => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "categoria";
      b.setAttribute("aria-expanded", "false");
      b.innerHTML = `<span class="num">${cat.cursos.length}</span><b></b><small></small>`;
      b.querySelector("b").textContent = cat.nombre;
      b.querySelector("small").textContent = cat.detalle;
      b.addEventListener("click", () => {
        const abierta = b.getAttribute("aria-expanded") === "true";
        caja.querySelectorAll(".categoria").forEach(x => x.setAttribute("aria-expanded", "false"));
        if (abierta) { lista.hidden = true; return; }
        b.setAttribute("aria-expanded", "true");
        lista.innerHTML = "<ul></ul>";
        cat.cursos.forEach(c => { const li = document.createElement("li"); li.textContent = c; lista.firstChild.appendChild(li); });
        lista.hidden = false;
        if (window.innerWidth < 820) lista.scrollIntoView({ behavior: "smooth", block: "nearest" });
        evento("abrio_categoria", { categoria: cat.nombre });
      });
      caja.appendChild(b);
    });
  }

  /* ---------- Mostrar la oferta ---------- */
  function abrirOferta(porVideo) {
    const yaEstaba = !$("oferta").hidden;
    $("oferta").hidden = false;
    $("ver-oferta").hidden = false;
    $("barra-fija").hidden = false;
    document.body.classList.add("con-barra");
    if (yaEstaba) return;
    if (datos && !datos.oferta) { datos.oferta = true; guardar(); evento("vio_oferta"); }
    if (porVideo) setTimeout(() => $("precio").scrollIntoView({ behavior: "smooth" }), 400);
    observar();
  }

  let observado = false;
  function observar() {
    if (observado || !("IntersectionObserver" in window)) return;
    observado = true;
    const vistos = new Set();
    const io = new IntersectionObserver(entradas => entradas.forEach(e => {
      if (!e.isIntersecting || vistos.has(e.target.id)) return;
      vistos.add(e.target.id);
      evento(e.target.id === "precio" ? "bajo_a_la_oferta" : "bajo_al_catalogo");
    }), { threshold: 0.35 });
    io.observe($("precio"));
    io.observe($("catalogo"));
  }

  /* ---------- Video de YouTube sin adelantar ---------- */
  let reproductor = null;
  let listo = false;
  let duracion = 0;
  let maxVisto = 0;
  let hitos = new Set();
  let ultimoGuardado = 0;
  let quierePlay = false;

  function porcentaje() { return duracion ? Math.min(100, Math.round(maxVisto / duracion * 100)) : 0; }

  function cargarYoutube() {
    window.onYouTubeIframeAPIReady = () => {
      reproductor = new YT.Player("reproductor", {
        videoId: CONFIG.video.youtube,
        playerVars: { controls: 0, disablekb: 1, rel: 0, modestbranding: 1, playsinline: 1, fs: 0, iv_load_policy: 3, cc_load_policy: 0 },
        events: {
          onReady: () => {
            listo = true;
            duracion = reproductor.getDuration() || 0;
            if (quierePlay) reproducir();
          },
          onStateChange: e => {
            const jugando = e.data === YT.PlayerState.PLAYING;
            $("icono-play").hidden = jugando || e.data === YT.PlayerState.BUFFERING || e.data === -1;
            if (jugando && !duracion) duracion = reproductor.getDuration() || 0;
            if (e.data === YT.PlayerState.ENDED) terminar();
          }
        }
      });
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  }

  function reproducir() {
    quierePlay = true;
    $("capa-video").hidden = false;
    $("progreso").hidden = false;
    if (!listo) return;
    const desde = datos && datos.segundo && datos.segundo < duracion - 5 ? datos.segundo : 0;
    if (desde) reproductor.seekTo(desde, true);
    reproductor.unMute();
    reproductor.playVideo();
    if (!datos.empezo) { datos.empezo = true; guardar(); setTimeout(() => evento("empezo_video"), 3000); } // después del registro
    // Si el navegador no deja arrancar con sonido, arranca mudo y pide un toque.
    setTimeout(() => {
      if (reproductor.getPlayerState() !== YT.PlayerState.PLAYING) { reproductor.mute(); reproductor.playVideo(); }
      if (reproductor.isMuted()) $("sonido").hidden = false;
    }, 1500);
  }

  $("sonido").addEventListener("click", () => { reproductor.unMute(); reproductor.setVolume(100); reproductor.playVideo(); $("sonido").hidden = true; });
  $("capa-video").addEventListener("click", () => {
    if (!listo) return;
    if (reproductor.isMuted()) { reproductor.unMute(); $("sonido").hidden = true; return; }
    if (reproductor.getPlayerState() === YT.PlayerState.PLAYING) { reproductor.pauseVideo(); evento("pauso"); }
    else reproductor.playVideo();
  });

  function terminar() {
    maxVisto = duracion || maxVisto;
    if (!datos.completo) { datos.completo = true; guardar(); evento("vio_completo"); }
    abrirOferta(true);
  }

  setInterval(() => {
    if (!listo || !reproductor.getCurrentTime) return;
    const t = reproductor.getCurrentTime() || 0;
    if (!duracion) duracion = reproductor.getDuration() || 0;
    if (t > maxVisto) maxVisto = t;
    if (duracion) $("progreso-barra").style.width = `${Math.min(100, t / duracion * 100)}%`;
    if (!datos) return;

    const p = porcentaje();
    [10, 25, 50, 75, 90].forEach(h => {
      if (p >= h && !hitos.has(h)) { hitos.add(h); if (!(datos.hitos || []).includes(h)) evento("progreso", { hito: h }); }
    });
    datos.hitos = Array.from(new Set([...(datos.hitos || []), ...hitos]));

    if (CONFIG.video.ofertaSegundo && t >= CONFIG.video.ofertaSegundo) abrirOferta(false);
    if (Date.now() - ultimoGuardado > 4000) { datos.segundo = Math.floor(t); datos.max = Math.max(datos.max || 0, Math.floor(maxVisto)); ultimoGuardado = Date.now(); guardar(); }
  }, 1000);

  // Al salir o cambiar de app: guarda hasta dónde vio.
  let ultimoEnviado = -1;
  function alSalir() {
    if (!datos || Math.round(maxVisto) === ultimoEnviado) return;
    ultimoEnviado = Math.round(maxVisto);
    evento("salio", {}, true);
  }
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") alSalir(); });
  window.addEventListener("pagehide", alSalir);

  /* ---------- Formulario ---------- */
  const select = $("pais");
  PAISES.forEach(([cod, nombre, tel]) => {
    const o = document.createElement("option");
    o.value = cod;
    o.textContent = tel === "+" ? nombre : `${nombre} (${tel})`;
    select.appendChild(o);
  });
  function pintarCodigo() {
    const tel = (PAISES.find(p => p[0] === select.value) || [])[2] || "+";
    $("tel-codigo").textContent = tel;
    $("telefono").placeholder = tel === "+" ? "Código de país y número" : "Número de celular";
  }
  select.value = paisPorZona() || "AR";
  pintarCodigo();
  select.addEventListener("change", () => { pintarCodigo(); fijarPais(select.value); });

  $("puerta").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target;
    const nombre = f.nombre.value.trim();
    const telefono = f.telefono.value.replace(/[^\d]/g, "");
    const error = $("error");
    if (nombre.length < 2) { error.textContent = "Escribe tu nombre."; error.hidden = false; f.nombre.focus(); return; }
    if (telefono.length < 6) { error.textContent = "Escribe tu WhatsApp con código de área."; error.hidden = false; f.telefono.focus(); return; }
    error.hidden = true;
    if (f.web.value) return; // robot

    const pais = select.value;
    const codigo = (PAISES.find(p => p[0] === pais) || [])[2] || "";
    const azar = crypto.getRandomValues ? Array.from(crypto.getRandomValues(new Uint32Array(2)), n => n.toString(36)).join("") : String(Math.random()).slice(2);
    datos = { id: azar.slice(0, 12), nombre, pais, codigo: codigo === "+" ? "" : codigo, telefono, origen: origen(), registro: Date.now() };
    guardar();
    fijarPais(pais);
    if (!PRUEBA) enviar({ tipo: "registro", ...datos, region, zona: Intl.DateTimeFormat().resolvedOptions().timeZone || "" });
    $("puerta").hidden = true;
    reproducir();
  });

  /* ---------- Arranque ---------- */
  pintarCupos();
  pintarCatalogo();
  cargarYoutube();

  if (datos && datos.id) {
    // Ya se registró antes: no vuelve a pedir datos.
    fijarPais(datos.pais);
    maxVisto = datos.max || 0;
    hitos = new Set(datos.hitos || []);
    $("puerta").hidden = true;
    $("continuar").hidden = false;
    $("continuar-titulo").textContent = `Hola de nuevo, ${datos.nombre.split(" ")[0]}`;
    $("continuar-boton").textContent = datos.completo ? "Ver el video de nuevo ▶" : "Seguir viendo ▶";
    $("continuar-boton").addEventListener("click", () => {
      if (datos.completo) datos.segundo = 0;
      $("continuar").hidden = true;
      reproducir();
    });
    evento("volvio");
    if (datos.oferta || datos.completo) abrirOferta(false);
  } else {
    fijarPais(select.value);
  }
  if (PRUEBA === "oferta") abrirOferta(false);
})();
