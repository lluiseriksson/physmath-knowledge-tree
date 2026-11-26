// First visit: when in doubt, English (owner's order, 2026-11-26). Spanish only if the browser asks for it before English
// and the time zone belongs to a Spanish-speaking country. A saved choice always wins (callers check it first).
const SPANISH_ZONES = /^(Europe\/Madrid|Africa\/(Ceuta|Malabo)|Atlantic\/Canary|America\/(Argentina\/.+|Buenos_Aires|Cordoba|Catamarca|Jujuy|Mendoza|Mexico_City|Cancun|Merida|Monterrey|Matamoros|Chihuahua|Ciudad_Juarez|Ojinaga|Mazatlan|Bahia_Banderas|Hermosillo|Tijuana|Guatemala|El_Salvador|Tegucigalpa|Managua|Costa_Rica|Panama|Havana|Santo_Domingo|Puerto_Rico|Bogota|Caracas|Guayaquil|Lima|La_Paz|Santiago|Punta_Arenas|Asuncion|Montevideo)|Pacific\/(Galapagos|Easter))$/;

export function pickFirstVisit(languages, zone) {
  const first = languages.map((value) => String(value ?? '').toLowerCase().split('-')[0]).find((value) => value === 'es' || value === 'en');
  return first === 'es' && SPANISH_ZONES.test(zone) ? 'es' : 'en';
}

export function firstVisitLanguage() {
  try {
    const list = navigator.languages?.length ? navigator.languages : [navigator.language];
    return pickFirstVisit(list, Intl.DateTimeFormat().resolvedOptions().timeZone ?? '');
  } catch {
    return 'en';
  }
}
