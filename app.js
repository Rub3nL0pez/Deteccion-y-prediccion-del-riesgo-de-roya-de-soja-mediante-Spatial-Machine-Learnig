/**
 * GeoRoya ML - Spatial Machine Learning Agritech Platform
 * Interactive Application Logic & Geospatial Simulation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initSimulator();
  initRoiCalculator();
  initTabs();
  initFaqAccordion();
  initFormValidation();
  initScrollSpy();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light)
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const savedTheme = localStorage.getItem('georoya-theme');

  if (savedTheme === 'light') {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
  }

  themeToggle?.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      localStorage.setItem('georoya-theme', 'light');
    } else {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      localStorage.setItem('georoya-theme', 'dark');
    }
  });
}

/* ==========================================================================
   2. Mobile Navigation
   ========================================================================== */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileToggle?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      mobileToggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   3. Geospatial Risk Simulator
   ========================================================================== */
const LOTS_DATA = {
  1: {
    name: 'Lote 01 - Norte Alfa',
    surface: 'Lote Agrícola • 180 ha',
    history: [
      { prob: 24, dew: 5.2, temp: 23.5, ndre: 0.74, spatialLag: '0.22 (Baja)', riskLevel: 'low', text: 'Bajo riesgo. Monitoreo rutinario sin necesidad de aplicación en los próximos 10 días.' },
      { prob: 48, dew: 6.8, temp: 22.4, ndre: 0.68, spatialLag: '0.72 (Alta)', riskLevel: 'mod', text: 'Alerta preventiva. Incremento de horas de rocío (>6.5h) y dispersión por viento desde el lote vecino #3.' },
      { prob: 78, dew: 8.4, temp: 21.8, ndre: 0.58, spatialLag: '0.88 (Crítica)', riskLevel: 'crit', text: 'URGENTE: Ventana biológica óptima para esporulación. Se recomienda aplicación fungicida con mezcla triazol + estrobilurina en <48h.' },
      { prob: 91, dew: 9.1, temp: 21.2, ndre: 0.44, spatialLag: '0.95 (Severa)', riskLevel: 'crit', text: 'Ataque inminente. Pústulas microscópicas avanzadas. Riesgo de defoliación en estrato medio del cultivo.' }
    ]
  },
  2: {
    name: 'Lote 02 - Este Beta',
    surface: 'Lote Agrícola • 240 ha',
    history: [
      { prob: 15, dew: 4.8, temp: 24.1, ndre: 0.78, spatialLag: '0.14 (Nula)', riskLevel: 'low', text: 'Condición favorable y canopia ventilada. Sin presión de inóculo detectable.' },
      { prob: 28, dew: 5.6, temp: 23.2, ndre: 0.72, spatialLag: '0.35 (Leve)', riskLevel: 'low', text: 'Ligero aumento de humedad nocturna. Se mantiene en rango seguro.' },
      { prob: 52, dew: 7.2, temp: 22.0, ndre: 0.64, spatialLag: '0.65 (Moderada)', riskLevel: 'mod', text: 'Alerta media. Dispersión eólica aproximándose. Evaluar estado fenológico (R2-R4).' },
      { prob: 74, dew: 8.0, temp: 21.5, ndre: 0.55, spatialLag: '0.82 (Alta)', riskLevel: 'crit', text: 'Riesgo elevado. Planificar aplicación de protección en bloque junto a Lote 01.' }
    ]
  },
  3: {
    name: 'Lote 03 - Valle Central',
    surface: 'Lote Agrícola • 310 ha',
    history: [
      { prob: 58, dew: 7.5, temp: 22.1, ndre: 0.62, spatialLag: '0.78 (Foco Inicial)', riskLevel: 'mod', text: 'Foco inicial detectado. Zona baja con acumulación de rocío persistente (>7.5h). Alta receptividad biológica.' },
      { prob: 82, dew: 8.8, temp: 21.6, ndre: 0.52, spatialLag: '0.92 (Crítica)', riskLevel: 'crit', text: 'CRÍTICO: Inóculo activo en proliferación. Aplicar tratamiento fitosanitario curativo/preventivo de inmediato.' },
      { prob: 95, dew: 9.4, temp: 21.0, ndre: 0.41, spatialLag: '0.98 (Extrema)', riskLevel: 'crit', text: 'Severidad alta. Presión masiva de urediniosporas que infectará toda la cuenca agrícola si no se controla.' },
      { prob: 98, dew: 9.6, temp: 20.8, ndre: 0.35, spatialLag: '0.99 (Extrema)', riskLevel: 'crit', text: 'Foco epicéntrico consolidado. Daño económico ya en curso si no se intervino en T+0.' }
    ]
  },
  4: {
    name: 'Lote 04 - Sur Delta',
    surface: 'Lote Agrícola • 210 ha',
    history: [
      { prob: 12, dew: 3.9, temp: 25.0, ndre: 0.81, spatialLag: '0.08 (Nula)', riskLevel: 'low', text: 'Lote sano y protegido. Suelo bien drenado y baja retención de humedad foliar.' },
      { prob: 20, dew: 4.5, temp: 24.3, ndre: 0.77, spatialLag: '0.18 (Baja)', riskLevel: 'low', text: 'Riesgo insignificante. No justificar aplicación de insumos en este sector.' },
      { prob: 38, dew: 6.0, temp: 23.4, ndre: 0.71, spatialLag: '0.45 (Moderada)', riskLevel: 'mod', text: 'Comienza influencia de esporas transportadas desde el Valle Central (Lote 03).' },
      { prob: 64, dew: 7.6, temp: 22.1, ndre: 0.60, spatialLag: '0.75 (Alta)', riskLevel: 'mod', text: 'Atención: Umbral de decisión alcanzado. Efectuar monitoreo foliar focalizado.' }
    ]
  },
  5: {
    name: 'Lote 05 - Lagunas Leste',
    surface: 'Lote Agrícola • 165 ha',
    history: [
      { prob: 32, dew: 6.2, temp: 23.0, ndre: 0.70, spatialLag: '0.40 (Media)', riskLevel: 'mod', text: 'Microclima húmedo por cercanía al espejo de agua, pero aún sin esporas activas.' },
      { prob: 45, dew: 7.0, temp: 22.6, ndre: 0.65, spatialLag: '0.58 (Media)', riskLevel: 'mod', text: 'Aumento gradual de rocío. Mantener en observación satelital.' },
      { prob: 69, dew: 8.2, temp: 21.9, ndre: 0.57, spatialLag: '0.79 (Alta)', riskLevel: 'crit', text: 'Infección potencial en 72hs si continúa la calma de viento nocturno.' },
      { prob: 86, dew: 8.9, temp: 21.4, ndre: 0.46, spatialLag: '0.90 (Crítica)', riskLevel: 'crit', text: 'Condición crítica confirmada. Aplicar fungicida multisitio + sistémico.' }
    ]
  },
  6: {
    name: 'Lote 06 - Bajo Gamma',
    surface: 'Lote Agrícola • 190 ha',
    history: [
      { prob: 42, dew: 6.9, temp: 22.8, ndre: 0.67, spatialLag: '0.52 (Media)', riskLevel: 'mod', text: 'Área topográficamente baja (SRTM DEM revela acumulación de humedad por escorrentía).' },
      { prob: 68, dew: 8.1, temp: 22.0, ndre: 0.59, spatialLag: '0.76 (Alta)', riskLevel: 'crit', text: 'Riesgo alto inminente. El frente de esporas del Lote 03 avanza en esta dirección.' },
      { prob: 88, dew: 9.0, temp: 21.3, ndre: 0.48, spatialLag: '0.91 (Crítica)', riskLevel: 'crit', text: 'Alerta máxima. Intervención obligatoria para resguardar producción.' },
      { prob: 94, dew: 9.5, temp: 20.9, ndre: 0.38, spatialLag: '0.97 (Severa)', riskLevel: 'crit', text: 'Pérdidas irreversibles proyectadas sin pulverización oportuna.' }
    ]
  }
};

