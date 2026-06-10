// ==========================================
// VISTAS: FORMULARIO VS ÉXITO
// ==========================================
function showSuccessScreen() {
    formElement.classList.add('hidden-element');
    successScreen.classList.remove('hidden-element');
    document.querySelector('.w-full.h-2.bg-gray-100').classList.add('hidden-element');
    if (stepDisplay && stepDisplay.parentElement) {
        stepDisplay.parentElement.classList.add('hidden-element');
    }
}

function showFormScreen() {
    successScreen.classList.add('hidden-element');
    formElement.classList.remove('hidden-element');
    document.querySelector('.w-full.h-2.bg-gray-100').classList.remove('hidden-element');
    if (stepDisplay && stepDisplay.parentElement) {
        stepDisplay.parentElement.classList.remove('hidden-element');
    }
    updateUI();
}

document.getElementById('btn-new-property')?.addEventListener('click', () => {
    localStorage.removeItem(AUTOSAVE_KEY);
    window.location.reload();
});

// ==========================================
// RENDERIZADO Y NAVEGACIÓN DINÁMICA
// ==========================================
function updateActiveSteps() {
    const offerAloj = document.getElementById('offerAloj')?.checked ?? true;
    const offerPasadia = document.getElementById('offerPasadia')?.checked ?? false;
    const offerEventos = document.getElementById('offerEventos')?.checked ?? false;

    activeSteps = [];
    // Pasos fijos iniciales
    activeSteps.push(document.getElementById('step-0'));
    activeSteps.push(document.getElementById('step-1'));

    // Alojamiento
    if (offerAloj) {
        activeSteps.push(document.getElementById('step-2'));
    }

    // Pasos de amenidades y servicios base
    activeSteps.push(document.getElementById('step-3'));
    activeSteps.push(document.getElementById('step-4'));
    activeSteps.push(document.getElementById('step-5'));
    activeSteps.push(document.getElementById('step-6'));

    // Pasadía
    if (offerPasadia) {
        activeSteps.push(document.getElementById('step-pasadia'));
    }

    // Eventos
    if (offerEventos) {
        activeSteps.push(document.getElementById('step-eventos'));
    }

    // Pasos finales
    activeSteps.push(document.getElementById('step-8'));
    activeSteps.push(document.getElementById('step-9'));
    activeSteps.push(document.getElementById('step-10'));
}

function updateUI() {
    // Ocultar todos los pasos en el DOM primero
    document.querySelectorAll('.step-container').forEach(step => {
        step.classList.remove('active');
    });

    // Recalcular pasos activos
    updateActiveSteps();

    // Asegurar que currentStep no se desborde si cambió la cantidad de pasos
    if (currentStep >= activeSteps.length) {
        currentStep = activeSteps.length - 1;
    }

    // Mostrar el paso activo actual
    const currentStepEl = activeSteps[currentStep];
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }

    // Actualizar barra de progreso y número de paso
    progressBar.style.width = `${(currentStep / (activeSteps.length - 1)) * 100}%`;
    
    // Actualizar visualizador de pasos
    if (stepDisplay) {
        stepDisplay.textContent = currentStep + 1;
    }
    if (totalStepsDisplay) {
        totalStepsDisplay.textContent = activeSteps.length;
    }

    if (currentStep === 0) {
        btnPrev.classList.add('hidden-element');
        navSpacer.classList.remove('hidden-element');
        btnNext.textContent = 'Comenzar';
    } else {
        btnPrev.classList.remove('hidden-element');
        navSpacer.classList.add('hidden-element');
        btnNext.textContent = 'Siguiente';
    }

    if (currentStep === activeSteps.length - 1) {
        btnNext.classList.add('hidden-element');
        btnSubmit.classList.remove('hidden-element');
    } else {
        btnNext.classList.remove('hidden-element');
        btnSubmit.classList.add('hidden-element');
    }
}

