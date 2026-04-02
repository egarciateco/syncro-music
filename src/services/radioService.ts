// Radio Browser API - Todas las radios disponibles del mundo
const RADIO_BASE = 'https://de1.api.radio-browser.info/json';

export type RadioStation = {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  favicon: string;
  country: string;
  countrycode: string;
  language: string;
  tags: string;
  votes: number;
  clickcount: number;
  bitrate: number;
  codec: string;
};

export async function getArgentineRadios(limit = 50): Promise<RadioStation[]> {
  try {
    const url = `${RADIO_BASE}/stations/bycountrycodeexact/AR?limit=${limit}&order=clickcount&reverse=true&hidebroken=true`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'SyncroMusic/1.0' }
    });
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error cargando radios argentinas:', error);
    return [];
  }
}

export async function getForeignRadios(limit = 50): Promise<RadioStation[]> {
  try {
    const url = `${RADIO_BASE}/stations?limit=${limit}&order=clickcount&reverse=true&hidebroken=true&has_extended_info=true`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'SyncroMusic/1.0' }
    });
    const data = await response.json();
    return (data || []).filter((s: RadioStation) => s.countrycode !== 'AR');
  } catch (error) {
    console.error('Error cargando radios extranjeras:', error);
    return [];
  }
}

export async function searchRadios(query: string): Promise<RadioStation[]> {
  try {
    const url = `${RADIO_BASE}/stations/search?name=${encodeURIComponent(query)}&limit=30&hidebroken=true`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'SyncroMusic/1.0' }
    });
    return await response.json() || [];
  } catch (error) {
    console.error('Error buscando radios:', error);
    return [];
  }
}

export async function getRadiosByGenre(genre: string): Promise<RadioStation[]> {
  try {
    const url = `${RADIO_BASE}/stations/bytag/${encodeURIComponent(genre)}?limit=30&order=votes&reverse=true&hidebroken=true`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'SyncroMusic/1.0' }
    });
    return await response.json() || [];
  } catch (error) {
    return [];
  }
}
