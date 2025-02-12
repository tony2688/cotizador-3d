const CONFIG = {
    DEFAULTS: {
        MANTENIMIENTO: 3000, // Costo de mantenimiento por defecto
        DEPRECIACION: 600, // Costo de depreciación por hora de uso
        MARGEN_ERROR: 15, // Margen de error en porcentaje
        CONSUMO_IMPRESORA: 0.35, // Consumo eléctrico en kilovatios
        COSTO_KWH: 0.15, // Costo por kilovatio-hora
        GANANCIA: 20 // Porcentaje de ganancia deseado
    }
};

// Función para limpiar errores visuales
const limpiarErrores = () => {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
};

// Función para mostrar mensajes de error en los campos correspondientes
const mostrarError = (campoId, mensaje) => {
    const campo = document.getElementById(campoId);
    if (!campo) return;

    campo.classList.add('input-error');
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = mensaje;
    campo.parentNode.insertBefore(error, campo.nextSibling);
};

// Validaciones de entrada para evitar valores incorrectos
const validarConsumoImpresora = (valor) => {
    if (valor <= 0) {
        mostrarError('consumoImpresora', 'El consumo debe ser mayor a 0');
        return false;
    }
    return true;
};

const validarCostoKwh = (valor) => {
    if (valor <= 0) {
        mostrarError('costoKwh', 'El costo de la energía debe ser mayor a 0');
        return false;
    }
    return true;
};

const validarGanancia = (valor) => {
    if (valor < 0) {
        mostrarError('ganancia', 'La ganancia no puede ser negativa');
        return false;
    }
    return true;
};

// Función principal para calcular costos
const calcularCosto = () => {
    limpiarErrores(); // Elimina errores previos

    try {
        // Obtención de valores ingresados por el usuario
        const inputs = {
            precioPlastico: parseFloat(document.getElementById('precioPlastico').value) || 7000,
            cantidadPlastico: parseFloat(document.getElementById('cantidadPlastico').value) || 150,
            tiempoImpresion: parseFloat(document.getElementById('tiempoImpresion').value) || 4,
            mantenimiento: parseFloat(document.getElementById('mantenimiento').value) || CONFIG.DEFAULTS.MANTENIMIENTO,
            depreciacion: parseFloat(document.getElementById('depreciacion').value) || CONFIG.DEFAULTS.DEPRECIACION,
            margenError: parseFloat(document.getElementById('margenError').value) || CONFIG.DEFAULTS.MARGEN_ERROR,
            consumoImpresora: parseFloat(document.getElementById('consumoImpresora').value) || CONFIG.DEFAULTS.CONSUMO_IMPRESORA,
            costoKwh: parseFloat(document.getElementById('costoKwh').value) || CONFIG.DEFAULTS.COSTO_KWH,
            ganancia: parseFloat(document.getElementById('ganancia').value) || CONFIG.DEFAULTS.GANANCIA
        };

        // Validaciones de datos ingresados
        let esValido = true;
        if (!validarConsumoImpresora(inputs.consumoImpresora)) esValido = false;
        if (!validarCostoKwh(inputs.costoKwh)) esValido = false;
        if (!validarGanancia(inputs.ganancia)) esValido = false;
        if (!esValido) return;

        // Cálculo del costo de energía
        const costoEnergia = inputs.consumoImpresora * inputs.tiempoImpresion * inputs.costoKwh;

        // Cálculo de costos finales
        const calculations = {
            costoPlastico: (inputs.precioPlastico / 1000) * inputs.cantidadPlastico, // Costo del material plástico
            costoDepreciacion: inputs.depreciacion * inputs.tiempoImpresion, // Costo por depreciación del equipo
            subtotal: 0,
            ajusteError: 0,
            total: 0,
            gananciaCalculada: 0,
            precioFinal: 0
        };

        // Sumar todos los costos
        calculations.subtotal = calculations.costoPlastico + costoEnergia + inputs.mantenimiento + calculations.costoDepreciacion;
        calculations.ajusteError = (calculations.subtotal * inputs.margenError) / 100;
        calculations.total = calculations.subtotal + calculations.ajusteError;
        calculations.gananciaCalculada = (calculations.total * inputs.ganancia) / 100;
        calculations.precioFinal = calculations.total + calculations.gananciaCalculada;

        // Mostrar los resultados en pantalla
        document.getElementById('detalleCosto').innerHTML = `
            <div class="resultado-item">
                <span>📦 Material plástico:</span>
                <span>${calculations.costoPlastico.toFixed(2)}</span>
            </div>
            <div class="resultado-item">
                <span>⚡ Consumo energético:</span>
                <span>${costoEnergia.toFixed(2)}</span>
            </div>
            <div class="resultado-item">
                <span>🔧 Mantenimiento:</span>
                <span>${inputs.mantenimiento.toFixed(2)}</span>
            </div>
            <div class="resultado-item">
                <span>📉 Depreciación:</span>
                <span>${calculations.costoDepreciacion.toFixed(2)}</span>
            </div>
            <div class="resultado-item">
                <span>🎯 Subtotal:</span>
                <span>${calculations.subtotal.toFixed(2)}</span>
            </div>
            <div class="resultado-item">
                <span>⚠️ Margen de seguridad (${inputs.margenError}%):</span>
                <span>+${calculations.ajusteError.toFixed(2)}</span>
            </div>
            <div class="resultado-item">
                <span>💰 Ganancia (${inputs.ganancia}%):</span>
                <span>+${calculations.gananciaCalculada.toFixed(2)}</span>
            </div>
            <div class="resultado-item total">
                <span>💵 PRECIO FINAL:</span>
                <span>${calculations.precioFinal.toFixed(2)}</span>
            </div>
        `;

    } catch (error) {
        console.error("Error durante el cálculo:", error);
        mostrarError('detalleCosto', "Se produjo un error inesperado: " + error.message);
    }
};

// Inicialización de eventos y valores por defecto
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnCalcular').addEventListener('click', calcularCosto);
    
    document.getElementById('consumoImpresora').value = CONFIG.DEFAULTS.CONSUMO_IMPRESORA;
    document.getElementById('costoKwh').value = CONFIG.DEFAULTS.COSTO_KWH;
    document.getElementById('mantenimiento').value = CONFIG.DEFAULTS.MANTENIMIENTO;
    document.getElementById('depreciacion').value = CONFIG.DEFAULTS.DEPRECIACION;
    document.getElementById('margenError').value = CONFIG.DEFAULTS.MARGEN_ERROR;
    document.getElementById('ganancia').value = CONFIG.DEFAULTS.GANANCIA;
});
