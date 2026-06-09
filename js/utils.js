// 1. OPTIMIZACIONES UX MÓVIL (Elementos Estáticos)
document.querySelectorAll('.format-currency, input[type="number"]').forEach(input => {
    input.setAttribute('inputmode', 'numeric');
});

// 2. FORMATEO DE MONEDA EN TIEMPO REAL
function formatCurrency(value) {
    let onlyNumbers = value.replace(/\D/g, '');
    if (onlyNumbers === '') return '';
    return '$ ' + new Intl.NumberFormat('es-CO').format(parseInt(onlyNumbers));
}

document.body.addEventListener('input', function(e) {
    if(e.target.classList.contains('format-currency')) {
        e.target.dataset.rawValue = e.target.value.replace(/\D/g, ''); 
        e.target.value = formatCurrency(e.target.value);
        if (typeof autoSave === 'function') {
            autoSave();
        }
    }
});