let currentSelectedLot = 1;
let currentHorizonStep = 0;
let currentLayer = 'risk';
let isPlayingTime = false;
let playInterval = null;

function initSimulator() {
  const lotPolygons = document.querySelectorAll('.field-polygon');
  const horizonSlider = document.getElementById('timeHorizonRange');
  const layerButtons = document.querySelectorAll('.layer-btn');
  const btnPlay = document.getElementById('btnPlayTime');
  const regionSelect = document.getElementById('regionSelect');
  const btnExport = document.getElementById('btnExportLoteReport');

  // Lot polygon selection
  lotPolygons.forEach(polygon => {
    polygon.addEventListener('click', () => {
      const lotId = parseInt(polygon.getAttribute('data-lot-id'), 10);
      selectLot(lotId);
    });
  });

  // Horizon slider
  horizonSlider?.addEventListener('input', (e) => {
    currentHorizonStep = parseInt(e.target.value, 10);
    updateSimulatorState();
  });

  // Layer toggles
  layerButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      layerButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLayer = btn.getAttribute('data-layer');
      updateSimulatorVisuals();
    });
  });

  // Time Play/Pause button
  btnPlay?.addEventListener('click', toggleTimePlay);

  // Region change
  regionSelect?.addEventListener('change', () => {
    // Flash simulation effect
    const parcelsMap = document.getElementById('parcelsMap');
    if (parcelsMap) {
      parcelsMap.style.opacity = '0.4';
      setTimeout(() => {
        parcelsMap.style.opacity = '1';
        updateSimulatorState();
      }, 250);
    }
  });

  // Export report button
  btnExport?.addEventListener('click', () => {
    const lot = LOTS_DATA[currentSelectedLot];
    const stepData = lot.history[currentHorizonStep];
    const horizons = ['Hoy (T=0)', '+3 Días', '+7 Días', '+14 Días'];
    
    alert(`📄 FICHA TÉCNICA FITOSANITARIA - GEOROYA ML\n` +
          `===========================================\n` +
          `Lote: ${lot.name}\n` +
          `Superficie: ${lot.surface}\n` +
          `Horizonte Evaluado: ${horizons[currentHorizonStep]}\n` +
          `Probabilidad de Roya: ${stepData.prob}%\n` +
          `Humedad Foliar / Rocío: ${stepData.dew} horas continuas\n` +
          `Temperatura de Canopia: ${stepData.temp} °C\n` +
          `Índice NDRE: ${stepData.ndre}\n` +
          `Presión Espacial (W-Matrix): ${stepData.spatialLag}\n` +
          `-------------------------------------------\n` +
          `Recomendación: ${stepData.text}\n` +
          `===========================================\n` +
          `Generado exitosamente con Spatial Machine Learning.`);
  });

  // Initial render
  selectLot(1);
  updateSimulatorVisuals();
}

