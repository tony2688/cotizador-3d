// Configuración inicial de constantes para los cálculos
const CONFIG = {
    ENERGIA_KWH: 113.83, // Costo estimado de la energía por kWh
    POTENCIA: 0.35, // Potencia del equipo en kW
    DEFAULTS: {
        MANTENIMIENTO: 3000, // Costo de mantenimiento por defecto
        DEPRECIACION: 600, // Costo de depreciación por hora de uso
        MARGEN_ERROR: 15 // Margen de error para ajustar el costo total
    }
};

// Función para sanitizar y validar entradas de usuario
const sanitizeInput = (value, defaultValue = 0) => {
    const parsed = parseFloat(value); // Convertir el valor a número flotante
    return isNaN(parsed) || parsed < 0 ? defaultValue : parsed; // Retornar el valor o un valor por defecto si es inválido
};

// Función para escapar caracteres HTML y evitar inyección de código
const escapeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

// Función para formatear valores como moneda en pesos argentinos
const formatARS = (value) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    }).format(value);
};

// Función principal para calcular costos
const calcularCosto = () => {
    try {
        // Obtener y sanitizar los valores ingresados por el usuario
        const inputs = {
            precioPlastico: sanitizeInput(document.getElementById('precioPlastico').value, 7000),
            cantidadPlastico: sanitizeInput(document.getElementById('cantidadPlastico').value, 150),
            tiempoImpresion: sanitizeInput(document.getElementById('tiempoImpresion').value, 4),
            mantenimiento: sanitizeInput(document.getElementById('mantenimiento').value, CONFIG.DEFAULTS.MANTENIMIENTO),
            depreciacion: sanitizeInput(document.getElementById('depreciacion').value, CONFIG.DEFAULTS.DEPRECIACION),
            margenError: sanitizeInput(document.getElementById('margenError').value, CONFIG.DEFAULTS.MARGEN_ERROR)
        };

        // Cálculos de costos individuales
        const calculations = {
            costoPlastico: (inputs.precioPlastico / 1000) * inputs.cantidadPlastico, // Costo del material plástico
            costoEnergia: CONFIG.POTENCIA * inputs.tiempoImpresion * CONFIG.ENERGIA_KWH, // Costo del consumo energético
            costoDepreciacion: inputs.depreciacion * inputs.tiempoImpresion, // Costo de depreciación por el tiempo de uso
            subtotal: 0, // Inicialización del subtotal
            ajusteError: 0, // Inicialización del ajuste por margen de error
            total: 0 // Inicialización del total
        };

        // Cálculo del subtotal (suma de todos los costos)
        calculations.subtotal = calculations.costoPlastico + calculations.costoEnergia + 
                               inputs.mantenimiento + calculations.costoDepreciacion;
                                
        // Aplicación del margen de error
        calculations.ajusteError = (calculations.subtotal * inputs.margenError) / 100;
        calculations.total = calculations.subtotal + calculations.ajusteError;

        // Generar el resultado en HTML de manera segura
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

        // Insertar el resultado en el DOM
        document.getElementById('detalleCosto').innerHTML = resultadoHTML;

    } catch (error) {
        // Manejo de errores y mostrar mensaje de error en el DOM
        document.getElementById('detalleCosto').innerHTML = `
            <div class="error-message">
                ❌ Error en el cálculo: ${escapeHTML(error.message)}
            </div>
        `;
    }
};

// Inicialización del script cuando la página está lista
document.addEventListener('DOMContentLoaded', () => {
    // Establecer valores por defecto en los campos de entrada
    document.getElementById('mantenimiento').value = CONFIG.DEFAULTS.MANTENIMIENTO;
    document.getElementById('depreciacion').value = CONFIG.DEFAULTS.DEPRECIACION;
    document.getElementById('margenError').value = CONFIG.DEFAULTS.MARGEN_ERROR;
    
    // Asignar evento al botón de cálculo
    document.getElementById('btnCalcular').addEventListener('click', calcularCosto);
});
