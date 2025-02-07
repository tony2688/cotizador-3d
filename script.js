// Configuración inicial
const CONFIG = {
    ENERGIA_KWH: 113.83,
    POTENCIA: 0.35,
    DEFAULTS: {
        MANTENIMIENTO: 3000,
        DEPRECIACION: 600,
        MARGEN_ERROR: 15
    }
};

// Sanitizar y validar entradas
const sanitizeInput = (value, defaultValue = 0) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || parsed < 0 ? defaultValue : parsed;
};

// Escapar caracteres HTML
const escapeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

// Formatear moneda
const formatARS = (value) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    }).format(value);
};

// Calcular costos
const calcularCosto = () => {
    try {
        // Obtener y sanitizar valores
        const inputs = {
            precioPlastico: sanitizeInput(document.getElementById('precioPlastico').value, 7000),
            cantidadPlastico: sanitizeInput(document.getElementById('cantidadPlastico').value, 150),
            tiempoImpresion: sanitizeInput(document.getElementById('tiempoImpresion').value, 4),
            mantenimiento: sanitizeInput(document.getElementById('mantenimiento').value, CONFIG.DEFAULTS.MANTENIMIENTO),
            depreciacion: sanitizeInput(document.getElementById('depreciacion').value, CONFIG.DEFAULTS.DEPRECIACION),
            margenError: sanitizeInput(document.getElementById('margenError').value, CONFIG.DEFAULTS.MARGEN_ERROR)
        };

        // Realizar cálculos
        const calculations = {
            costoPlastico: (inputs.precioPlastico / 1000) * inputs.cantidadPlastico,
            costoEnergia: CONFIG.POTENCIA * inputs.tiempoImpresion * CONFIG.ENERGIA_KWH,
            costoDepreciacion: inputs.depreciacion * inputs.tiempoImpresion,
            subtotal: 0,
            ajusteError: 0,
            total: 0
        };

        calculations.subtotal = calculations.costoPlastico + calculations.costoEnergia + 
                               inputs.mantenimiento + calculations.costoDepreciacion;
                               
        calculations.ajusteError = (calculations.subtotal * inputs.margenError) / 100;
        calculations.total = calculations.subtotal + calculations.ajusteError;

        // Generar HTML seguro
        const resultadoHTML = `
            <div class="resultado-item">
                <span>📦 Material plástico:</span>
                <span>${escapeHTML(formatARS(calculations.costoPlastico))}</span>
            </div>
            <div class="resultado-item">
                <span>⚡ Consumo energético:</span>
                <span>${escapeHTML(formatARS(calculations.costoEnergia))}</span>
            </div>
            <div class="resultado-item">
                <span>🔧 Mantenimiento:</span>
                <span>${escapeHTML(formatARS(inputs.mantenimiento))}</span>
            </div>
            <div class="resultado-item">
                <span>📉 Depreciación:</span>
                <span>${escapeHTML(formatARS(calculations.costoDepreciacion))}</span>
            </div>
            <div class="resultado-item">
                <span>🎯 Subtotal:</span>
                <span>${escapeHTML(formatARS(calculations.subtotal))}</span>
            </div>
            <div class="resultado-item">
                <span>⚠️ Margen de seguridad (${inputs.margenError}%):</span>
                <span>+${escapeHTML(formatARS(calculations.ajusteError))}</span>
            </div>
            <div class="resultado-item total">
                <span>💰 TOTAL ESTIMADO:</span>
                <span>${escapeHTML(formatARS(calculations.total))}</span>
            </div>
        `;

        document.getElementById('detalleCosto').innerHTML = resultadoHTML;

    } catch (error) {
        document.getElementById('detalleCosto').innerHTML = `
            <div class="error-message">
                ❌ Error en el cálculo: ${escapeHTML(error.message)}
            </div>
        `;
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Inicialización de valores por defecto
    document.getElementById('mantenimiento').value = CONFIG.DEFAULTS.MANTENIMIENTO;
    document.getElementById('depreciacion').value = CONFIG.DEFAULTS.DEPRECIACION;
    document.getElementById('margenError').value = CONFIG.DEFAULTS.MARGEN_ERROR;
    
    // Asignar el event listener al botón
    document.getElementById('btnCalcular').addEventListener('click', calcularCosto);
});