function selectLot(lotId) {
  currentSelectedLot = lotId;
  document.querySelectorAll('.field-polygon').forEach(poly => {
    poly.classList.remove('active-lot');
  });
  const selectedPoly = document.getElementById(`lot-${lotId}`);
  if (selectedPoly) {
    selectedPoly.classList.add('active-lot');
  }
  updateInspectorPanel();
}

function updateSimulatorState() {
  // Update horizon label & slider ticks
  const horizonLabels = ['Hoy (T = 0)', '+3 Días', '+7 Días', '+14 Días'];
  const horizonLabelEl = document.getElementById('currentHorizonLabel');
  if (horizonLabelEl) {
    horizonLabelEl.textContent = horizonLabels[currentHorizonStep];
  }

  const ticks = document.querySelectorAll('.slider-ticks .tick');
  ticks.forEach((t, idx) => {
    t.classList.toggle('active', idx === currentHorizonStep);
  });

  updateSimulatorVisuals();
  updateInspectorPanel();
}

function updateSimulatorVisuals() {
  const windLayer = document.getElementById('windLayer');
  const legendBar = document.getElementById('legendBar');
  const legendTitle = document.getElementById('legendTitle');
  const legendLabels = document.getElementById('legendLabels');

  // Toggle wind layer visibility
  if (windLayer) {
    windLayer.style.opacity = currentLayer === 'wind' ? '1' : '0';
  }

  // Update legend description according to layer
  if (legendTitle && legendBar && legendLabels) {
    if (currentLayer === 'risk') {
      legendTitle.textContent = 'Riesgo Infección Spatial ML:';
      legendBar.style.background = 'linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%)';
      legendLabels.innerHTML = '<span>Bajo (&lt;25%)</span><span>Moderado</span><span>Crítico (&gt;65%)</span>';
    } else if (currentLayer === 'ndvi') {
      legendTitle.textContent = 'Índice Vigor Vegetativo NDVI:';
      legendBar.style.background = 'linear-gradient(90deg, #713f12 0%, #eab308 50%, #10b981 100%)';
      legendLabels.innerHTML = '<span>Estrés (&lt;0.4)</span><span>Medio</span><span>Denso (&gt;0.85)</span>';
    } else if (currentLayer === 'dew') {
      legendTitle.textContent = 'Horas Continuas de Rocío / Humedad:';
      legendBar.style.background = 'linear-gradient(90deg, #1e293b 0%, #0284c7 50%, #38bdf8 100%)';
      legendLabels.innerHTML = '<span>&lt;4 horas</span><span>6-8 horas</span><span>&gt;9 horas (Riesgo)</span>';
    } else if (currentLayer === 'wind') {
      legendTitle.textContent = 'Vector de Viento y Dispersión de Esporas:';
      legendBar.style.background = 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)';
      legendLabels.innerHTML = '<span>12 km/h</span><span>Dirección SSE</span><span>28 km/h</span>';
    }
  }

  // Color each polygon according to selected layer and current time horizon
  for (let i = 1; i <= 6; i++) {
    const poly = document.getElementById(`lot-${i}`);
    if (!poly) continue;

    const lot = LOTS_DATA[i];
    const data = lot.history[currentHorizonStep];

    if (currentLayer === 'risk') {
      if (data.prob < 30) {
        poly.style.fill = 'rgba(16, 185, 129, 0.45)';
      } else if (data.prob < 70) {
        poly.style.fill = 'rgba(245, 158, 11, 0.55)';
      } else {
        poly.style.fill = 'rgba(239, 68, 68, 0.65)';
      }
    } else if (currentLayer === 'ndvi') {
      // higher ndre/ndvi = greener
      const greenVal = Math.round(data.ndre * 200 + 30);
      poly.style.fill = `rgba(16, ${greenVal}, 100, 0.55)`;
    } else if (currentLayer === 'dew') {
      // higher dew = more blue
      const blueAlpha = Math.min(0.85, data.dew / 11);
      poly.style.fill = `rgba(6, 182, 212, ${blueAlpha})`;
    } else if (currentLayer === 'wind') {
      poly.style.fill = 'rgba(15, 23, 42, 0.7)';
    }
  }
}