btnNext.addEventListener('click', () => {
    if (typeof validateCurrentStep === 'function' && validateCurrentStep()) {
        if (currentStep < activeSteps.length - 1) {
            currentStep++;
            updateUI();
            if (typeof autoSave === 'function') autoSave();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } else {
        const currentStepEl = activeSteps[currentStep];
        const firstError = currentStepEl ? currentStepEl.querySelector('.input-error') : null;
        if(firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
});

btnPrev.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        updateUI();
        if (typeof autoSave === 'function') autoSave();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ==========================================
// LÓGICA DE HABITACIONES DINÁMICAS
// ==========================================
function syncRoomCards() {
    const count = parseInt(roomCountInput.value) || 0;
    const currentCards = roomsContainer.children.length;

    if (count > currentCards) {
        for (let i = currentCards + 1; i <= count; i++) {
            const card = document.createElement('div');
            card.className = "bg-gray-100/50 border border-gray-200 rounded-3xl p-5 space-y-4 room-card";
            card.dataset.room = i;
            card.innerHTML = `
                <h3 class="font-semibold text-gray-900 border-b border-gray-200 pb-2">Habitación ${i}</h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-xs font-medium text-gray-500">Camas Dobles</label>
                        <input type="number" inputmode="numeric" min="0" class="w-full mt-1 h-12 px-4 bg-white border border-gray-200 rounded-xl text-gray-950 focus:ring-2 focus:ring-gray-950 outline-none bed-double" placeholder="0">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-500">Camas Sencillas</label>
                        <input type="number" inputmode="numeric" min="0" class="w-full mt-1 h-12 px-4 bg-white border border-gray-200 rounded-xl text-gray-950 focus:ring-2 focus:ring-gray-950 outline-none bed-single" placeholder="0">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-500">Literas (Camarotes)</label>
                        <input type="number" inputmode="numeric" min="0" class="w-full mt-1 h-12 px-4 bg-white border border-gray-200 rounded-xl text-gray-950 focus:ring-2 focus:ring-gray-950 outline-none bed-bunk" placeholder="0">
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    <label class="flex items-center gap-3 bg-white border border-gray-200 px-4 py-3 rounded-xl text-sm shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" class="w-5 h-5 accent-gray-950 room-bath"> Baño privado</label>
                    <label class="flex items-center gap-3 bg-white border border-gray-200 px-4 py-3 rounded-xl text-sm shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" class="w-5 h-5 accent-gray-950 room-ac"> Aire acond.</label>
                    <label class="flex items-center gap-3 bg-white border border-gray-200 px-4 py-3 rounded-xl text-sm shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"><input type="checkbox" class="w-5 h-5 accent-gray-950 room-tv"> Televisor</label>
                </div>
            `;
            roomsContainer.appendChild(card);
        }
    } else if (count < currentCards) {
        for (let i = currentCards; i > count; i--) {
            roomsContainer.removeChild(roomsContainer.lastChild);
        }
    }
}

document.getElementById('btn-plus-rooms')?.addEventListener('click', () => {
    let val = parseInt(roomCountInput.value);
    if(val < 20) { roomCountInput.value = val + 1; syncRoomCards(); if (typeof autoSave === 'function') autoSave(); }
});
document.getElementById('btn-minus-rooms')?.addEventListener('click', () => {
    let val = parseInt(roomCountInput.value);
    if(val > 0) { roomCountInput.value = val - 1; syncRoomCards(); if (typeof autoSave === 'function') autoSave(); }
});

// ==========================================
// LÓGICAS CONDICIONALES Y DINÁMICAS
// ==========================================
if(hasPoolSelect) {
    hasPoolSelect.addEventListener('change', (e) => {
        if (e.target.value === 'si') {
            poolDetails.classList.remove('hidden-element');
        } else {
            poolDetails.classList.add('hidden-element');
        }
    });
}
if(poolHasRestrictions) {
    poolHasRestrictions.addEventListener('change', (e) => {
        if (e.target.value === 'si') {
            poolRestrictionDesc.classList.remove('hidden-element');
        } else {
            poolRestrictionDesc.classList.add('hidden-element');
        }
    });
}

function checkMusicConditions() {
    if (guestSoundAllowed && musicAllowed) {
        (guestSoundAllowed.value === 'con_condiciones' || musicAllowed.value === 'con_horario') ? musicConditionDesc.classList.remove('hidden-element') : musicConditionDesc.classList.add('hidden-element');
    }
}
if(guestSoundAllowed) guestSoundAllowed.addEventListener('change', checkMusicConditions);
if(musicAllowed) musicAllowed.addEventListener('change', checkMusicConditions);

// LÓGICAS CONDICIONALES DE PRECIOS Y DEPOSITOS DESCENTRALIZADOS
const setupServicePricingAndDeposit = (service) => {
    const pricingTypeSelect = document.getElementById(`${service}PricingType`);
    const fixedPricingContainer = document.getElementById(`fixed-${service}-pricing-container`);
    const variablePricingContainer = document.getElementById(`variable-${service}-pricing-container`);
    const variableRangesContainer = document.getElementById(`variable-${service}-ranges-container`);

    if (pricingTypeSelect) {
        pricingTypeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'fijo') {
                fixedPricingContainer.classList.remove('hidden-element');
                variablePricingContainer.classList.add('hidden-element');
            } else if (e.target.value === 'variable') {
                variablePricingContainer.classList.remove('hidden-element');
                fixedPricingContainer.classList.add('hidden-element');
                if (variableRangesContainer.children.length === 0) {
                    addRangeCard(service);
                }
            } else {
                fixedPricingContainer.classList.add('hidden-element');
                variablePricingContainer.classList.add('hidden-element');
            }
        });
    }

    const depositTypeSelect = document.getElementById(`${service}DepositType`);
    const depositPercentContainer = document.getElementById(`${service}DepositPercentContainer`);
    const depositFixedContainer = document.getElementById(`${service}DepositFixedContainer`);

    if (depositTypeSelect) {
        depositTypeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'porcentaje') {
                depositPercentContainer.classList.remove('hidden-element');
                depositFixedContainer.classList.add('hidden-element');
                const fixedInput = document.getElementById(`${service}DepositFixed`);
                if (fixedInput) {
                    fixedInput.value = '';
                    delete fixedInput.dataset.rawValue;
                }
            } else if (e.target.value === 'fijo') {
                depositFixedContainer.classList.remove('hidden-element');
                depositPercentContainer.classList.add('hidden-element');
                const percentInput = document.getElementById(`${service}DepositPercent`);
                if (percentInput) percentInput.value = '';
            } else {
                depositPercentContainer.classList.add('hidden-element');
                depositFixedContainer.classList.add('hidden-element');
            }
        });
    }
};

