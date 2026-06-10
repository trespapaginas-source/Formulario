// 1. ESTADOS GLOBALES
let activeSteps = [];
let currentStep = 0;
let extraServicesArray = [];
let formStatus = 'draft';
const AUTOSAVE_KEY = 'premiumForm_AutoSave_Draft';

// 2. REFERENCIAS A ELEMENTOS DEL DOM
const formElement = document.getElementById('premium-form');
const successScreen = document.getElementById('success-screen');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const btnSubmit = document.getElementById('btn-submit');
const progressBar = document.getElementById('progress-bar');
const stepDisplay = document.getElementById('current-step-display');
const totalStepsDisplay = document.getElementById('total-steps-display');
const navSpacer = document.getElementById('nav-spacer');

// Habitaciones
const roomCountInput = document.getElementById('roomCount');
const roomsContainer = document.getElementById('rooms-container');

// Piscina y Sonido
const hasPoolSelect = document.getElementById('hasPool');
const poolDetails = document.getElementById('pool-details');
const poolHasRestrictions = document.getElementById('poolHasRestrictions');
const poolRestrictionDesc = document.getElementById('pool-restriction-desc');

const guestSoundAllowed = document.getElementById('guestSoundAllowed');
const musicAllowed = document.getElementById('musicAllowed');
const musicConditionDesc = document.getElementById('music-condition-desc');

// Parqueadero
const parkingCheckbox = document.getElementById('amenity-parking');
const parkingCapacityContainer = document.getElementById('parking-capacity-container');

// Amenidades personalizadas
const btnAddCustomAmenity = document.getElementById('btnAddCustomAmenity');
const customAmenityInput = document.getElementById('customAmenityInput');
const customAmenitiesContainer = document.getElementById('custom-amenities-container');

// Pasadía incluye personalizado
const btnAddCustomPasadia = document.getElementById('btnAddCustomPasadia');
const customPasadiaInput = document.getElementById('customPasadiaInput');
const customPasadiaContainer = document.getElementById('custom-pasadia-container');

// Políticas y Servicios Extra
const cancellationPolicy = document.getElementById('cancellationPolicy');
const cancellationDaysContainer = document.getElementById('cancellationDaysContainer');

const damageDeposit = document.getElementById('damageDeposit');
const depositAmountContainer = document.getElementById('depositAmountContainer');

const hasExtraServices = document.getElementById('hasExtraServices');
const extraServicesContainer = document.getElementById('extraServicesContainer');

const btnAddService = document.getElementById('btnAddService');
const serviceInput = document.getElementById('serviceInput');
const servicesList = document.getElementById('servicesList');

// Otras plataformas y sincronización de calendario
const hasOtherCalendarsSwitch = document.getElementById('hasOtherCalendars');
const otherCalendarsContainer = document.getElementById('other-calendars-container');
const otherCalendarsList = document.getElementById('other-calendars-list');
const btnAddOtherCalendar = document.getElementById('btn-add-other-calendar');