function updateInspectorPanel() {
  const lot = LOTS_DATA[currentSelectedLot];
  if (!lot) return;

  const data = lot.history[currentHorizonStep];

  const inspNombre = document.getElementById('inspNombre');
  const inspSuperficie = document.getElementById('inspSuperficie');
  const inspRiskBadge = document.getElementById('inspRiskBadge');
  const inspProbVal = document.getElementById('inspProbVal');
  const inspProbBar = document.getElementById('inspProbBar');
  const inspHumedad = document.getElementById('inspHumedad');
  const inspTemp = document.getElementById('inspTemp');
  const inspNdre = document.getElementById('inspNdre');
  const inspSpatialLag = document.getElementById('inspSpatialLag');
  const inspPrescriptionText = document.getElementById('inspPrescriptionText');

  if (inspNombre) inspNombre.textContent = lot.name;
  if (inspSuperficie) inspSuperficie.textContent = lot.surface;
  if (inspProbVal) inspProbVal.textContent = `${data.prob}%`;
  if (inspProbBar) {
    inspProbBar.style.width = `${data.prob}%`;
    if (data.prob < 30) {
      inspProbBar.style.background = 'linear-gradient(90deg, #10b981, #059669)';
    } else if (data.prob < 70) {
      inspProbBar.style.background = 'linear-gradient(90deg, #10b981, #f59e0b)';
    } else {
      inspProbBar.style.background = 'linear-gradient(90deg, #f59e0b, #ef4444)';
    }
  }

  if (inspRiskBadge) {
    inspRiskBadge.className = 'risk-badge';
    if (data.riskLevel === 'low') {
      inspRiskBadge.classList.add('badge-low');
      inspRiskBadge.textContent = 'Riesgo Bajo';
    } else if (data.riskLevel === 'mod') {
      inspRiskBadge.classList.add('badge-warning');
      inspRiskBadge.textContent = 'Riesgo Moderado';
    } else {
      inspRiskBadge.classList.add('badge-critical');
      inspRiskBadge.textContent = 'Riesgo Crítico';
    }
  }

  if (inspHumedad) inspHumedad.textContent = `${data.dew} h`;
  if (inspTemp) inspTemp.textContent = `${data.temp} °C`;
  if (inspNdre) inspNdre.textContent = `${data.ndre}`;
  if (inspSpatialLag) inspSpatialLag.textContent = data.spatialLag;
  if (inspPrescriptionText) inspPrescriptionText.textContent = data.text;
}