// Inicializar listeners para cada servicio
['aloj', 'pasadia', 'eventos'].forEach(setupServicePricingAndDeposit);

function addRangeCard(service, rangeData = null) {
    const container = document.getElementById(`variable-${service}-ranges-container`);
    if (!container) return;

    const card = document.createElement('div');
    card.className = "bg-white border border-gray-200 rounded-3xl p-4 space-y-3 relative range-card";
    
    let serviceLabel = "";
    if (service === 'aloj') serviceLabel = "Alojamiento (Por noche)";
    else if (service === 'pasadia') serviceLabel = "Pasadía (Por día)";
    else if (service === 'eventos') serviceLabel = "Eventos (Por evento)";

    card.innerHTML = `
        <div class="flex justify-between items-center border-b border-gray-100 pb-2">
            <span class="font-medium text-xs text-gray-500 uppercase tracking-wider">Rango de personas</span>
            <button type="button" class="text-red-500 hover:text-red-700 font-semibold text-xs btn-delete-range">Eliminar Rango</button>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-xs font-medium text-gray-500">Mínimo de personas</label>
                <input type="number" min="1" inputmode="numeric" class="w-full mt-1 h-10 px-3 bg-white border border-gray-200 rounded-xl text-gray-950 focus:ring-2 focus:ring-gray-950 outline-none range-min" placeholder="1" value="${rangeData ? rangeData.min : '1'}">
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-500">Máximo de personas</label>
                <input type="number" min="1" inputmode="numeric" class="w-full mt-1 h-10 px-3 bg-white border border-gray-200 rounded-xl text-gray-950 focus:ring-2 focus:ring-gray-950 outline-none range-max" placeholder="4" value="${rangeData ? rangeData.max : ''}">
            </div>
        </div>
        
        <div class="bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
            <span class="block font-medium text-xs text-gray-700 mb-2">${serviceLabel}</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label class="block text-[10px] text-gray-400 uppercase">Entre semana</label>
                    <input type="text" inputmode="numeric" class="format-currency w-full mt-0.5 h-9 px-3 bg-white border border-gray-200 rounded-lg text-gray-950 text-sm focus:ring-2 focus:ring-gray-950 outline-none range-weekday" placeholder="$ 0" value="${rangeData ? rangeData.weekday : ''}" data-raw-value="${rangeData ? rangeData.weekdayRaw : ''}">
                </div>
                <div>
                    <label class="block text-[10px] text-gray-400 uppercase">Fin de semana / Festivos</label>
                    <input type="text" inputmode="numeric" class="format-currency w-full mt-0.5 h-9 px-3 bg-white border border-gray-200 rounded-lg text-gray-950 text-sm focus:ring-2 focus:ring-gray-950 outline-none range-weekend" placeholder="$ 0" value="${rangeData ? rangeData.weekend : ''}" data-raw-value="${rangeData ? rangeData.weekendRaw : ''}">
                </div>
            </div>
        </div>
    `;
    
    card.querySelector('.btn-delete-range').addEventListener('click', () => {
        container.removeChild(card);
        if (typeof autoSave === 'function') autoSave();
    });
    
    container.appendChild(card);
}

