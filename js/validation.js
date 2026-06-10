function validateCurrentStep() {
    if (currentStep === 0) return true; 
    const currentStepEl = activeSteps[currentStep];
    if (!currentStepEl) return true;

    const requiredInputs = currentStepEl.querySelectorAll('[required]');
    let isValid = true;
    requiredInputs.forEach(input => {
        // Si el input está dentro de un elemento oculto, no lo validamos
        if (input.closest('.hidden-element')) return;

        if (!input.value.trim()) {
            input.classList.add('input-error');
            isValid = false;
        } else {
            input.classList.remove('input-error');
        }
    });

    // Validación específica para Alojamiento (step-2)
    if (currentStepEl.id === 'step-2') {
        const maxCapacity = document.getElementById('maxCapacity');
        if (maxCapacity && !maxCapacity.value.trim()) {
            maxCapacity.classList.add('input-error');
            isValid = false;
        }

        const pricingType = document.getElementById('alojPricingType').value;
        if (!pricingType) {
            document.getElementById('alojPricingType').classList.add('input-error');
            isValid = false;
        } else if (pricingType === 'fijo') {
            const fixedInputs = ['fixedAlojWeekday', 'fixedAlojWeekend'];
            fixedInputs.forEach(id => {
                const input = document.getElementById(id);
                if (input && !input.value.trim()) {
                    input.classList.add('input-error');
                    isValid = false;
                } else if (input) {
                    input.classList.remove('input-error');
                }
            });
        } else if (pricingType === 'variable') {
            const container = document.getElementById('variable-aloj-ranges-container');
            const cards = container.querySelectorAll('.range-card');
            if (cards.length === 0) {
                isValid = false;
                alert('Debes agregar al menos un rango de personas para alojamiento.');
            } else {
                cards.forEach(card => {
                    const minInput = card.querySelector('.range-min');
                    const maxInput = card.querySelector('.range-max');
                    const wkInput = card.querySelector('.range-weekday');
                    const weInput = card.querySelector('.range-weekend');

                    [minInput, maxInput, wkInput, weInput].forEach(input => {
                        if (input && !input.value.trim()) {
                            input.classList.add('input-error');
                            isValid = false;
                        } else if (input) {
                            input.classList.remove('input-error');
                        }
                    });
                });
            }
        }

        const depositType = document.getElementById('alojDepositType').value;
        if (depositType === 'porcentaje') {
            const depInput = document.getElementById('alojDepositPercent');
            if (depInput && !depInput.value.trim()) {
                depInput.classList.add('input-error');
                isValid = false;
            }
        } else if (depositType === 'fijo') {
            const depInput = document.getElementById('alojDepositFixed');
            if (depInput && !depInput.value.trim()) {
                depInput.classList.add('input-error');
                isValid = false;
            }
        }
    }

    // Validación específica para Pasadía (step-pasadia)
    if (currentStepEl.id === 'step-pasadia') {
        const maxCapPasadia = document.getElementById('maxCapacityPasadia');
        if (maxCapPasadia && !maxCapPasadia.value.trim()) {
            maxCapPasadia.classList.add('input-error');
            isValid = false;
        }

        const pricingType = document.getElementById('pasadiaPricingType').value;
        if (!pricingType) {
            document.getElementById('pasadiaPricingType').classList.add('input-error');
            isValid = false;
        } else if (pricingType === 'fijo') {
            const fixedInputs = ['fixedPasadiaWeekday', 'fixedPasadiaWeekend'];
            fixedInputs.forEach(id => {
                const input = document.getElementById(id);
                if (input && !input.value.trim()) {
                    input.classList.add('input-error');
                    isValid = false;
                } else if (input) {
                    input.classList.remove('input-error');
                }
            });
        } else if (pricingType === 'variable') {
            const container = document.getElementById('variable-pasadia-ranges-container');
            const cards = container.querySelectorAll('.range-card');
            if (cards.length === 0) {
                isValid = false;
                alert('Debes agregar al menos un rango de personas para pasadía.');
            } else {
                cards.forEach(card => {
                    const minInput = card.querySelector('.range-min');
                    const maxInput = card.querySelector('.range-max');
                    const wkInput = card.querySelector('.range-weekday');
                    const weInput = card.querySelector('.range-weekend');

                    [minInput, maxInput, wkInput, weInput].forEach(input => {
                        if (input && !input.value.trim()) {
                            input.classList.add('input-error');
                            isValid = false;
                        } else if (input) {
                            input.classList.remove('input-error');
                        }
                    });
                });
            }
        }

        const depositType = document.getElementById('pasadiaDepositType').value;
        if (depositType === 'porcentaje') {
            const depInput = document.getElementById('pasadiaDepositPercent');
            if (depInput && !depInput.value.trim()) {
                depInput.classList.add('input-error');
                isValid = false;
            }
        } else if (depositType === 'fijo') {
            const depInput = document.getElementById('pasadiaDepositFixed');
            if (depInput && !depInput.value.trim()) {
                depInput.classList.add('input-error');
                isValid = false;
            }
        }
    }

    // Validación específica para Eventos (step-eventos)
    if (currentStepEl.id === 'step-eventos') {
        const maxCapEventos = document.getElementById('maxCapacityEventos');
        if (maxCapEventos && !maxCapEventos.value.trim()) {
            maxCapEventos.classList.add('input-error');
            isValid = false;
        }

        const pricingType = document.getElementById('eventosPricingType').value;
        if (!pricingType) {
            document.getElementById('eventosPricingType').classList.add('input-error');
            isValid = false;
        } else if (pricingType === 'fijo') {
            const fixedInputs = ['fixedEventosWeekday', 'fixedEventosWeekend'];
            fixedInputs.forEach(id => {
                const input = document.getElementById(id);
                if (input && !input.value.trim()) {
                    input.classList.add('input-error');
                    isValid = false;
                } else if (input) {
                    input.classList.remove('input-error');
                }
            });
        } else if (pricingType === 'variable') {
            const container = document.getElementById('variable-eventos-ranges-container');
            const cards = container.querySelectorAll('.range-card');
            if (cards.length === 0) {
                isValid = false;
                alert('Debes agregar al menos un rango de personas para eventos.');
            } else {
                cards.forEach(card => {
                    const minInput = card.querySelector('.range-min');
                    const maxInput = card.querySelector('.range-max');
                    const wkInput = card.querySelector('.range-weekday');
                    const weInput = card.querySelector('.range-weekend');

                    [minInput, maxInput, wkInput, weInput].forEach(input => {
                        if (input && !input.value.trim()) {
                            input.classList.add('input-error');
                            isValid = false;
                        } else if (input) {
                            input.classList.remove('input-error');
                        }
                    });
                });
            }
        }

        const depositType = document.getElementById('eventosDepositType').value;
        if (depositType === 'porcentaje') {
            const depInput = document.getElementById('eventosDepositPercent');
            if (depInput && !depInput.value.trim()) {
                depInput.classList.add('input-error');
                isValid = false;
            }
        } else if (depositType === 'fijo') {
            const depInput = document.getElementById('eventosDepositFixed');
            if (depInput && !depInput.value.trim()) {
                depInput.classList.add('input-error');
                isValid = false;
            }
        }
    }

    // Validación específica para parqueadero si está activado
    if (currentStepEl.id === 'step-3') {
        const isParkingChecked = document.getElementById('amenity-parking')?.checked;
        if (isParkingChecked) {
            const parkingCap = document.getElementById('parkingCapacity');
            if (parkingCap && !parkingCap.value.trim()) {
                parkingCap.classList.add('input-error');
                isValid = false;
            }
        }
    }

    // Validación específica para Sincronización de disponibilidad (step-9)
    if (currentStepEl.id === 'step-9') {
        const switchChecked = document.getElementById('hasOtherCalendars')?.checked;
        if (switchChecked) {
            const cards = document.querySelectorAll('.custom-calendar-link-card');
            cards.forEach(card => {
                const platformInput = card.querySelector('.custom-cal-platform');
                const urlInput = card.querySelector('.custom-cal-url');
                
                [platformInput, urlInput].forEach(input => {
                    if (input && !input.value.trim()) {
                        input.classList.add('input-error');
                        isValid = false;
                    } else if (input) {
                        input.classList.remove('input-error');
                    }
                });
            });
        }
    }

    return isValid;
}

document.body.addEventListener('input', (e) => {
    if (e.target.classList.contains('input-error')) {
        e.target.classList.remove('input-error');
    }
});

document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
        if (input.hasAttribute('required') && input.value.trim() !== '') {
            input.classList.remove('input-error');
        }
    });
});