function toggleTimePlay() {
  const btnPlayText = document.getElementById('playBtnText');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const horizonSlider = document.getElementById('timeHorizonRange');

  if (isPlayingTime) {
    clearInterval(playInterval);
    isPlayingTime = false;
    if (btnPlayText) btnPlayText.textContent = 'Simular Tiempo';
    if (playIcon) playIcon.style.display = 'inline-block';
    if (pauseIcon) pauseIcon.style.display = 'none';
  } else {
    isPlayingTime = true;
    if (btnPlayText) btnPlayText.textContent = 'Pausar';
    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'inline-block';

    playInterval = setInterval(() => {
      currentHorizonStep = (currentHorizonStep + 1) % 4;
      if (horizonSlider) horizonSlider.value = currentHorizonStep;
      updateSimulatorState();
    }, 1800);
  }
}

/* ==========================================================================
   4. ROI & Sustainability Calculator
   ========================================================================== */
function initRoiCalculator() {
  const haInput = document.getElementById('hectareasInput');
  const costInput = document.getElementById('costoFungicidaInput');
  const haDisplay = document.getElementById('haValueDisplay');
  const costDisplay = document.getElementById('costValueDisplay');

  const ahorroUsdEl = document.getElementById('roiAhorroUSD');
  const rindeProtegidoEl = document.getElementById('roiRindeProtegido');
  const quimicosEl = document.getElementById('roiQuimicosAhorro');
  const dieselEl = document.getElementById('roiDieselAhorro');

  function calculate() {
    const ha = parseInt(haInput?.value || 2500, 10);
    const cost = parseInt(costInput?.value || 32, 10);

    if (haDisplay) haDisplay.textContent = `${ha.toLocaleString('es-AR')} ha`;
    if (costDisplay) costDisplay.textContent = `$${cost} USD/ha`;

    // Formulas:
    // Evita en promedio 0.82 aplicaciones a ciegas en zonas sin alerta espacial
    const ahorroUsd = Math.round(ha * 0.82 * cost);
    // Rinde protegido: 0.45 Tn de soja preservada de la defoliación prematura por ha en riesgo
    const rindeTn = Math.round(ha * 0.45);
    // Litros de formulado químico evitados: ~0.8 litros/ha
    const litrosQuimicos = Math.round(ha * 0.8);
    // Diésel y huella de carbono evitada: ~5.9 kg CO2 por hectárea pulverizada
    const co2Tn = ((ha * 0.82 * 5.9) / 1000).toFixed(1);

    if (ahorroUsdEl) ahorroUsdEl.textContent = `$${ahorroUsd.toLocaleString('es-AR')} USD`;
    if (rindeProtegidoEl) rindeProtegidoEl.textContent = `${rindeTn.toLocaleString('es-AR')} Tn`;
    if (quimicosEl) quimicosEl.textContent = `${litrosQuimicos.toLocaleString('es-AR')} L`;
    if (dieselEl) dieselEl.textContent = `${co2Tn} Tn CO₂`;
  }

  haInput?.addEventListener('input', calculate);
  costInput?.addEventListener('input', calculate);

  calculate();
}

