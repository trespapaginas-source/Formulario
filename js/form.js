// ==========================================
// SISTEMA DE AUTOGUARDADO
// ==========================================
function autoSave() {
    const roomsData = Array.from(document.querySelectorAll('.room-card')).map(card => ({
        room: card.dataset.room,
        doubleBeds: card.querySelector('.bed-double').value,
        singleBeds: card.querySelector('.bed-single').value,
        bunkBeds: card.querySelector('.bed-bunk').value,
        hasBathroom: card.querySelector('.room-bath').checked,
        hasAC: card.querySelector('.room-ac').checked,
        hasTV: card.querySelector('.room-tv').checked
    }));

    const getRangesData = (service) => {
        const container = document.getElementById(`variable-${service}-ranges-container`);
        if (!container) return [];
        return Array.from(container.querySelectorAll('.range-card')).map(card => ({
            min: card.querySelector('.range-min').value,
            max: card.querySelector('.range-max').value,
            weekday: card.querySelector('.range-weekday')?.value || '',
            weekdayRaw: card.querySelector('.range-weekday')?.dataset.rawValue || '',
            weekend: card.querySelector('.range-weekend')?.value || '',
            weekendRaw: card.querySelector('.range-weekend')?.dataset.rawValue || ''
        }));
    };

    const customAmenitiesData = Array.from(document.querySelectorAll('.custom-amenity-checkbox')).map(cb => cb.value);
    const customPasadiaData = Array.from(document.querySelectorAll('.custom-pasadia-checkbox')).map(cb => cb.value);
    const servicesOffered = Array.from(document.querySelectorAll('.service-checkbox:checked')).map(cb => cb.value);
    const pasadiaIncludes = Array.from(document.querySelectorAll('.pasadia-include-checkbox:checked')).map(cb => cb.value);

    const dataToSave = {
        step: currentStep,
        status: formStatus,
        inputs: {},
        amenities: Array.from(document.querySelectorAll('.amenity-checkbox:checked')).map(cb => cb.value),
        customAmenities: customAmenitiesData,
        servicesOffered: servicesOffered,
        pasadiaIncludes: pasadiaIncludes,
        customPasadia: customPasadiaData,
        services: extraServicesArray,
        rooms: roomsData,
        alojRanges: getRangesData('aloj'),
        pasadiaRanges: getRangesData('pasadia'),
        eventosRanges: getRangesData('eventos')
    };

    document.querySelectorAll('input:not([type="checkbox"]), select, textarea').forEach(el => {
        if(el.id && !el.closest('.room-card') && !el.closest('.range-card')) {
            dataToSave.inputs[el.id] = el.value;
            if(el.dataset.rawValue !== undefined) dataToSave.inputs[el.id + '_raw'] = el.dataset.rawValue;
        }
    });

    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(dataToSave));
}