// Vincular listeners a los botones de agregar rango de cada servicio
document.getElementById('btn-add-aloj-range')?.addEventListener('click', () => {
    addRangeCard('aloj');
    if (typeof autoSave === 'function') autoSave();
});
document.getElementById('btn-add-pasadia-range')?.addEventListener('click', () => {
    addRangeCard('pasadia');
    if (typeof autoSave === 'function') autoSave();
});
document.getElementById('btn-add-eventos-range')?.addEventListener('click', () => {
    addRangeCard('eventos');
    if (typeof autoSave === 'function') autoSave();
});

// Listener para los checkboxes de servicios
document.querySelectorAll('.service-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
        updateUI();
        if (typeof autoSave === 'function') autoSave();
    });
});

// Listener para la capacidad del parqueadero condicional
if (parkingCheckbox && parkingCapacityContainer) {
    parkingCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            parkingCapacityContainer.classList.remove('hidden-element');
        } else {
            parkingCapacityContainer.classList.add('hidden-element');
            const capInput = document.getElementById('parkingCapacity');
            if (capInput) capInput.value = '';
        }
    });
}

// LÓGICA DE AMENIDADES PERSONALIZADAS
if(btnAddCustomAmenity) {
    btnAddCustomAmenity.addEventListener('click', () => {
        const val = customAmenityInput.value.trim();
        if(val !== '') {
            addCustomAmenityCheckbox(val, true);
            customAmenityInput.value = '';
            if (typeof autoSave === 'function') autoSave();
        }
    });
    customAmenityInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            btnAddCustomAmenity.click();
        }
    });
}

function addCustomAmenityCheckbox(value, checked = false) {
    const existing = Array.from(document.querySelectorAll('.amenity-checkbox')).some(cb => cb.value.toLowerCase() === value.toLowerCase());
    if(existing) return;

    const label = document.createElement('label');
    label.className = 'flex items-center gap-3 bg-white border border-gray-200 px-4 py-3 rounded-2xl text-sm shadow-sm cursor-pointer hover:bg-gray-50 transition-colors';
    label.innerHTML = `<input type="checkbox" value="${value}" ${checked ? 'checked' : ''} class="amenity-checkbox custom-amenity-checkbox w-5 h-5 accent-gray-950"> ${value}`;
    
    customAmenitiesContainer.appendChild(label);
}

// LÓGICA DE PASADÍA INCLUYE CUSTOM
if(btnAddCustomPasadia) {
    btnAddCustomPasadia.addEventListener('click', () => {
        const val = customPasadiaInput.value.trim();
        if(val !== '') {
            addCustomPasadiaCheckbox(val, true);
            customPasadiaInput.value = '';
            if (typeof autoSave === 'function') autoSave();
        }
    });
    customPasadiaInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            btnAddCustomPasadia.click();
        }
    });
}

function addCustomPasadiaCheckbox(value, checked = false) {
    const existing = Array.from(document.querySelectorAll('.pasadia-include-checkbox')).some(cb => cb.value.toLowerCase() === value.toLowerCase());
    if(existing) return;

    const label = document.createElement('label');
    label.className = 'flex items-center gap-3 bg-white border border-gray-200 px-4 py-3 rounded-2xl text-sm shadow-sm cursor-pointer hover:bg-gray-50 transition-colors';
    label.innerHTML = `<input type="checkbox" value="${value}" ${checked ? 'checked' : ''} class="pasadia-include-checkbox custom-pasadia-checkbox w-5 h-5 accent-gray-950"> ${value}`;
    
    customPasadiaContainer.appendChild(label);
}

// LÓGICA DEL PASO 8 (Políticas y Servicios)
if(cancellationPolicy) {
    cancellationPolicy.addEventListener('change', (e) => {
        if(e.target.value === 'flexible') {
            cancellationDaysContainer.classList.remove('hidden-element');
        } else {
            cancellationDaysContainer.classList.add('hidden-element');
            const capInput = document.getElementById('cancellationDays');
            if (capInput) capInput.value = '';
        }
    });
}