/* ==========================================================================
   5. Interactive Tabs (Methodology & Validation)
   ========================================================================== */
function initTabs() {
  // Methodology tabs
  const methTabBtns = document.querySelectorAll('.tab-btn');
  const methTabContents = document.querySelectorAll('.tab-content');

  methTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      methTabBtns.forEach(b => b.classList.remove('active'));
      methTabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`tab-${targetTab}`)?.classList.add('active');
    });
  });

  // Validation Ground Truth tabs
  const valTabBtns = document.querySelectorAll('.dd-tab');
  const valTabContents = document.querySelectorAll('.deepdive-content');

  valTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-dd');
      valTabBtns.forEach(b => b.classList.remove('active'));
      valTabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`dd-${target}`)?.classList.add('active');
    });
  });
}

/* ==========================================================================
   6. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   7. Form Validation & Submission
   ========================================================================== */
function initFormValidation() {
  const form = document.getElementById('pilotForm');
  const successModal = document.getElementById('formSuccessModal');
  const resetBtn = document.getElementById('btnResetForm');
  const submitBtn = document.getElementById('btnSubmitForm');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Nombre
    const nombre = document.getElementById('nombre');
    const nombreGroup = nombre?.closest('.form-group');
    if (!nombre?.value.trim()) {
      nombreGroup?.classList.add('has-error');
      nombre?.classList.add('is-invalid');
      isValid = false;
    } else {
      nombreGroup?.classList.remove('has-error');
      nombre?.classList.remove('is-invalid');
    }

    // Validate Email
    const email = document.getElementById('email');
    const emailGroup = email?.closest('.form-group');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.value.trim() || !emailPattern.test(email.value)) {
      emailGroup?.classList.add('has-error');
      email?.classList.add('is-invalid');
      isValid = false;
    } else {
      emailGroup?.classList.remove('has-error');
      email?.classList.remove('is-invalid');
    }

    // Validate Rol
    const rol = document.getElementById('rol');
    const rolGroup = rol?.closest('.form-group');
    if (!rol?.value) {
      rolGroup?.classList.add('has-error');
      rol?.classList.add('is-invalid');
      isValid = false;
    } else {
      rolGroup?.classList.remove('has-error');
      rol?.classList.remove('is-invalid');
    }

    // Validate Ubicacion
    const ubicacion = document.getElementById('ubicacion');
    const ubicacionGroup = ubicacion?.closest('.form-group');
    if (!ubicacion?.value.trim()) {
      ubicacionGroup?.classList.add('has-error');
      ubicacion?.classList.add('is-invalid');
      isValid = false;
    } else {
      ubicacionGroup?.classList.remove('has-error');
      ubicacion?.classList.remove('is-invalid');
    }

    // Validate Consentimiento
    const consentimiento = document.getElementById('consentimiento');
    const consentContainer = consentimiento?.closest('.form-checkbox');
    if (!consentimiento?.checked) {
      consentContainer?.classList.add('has-error');
      isValid = false;
    } else {
      consentContainer?.classList.remove('has-error');
    }

    if (isValid) {
      // Simulate submission loading
      if (submitBtn) {
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Procesando datos espaciales...';

        setTimeout(() => {
          form.style.display = 'none';
          if (successModal) successModal.style.display = 'flex';
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }, 1000);
      }
    }
  });

  resetBtn?.addEventListener('click', () => {
    form?.reset();
    if (form) form.style.display = 'flex';
    if (successModal) successModal.style.display = 'none';
  });
}

/* ==========================================================================
   8. Scroll Spy (Active nav-link tracking)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}