function autoLoad() {
    const savedDraft = localStorage.getItem(AUTOSAVE_KEY);
    if(!savedDraft) return false;

    try {
        const data = JSON.parse(savedDraft);
        
        // Reconstruir amenidades personalizadas primero
        if(data.customAmenities) {
            const customContainer = document.getElementById('custom-amenities-container');
            if(customContainer) customContainer.innerHTML = '';
            data.customAmenities.forEach(val => {
                if (typeof addCustomAmenityCheckbox === 'function') {
                    addCustomAmenityCheckbox(val, false);
                }
            });
        }

        // Reconstruir pasadía personalizadas
        if(data.customPasadia) {
            const customPasContainer = document.getElementById('custom-pasadia-container');
            if(customPasContainer) customPasContainer.innerHTML = '';
            data.customPasadia.forEach(val => {
                if (typeof addCustomPasadiaCheckbox === 'function') {
                    addCustomPasadiaCheckbox(val, false);
                }
            });
        }

        // Restaurar checkboxes de servicios para que activeSteps se calcule bien
        if(data.servicesOffered) {
            document.querySelectorAll('.service-checkbox').forEach(cb => {
                cb.checked = data.servicesOffered.includes(cb.value);
            });
        }

        // Actualizar activeSteps antes de cargar rangos
        if (typeof updateActiveSteps === 'function') {
            updateActiveSteps();
        }

        // Reconstruir rangos de Alojamiento
        if(data.alojRanges && data.alojRanges.length > 0) {
            const alojContainer = document.getElementById('variable-aloj-ranges-container');
            if(alojContainer) {
                alojContainer.innerHTML = '';
                data.alojRanges.forEach(rData => {
                    if (typeof addRangeCard === 'function') {
                        addRangeCard('aloj', rData);
                    }
                });
            }
        }

        // Reconstruir rangos de Pasadía
        if(data.pasadiaRanges && data.pasadiaRanges.length > 0) {
            const pasadiaContainer = document.getElementById('variable-pasadia-ranges-container');
            if(pasadiaContainer) {
                pasadiaContainer.innerHTML = '';
                data.pasadiaRanges.forEach(rData => {
                    if (typeof addRangeCard === 'function') {
                        addRangeCard('pasadia', rData);
                    }
                });
            }
        }

        // Reconstruir rangos de Eventos
        if(data.eventosRanges && data.eventosRanges.length > 0) {
            const eventosContainer = document.getElementById('variable-eventos-ranges-container');
            if(eventosContainer) {
                eventosContainer.innerHTML = '';
                data.eventosRanges.forEach(rData => {
                    if (typeof addRangeCard === 'function') {
                        addRangeCard('eventos', rData);
                    }
                });
            }
        }

        for(const id in data.inputs) {
            if(!id.endsWith('_raw')) {
                const el = document.getElementById(id);
                if(el) {
                    el.value = data.inputs[id];
                    if(data.inputs[id + '_raw'] !== undefined) el.dataset.rawValue = data.inputs[id + '_raw'];
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }

        document.querySelectorAll('.amenity-checkbox').forEach(cb => {
            cb.checked = data.amenities.includes(cb.value);
            if (cb.id === 'amenity-parking') {
                cb.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        document.querySelectorAll('.pasadia-include-checkbox').forEach(cb => {
            cb.checked = data.pasadiaIncludes ? data.pasadiaIncludes.includes(cb.value) : false;
        });

        if(data.services) {
            extraServicesArray = data.services;
            if (typeof renderServices === 'function') {
                renderServices();
            }
        }

        if(data.rooms && data.rooms.length > 0) {
            const roomCountEl = document.getElementById('roomCount');
            if (roomCountEl) {
                roomCountEl.value = data.rooms.length;
                if (typeof syncRoomCards === 'function') {
                    syncRoomCards();
                }
            }

            const cards = document.querySelectorAll('.room-card');
            data.rooms.forEach((rData, index) => {
                if(cards[index]) {
                    cards[index].querySelector('.bed-double').value = rData.doubleBeds || '';
                    cards[index].querySelector('.bed-single').value = rData.singleBeds || '';
                    cards[index].querySelector('.bed-bunk').value = rData.bunkBeds || '';
                    cards[index].querySelector('.room-bath').checked = rData.hasBathroom || false;
                    cards[index].querySelector('.room-ac').checked = rData.hasAC || false;
                    cards[index].querySelector('.room-tv').checked = rData.hasTV || false;
                }
            });
        }

        currentStep = data.step || 0;
        formStatus = data.status || 'draft';

        return true;
    } catch(e) {
        console.error("Error cargando guardado", e);
        return false;
    }
}

if(formElement) {
    formElement.addEventListener('input', autoSave);
    formElement.addEventListener('change', autoSave);
}

// ==========================================
// RECOLECCIÓN Y WEBHOOK
// ==========================================
formElement?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (typeof validateCurrentStep === 'function' && !validateCurrentStep()) { 
        const currentStepEl = activeSteps[currentStep];
        const firstError = currentStepEl ? currentStepEl.querySelector('.input-error') : null;
        if(firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return; 
    }

    if(serviceInput && serviceInput.value.trim() !== '') {
        extraServicesArray.push(serviceInput.value.trim());
        serviceInput.value = '';
        if (typeof renderServices === 'function') renderServices();
    }

    const amenities = Array.from(document.querySelectorAll('.amenity-checkbox:checked')).map(cb => cb.value);

    const roomsData = Array.from(document.querySelectorAll('.room-card')).map(card => ({
        room: card.dataset.room,
        doubleBeds: card.querySelector('.bed-double').value || 0,
        singleBeds: card.querySelector('.bed-single').value || 0,
        bunkBeds: card.querySelector('.bed-bunk').value || 0,
        hasBathroom: card.querySelector('.room-bath').checked,
        hasAC: card.querySelector('.room-ac').checked,
        hasTV: card.querySelector('.room-tv').checked
    }));

    // Traductor de habitaciones para Notion
    const roomsTextFormatted = roomsData.map(r => {
        let extras = [];
        if(r.hasBathroom) extras.push("Baño");
        if(r.hasAC) extras.push("Aire Acond.");
        if(r.hasTV) extras.push("TV");
        
        let extrasText = extras.length > 0 ? extras.join(", ") : "Sin extras";
        return `Hab. ${r.room}: ${r.doubleBeds} Doble(s) | ${r.singleBeds} Sencilla(s) | ${r.bunkBeds} Litera(s) -> [${extrasText}]`;
    }).join("\n");

    const extraServicesText = extraServicesArray.length > 0 
        ? "• " + extraServicesArray.join("\n• ") 
        : "Sin servicios extra";

    // Recolección de datos de precios descentralizados
    const offerAloj = document.getElementById('offerAloj')?.checked ?? true;
    const offerPasadia = document.getElementById('offerPasadia')?.checked ?? false;
    const offerEventos = document.getElementById('offerEventos')?.checked ?? false;

    const alojPricingType = document.getElementById('alojPricingType')?.value || '';
    const pasadiaPricingType = document.getElementById('pasadiaPricingType')?.value || '';
    const eventosPricingType = document.getElementById('eventosPricingType')?.value || '';

    let alojPriceText = "No ofrece";
    let pasadiaPriceText = "No ofrece";
    let eventosPriceText = "No ofrece";
    let minPriceRaw = "0";

    let alojPricingSummary = "";
    let pasadiaPricingSummary = "";
    let eventosPricingSummary = "";

    // 1. Procesar Alojamiento
    if (offerAloj) {
        if (alojPricingType === 'fijo') {
            const fixedAlojWd = document.getElementById('fixedAlojWeekday')?.value || '';
            const fixedAlojWdRaw = document.getElementById('fixedAlojWeekday')?.dataset.rawValue || '';
            const fixedAlojWe = document.getElementById('fixedAlojWeekend')?.value || '';
            alojPriceText = `Alojamiento:\n- Lunes a Jueves: ${fixedAlojWd}\n- Viernes a Domingo y Festivos: ${fixedAlojWe}`;
            alojPricingSummary = alojPriceText;
            minPriceRaw = fixedAlojWdRaw || '0';
        } else if (alojPricingType === 'variable') {
            alojPriceText = "Variable por rangos (Alojamiento)";
            const alojCards = document.getElementById('variable-aloj-ranges-container')?.querySelectorAll('.range-card') || [];
            const alojRangesList = Array.from(alojCards).map((card, idx) => {
                const min = card.querySelector('.range-min')?.value || '';
                const max = card.querySelector('.range-max')?.value || '';
                const wd = card.querySelector('.range-weekday')?.value || '';
                const wdRaw = card.querySelector('.range-weekday')?.dataset.rawValue || '';
                const we = card.querySelector('.range-weekend')?.value || '';
                if (idx === 0) minPriceRaw = wdRaw || '0';
                return `  - Rango ${min}-${max} personas: ${wd} (Semana) / ${we} (Finde/Festivo)`;
            });
            alojPricingSummary = `Alojamiento Variable:\n${alojRangesList.join('\n')}`;
        }
    }

    // 2. Procesar Pasadía
    if (offerPasadia) {
        if (pasadiaPricingType === 'fijo') {
            const fixedPasWd = document.getElementById('fixedPasadiaWeekday')?.value || '';
            const fixedPasWdRaw = document.getElementById('fixedPasadiaWeekday')?.dataset.rawValue || '';
            const fixedPasWe = document.getElementById('fixedPasadiaWeekend')?.value || '';
            pasadiaPriceText = `Pasadía:\n- Lunes a Jueves: ${fixedPasWd}\n- Viernes a Domingo y Festivos: ${fixedPasWe}`;
            pasadiaPricingSummary = pasadiaPriceText;
            if (!offerAloj) minPriceRaw = fixedPasWdRaw || '0';
        } else if (pasadiaPricingType === 'variable') {
            pasadiaPriceText = "Variable por rangos (Pasadía)";
            const pasadiaCards = document.getElementById('variable-pasadia-ranges-container')?.querySelectorAll('.range-card') || [];
            const pasadiaRangesList = Array.from(pasadiaCards).map((card, idx) => {
                const min = card.querySelector('.range-min')?.value || '';
                const max = card.querySelector('.range-max')?.value || '';
                const wd = card.querySelector('.range-weekday')?.value || '';
                const wdRaw = card.querySelector('.range-weekday')?.dataset.rawValue || '';
                const we = card.querySelector('.range-weekend')?.value || '';
                if (!offerAloj && idx === 0) minPriceRaw = wdRaw || '0';
                return `  - Rango ${min}-${max} personas: ${wd} (Semana) / ${we} (Finde/Festivo)`;
            });
            pasadiaPricingSummary = `Pasadía Variable:\n${pasadiaRangesList.join('\n')}`;
        }
    }

    // 3. Procesar Eventos
    if (offerEventos) {
        if (eventosPricingType === 'fijo') {
            const fixedEveWd = document.getElementById('fixedEventosWeekday')?.value || '';
            const fixedEveWdRaw = document.getElementById('fixedEventosWeekday')?.dataset.rawValue || '';
            const fixedEveWe = document.getElementById('fixedEventosWeekend')?.value || '';
            eventosPriceText = `Eventos:\n- Lunes a Jueves: ${fixedEveWd}\n- Viernes a Domingo y Festivos: ${fixedEveWe}`;
            eventosPricingSummary = eventosPriceText;
            if (!offerAloj && !offerPasadia) minPriceRaw = fixedEveWdRaw || '0';
        } else if (eventosPricingType === 'variable') {
            eventosPriceText = "Variable por rangos (Eventos)";
            const eventosCards = document.getElementById('variable-eventos-ranges-container')?.querySelectorAll('.range-card') || [];
            const eventosRangesList = Array.from(eventosCards).map((card, idx) => {
                const min = card.querySelector('.range-min')?.value || '';
                const max = card.querySelector('.range-max')?.value || '';
                const wd = card.querySelector('.range-weekday')?.value || '';
                const wdRaw = card.querySelector('.range-weekday')?.dataset.rawValue || '';
                const we = card.querySelector('.range-weekend')?.value || '';
                if (!offerAloj && !offerPasadia && idx === 0) minPriceRaw = wdRaw || '0';
                return `  - Rango ${min}-${max} personas: ${wd} (Semana) / ${we} (Finde/Festivo)`;
            });
            eventosPricingSummary = `Eventos Variable:\n${eventosRangesList.join('\n')}`;
        }
    }

    // Consolidar todos los precios en un solo texto descriptivo
    const pricingSummaryText = [alojPricingSummary, pasadiaPricingSummary, eventosPricingSummary].filter(t => t !== "").join("\n\n");

    const isAnyVariable = (offerAloj && alojPricingType === 'variable') ||
                          (offerPasadia && pasadiaPricingType === 'variable') ||
                          (offerEventos && eventosPricingType === 'variable');
    const priceMode = isAnyVariable ? 'Variable' : 'Fijo';
    const pricingType = isAnyVariable ? 'variable' : 'fijo';

    const primaryService = offerAloj ? 'aloj' : (offerPasadia ? 'pasadia' : 'eventos');
    const depositTypeVal = document.getElementById(`${primaryService}DepositType`)?.value || '';
    const depositPercentVal = document.getElementById(`${primaryService}DepositPercent`)?.value || '';
    const depositFixedVal = document.getElementById(`${primaryService}DepositFixed`)?.dataset.rawValue || '';

    const pasadiaIncludes = Array.from(document.querySelectorAll('.pasadia-include-checkbox:checked')).map(cb => cb.value);
    const pasadiaIncludesText = pasadiaIncludes.length > 0 ? pasadiaIncludes.join(", ") : "No especificado";

    const servicesOffered = Array.from(document.querySelectorAll('.service-checkbox:checked')).map(cb => cb.value);
    const servicesOfferedText = servicesOffered.length > 0 ? servicesOffered.join(", ") : "Alojamiento";

    // Super Objeto Final (UNIFICADO)
    const formData = {
        propName: document.getElementById('propName')?.value || '',
        propType: document.getElementById('propType')?.value || '',
        propZone: document.getElementById('propZone')?.value || '',
        occupancyMode: document.getElementById('occupancyMode')?.value || '',
        
        roomsTotal: document.getElementById('roomCount')?.value || 0,
        roomsDetail: roomsTextFormatted,
        amenities: amenities,
        
        hasPool: document.getElementById('hasPool')?.value || '',
        poolDimensions: document.getElementById('poolDimensions')?.value || '',
        poolHours: document.getElementById('poolHours')?.value || '',
        poolHasRestrictions: document.getElementById('poolHasRestrictions')?.value || '',
        poolRestrictionsText: document.getElementById('poolRestrictionsText')?.value || '',
        
        hasSoundSystem: document.getElementById('hasSoundSystem')?.value || '',
        guestSoundAllowed: document.getElementById('guestSoundAllowed')?.value || '',
        musicAllowed: document.getElementById('musicAllowed')?.value || '',
        musicConditionText: document.getElementById('musicConditionText')?.value || '',
        
        hasPets: document.getElementById('hasPets')?.value || '',
        flexibility: document.getElementById('flexibility')?.value || '',
        singleGroup: document.getElementById('singleGroup')?.value || '',
        
        maxCapacity: document.getElementById('maxCapacity')?.value || '',
        minPrice: minPriceRaw || '0',
        priceMode: priceMode,
        lowSeason: alojPriceText || 'No ofrece',
        midSeason: pasadiaPriceText || 'No ofrece',
        highSeason: isAnyVariable ? pricingSummaryText : (eventosPriceText || 'No ofrece'),
        extraPerson: pricingSummaryText,
        pricingType: pricingType,
        fixedAlojWeekday: document.getElementById('fixedAlojWeekday')?.dataset.rawValue || '',
        fixedAlojWeekend: document.getElementById('fixedAlojWeekend')?.dataset.rawValue || '',
        fixedPasadiaWeekday: document.getElementById('fixedPasadiaWeekday')?.dataset.rawValue || '',
        fixedPasadiaWeekend: document.getElementById('fixedPasadiaWeekend')?.dataset.rawValue || '',
        fixedEventosWeekday: document.getElementById('fixedEventosWeekday')?.dataset.rawValue || '',
        fixedEventosWeekend: document.getElementById('fixedEventosWeekend')?.dataset.rawValue || '',
        pricingRangesDetail: pricingSummaryText,
        
        servicesOffered: servicesOfferedText,
        parkingCapacity: document.getElementById('parkingCapacity')?.value || '',
        maxCapacityPasadia: document.getElementById('maxCapacityPasadia')?.value || '',
        pasadiaIncludes: pasadiaIncludesText,
        maxCapacityEventos: document.getElementById('maxCapacityEventos')?.value || '',
        eventTypes: document.getElementById('eventTypes')?.value || '',
        eventFurniture: document.getElementById('eventFurniture')?.value || '',
        eventRestrictions: document.getElementById('eventRestrictions')?.value || '',
        
        depositType: depositTypeVal,
        depositPercent: depositPercentVal,
        depositFixed: depositFixedVal,

        alojDepositType: document.getElementById('alojDepositType')?.value || '',
        alojDepositPercent: document.getElementById('alojDepositPercent')?.value || '',
        alojDepositFixed: document.getElementById('alojDepositFixed')?.dataset.rawValue || '',
        pasadiaDepositType: document.getElementById('pasadiaDepositType')?.value || '',
        pasadiaDepositPercent: document.getElementById('pasadiaDepositPercent')?.value || '',
        pasadiaDepositFixed: document.getElementById('pasadiaDepositFixed')?.dataset.rawValue || '',
        eventosDepositType: document.getElementById('eventosDepositType')?.value || '',
        eventosDepositPercent: document.getElementById('eventosDepositPercent')?.value || '',
        eventosDepositFixed: document.getElementById('eventosDepositFixed')?.dataset.rawValue || '',

        cancellationPolicy: document.getElementById('cancellationPolicy')?.value || '',
        cancellationDays: document.getElementById('cancellationDays')?.value || '',
        damageDeposit: document.getElementById('damageDeposit')?.value || '',
        damageDepositAmount: document.getElementById('damageDepositAmount')?.dataset.rawValue || '',
        penaltyPolicy: document.getElementById('penaltyPolicy')?.value || '',
        paymentGateway: document.getElementById('paymentGateway')?.value || '',
        extraServices: extraServicesText,
        
        linkAirbnb: document.getElementById('linkAirbnb')?.value || '',
        linkBooking: document.getElementById('linkBooking')?.value || '',
        linkMaps: document.getElementById('linkMaps')?.value || '',
        linkInstagram: document.getElementById('linkInstagram')?.value || '',
        linkFacebook: document.getElementById('linkFacebook')?.value || '',
        linkWhatsApp: document.getElementById('linkWhatsApp')?.value || '',
        linkEmail: document.getElementById('linkEmail')?.value || '',
        
        timestamp: new Date().toISOString()
    };

    const submitBtnText = document.getElementById('submit-text');
    btnSubmit.disabled = true;
    if (submitBtnText) submitBtnText.textContent = 'Enviando...';
    btnSubmit.classList.add('opacity-70', 'cursor-wait');

    const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbym1yWlpPhnoA96jDpbGOhfNH250zFrZquFwZrX2txJ93rJJ5YeVZrLK175eGO4FrgJeg/exec"; 

    try {
        if(WEBHOOK_URL === "") {
            console.log("DATOS FINALES:", formData);
            formStatus = 'submitted';
            autoSave();
            if (typeof showSuccessScreen === 'function') showSuccessScreen();
            
            if (submitBtnText) submitBtnText.textContent = 'Enviar información';
            btnSubmit.disabled = false;
            btnSubmit.classList.remove('opacity-70', 'cursor-wait');
            return;
        }

        const response = await fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
        if(response.ok) {
            formStatus = 'submitted';
            autoSave();
            if (typeof showSuccessScreen === 'function') showSuccessScreen();
            window.scrollTo(0,0);
        } else throw new Error("Rechazado");
    } catch (error) {
        console.error(error); 
        alert("Error de conexión al enviar.");
    } finally {
        if (submitBtnText) submitBtnText.textContent = 'Enviar información'; 
        btnSubmit.disabled = false;
        btnSubmit.classList.remove('opacity-70', 'cursor-wait');
    }
});

// ==========================================
// INICIALIZACIÓN
// ==========================================
const hasSavedData = autoLoad();

if (!hasSavedData) {
    if (typeof syncRoomCards === 'function') {
        syncRoomCards();
    }
    if (typeof updateUI === 'function') {
        updateUI();
    }
} else {
    if(formStatus === 'submitted') {
        if (typeof showSuccessScreen === 'function') {
            showSuccessScreen();
        }
    } else {
        if (typeof updateUI === 'function') {
            updateUI();
        }
    }
}