if(damageDeposit) {
    damageDeposit.addEventListener('change', (e) => {
        if(e.target.value === 'si') {
            depositAmountContainer.classList.remove('hidden-element');
        } else {
            depositAmountContainer.classList.add('hidden-element');
            const capInput = document.getElementById('damageDepositAmount');
            if (capInput) capInput.value = '';
        }
    });
}

if(hasExtraServices) {
    hasExtraServices.addEventListener('change', (e) => {
        if(e.target.value === 'si') {
            extraServicesContainer.classList.remove('hidden-element');
        } else {
            extraServicesContainer.classList.add('hidden-element');
            extraServicesArray = [];
            renderServices();
        }
    });
}

if(btnAddService) {
    btnAddService.addEventListener('click', () => {
        const val = serviceInput.value.trim();
        if(val !== '') {
            extraServicesArray.push(val);
            serviceInput.value = '';
            renderServices();
            if (typeof autoSave === 'function') autoSave();
        }
    });
}

function renderServices() {
    if (!servicesList) return;
    servicesList.innerHTML = '';
    extraServicesArray.forEach((srv, index) => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center bg-white border border-gray-200 p-3 rounded-xl text-sm';
        li.innerHTML = `<span>${srv}</span> <button type="button" class="text-red-500 hover:text-red-700 font-bold px-2 py-1" onclick="removeService(${index})">X</button>`;
        servicesList.appendChild(li);
    });
}

window.removeService = function(index) {
    extraServicesArray.splice(index, 1);
    renderServices();
    if (typeof autoSave === 'function') autoSave();
}

// ==========================================
// LÓGICA DE OTRAS PLATAFORMAS (Paso 9)
// ==========================================
if (hasOtherCalendarsSwitch) {
    hasOtherCalendarsSwitch.addEventListener('change', (e) => {
        if (e.target.checked) {
            otherCalendarsContainer.classList.remove('hidden-element');
            if (otherCalendarsList.children.length === 0) {
                addOtherCalendarRow();
            }
        } else {
            otherCalendarsContainer.classList.add('hidden-element');
            otherCalendarsList.innerHTML = '';
        }
        if (typeof autoSave === 'function') autoSave();
    });
}

if (btnAddOtherCalendar) {
    btnAddOtherCalendar.addEventListener('click', () => {
        addOtherCalendarRow();
        if (typeof autoSave === 'function') autoSave();
    });
}

function addOtherCalendarRow(platformName = '', platformUrl = '') {
    if (!otherCalendarsList) return;

    const row = document.createElement('div');
    row.className = "bg-white border border-gray-200 rounded-xl p-3 space-y-2 relative custom-calendar-link-card";
    row.innerHTML = `
        <div class="flex justify-between items-center">
            <span class="text-xs font-semibold text-gray-400 uppercase">Plataforma adicional</span>
            <button type="button" class="text-red-500 hover:text-red-700 font-semibold text-xs btn-delete-custom-calendar">Eliminar</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
                <label class="block text-xs text-gray-500 font-medium">Nombre de la plataforma</label>
                <input type="text" class="w-full mt-1 h-10 px-3 bg-white border border-gray-200 rounded-lg text-gray-950 text-sm focus:ring-2 focus:ring-gray-950 outline-none custom-cal-platform" placeholder="Ej: VRBO, Expedia, Agoda" value="${platformName}">
            </div>
            <div>
                <label class="block text-xs text-gray-500 font-medium">Enlace de sincronización / Reservas</label>
                <input type="url" class="w-full mt-1 h-10 px-3 bg-white border border-gray-200 rounded-lg text-gray-950 text-sm focus:ring-2 focus:ring-gray-950 outline-none custom-cal-url" placeholder="https://..." value="${platformUrl}">
            </div>
        </div>
    `;

    // Event listener to delete the row
    row.querySelector('.btn-delete-custom-calendar').addEventListener('click', () => {
        otherCalendarsList.removeChild(row);
        if (typeof autoSave === 'function') autoSave();
    });

    // Event listeners to trigger autosave on input changes in the new inputs
    row.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            if (typeof autoSave === 'function') autoSave();
        });
    });

    otherCalendarsList.appendChild(row);
}
