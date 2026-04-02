// Jamendo API Service - Música legal y gratuita (Creative Commons)
// Registrarse en: https://devportal.jamendo.com para obtener clientId propio

const JAMENDO_BASE = 'https://api.jamendo.com/v3.0';
const CLIENT_ID = 'b6747d04'; // Reemplazar con Client ID propio de Jamendo

export type JamendoTrack = {
  id: string;
  name: string;
  artist_name: string;
  album_name: string;
  duration: number;
  audio: string;         // URL de stream
  audiodownload: string; // URL de descarga
  image: string;         // Portada del álbum
  shareurl: string;
  tags: string;
  license_ccurl: string;
};

export type SearchParams = {
  name?: string;
  artist?: string;
  tags?: string;
  limit?: number;
  offset?: number;
  order?: string;
  datebetween?: string;
  lang?: string;
};

export async function searchTracks(params: SearchParams): Promise<JamendoTrack[]> {
  try {
    const queryParams = new URLSearchParams({
      client_id: CLIENT_ID,
      format: 'json',
      limit: String(params.limit || 20),
      offset: String(params.offset || 0),
      order: params.order || 'popularity_total',
      audioformat: 'mp32',
      include: 'musicinfo',
      groupby: 'artist_id',
    });

    if (params.name) queryParams.append('name', params.name);
    if (params.artist) queryParams.append('artist_name', params.artist);
    if (params.tags) queryParams.append('tags', params.tags);
    if (params.lang) queryParams.append('lang', params.lang);

    if (params.datebetween) {
      const decade = parseInt(params.datebetween);
      queryParams.append('datebetween', `${decade}-01-01_${decade + 9}-12-31`);
    }

    const url = `${JAMENDO_BASE}/tracks?${queryParams.toString()}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && Array.isArray(data.results)) {
      return data.results as JamendoTrack[];
    }
    return [];
  } catch (error) {
    console.error('Error buscando en Jamendo:', error);
    return [];
  }
}

export async function getPopularTracks(limit = 30): Promise<JamendoTrack[]> {
  return searchTracks({ limit, order: 'popularity_total' });
}

export async function searchByText(query: string, limit = 20): Promise<JamendoTrack[]> {
  try {
    const queryParams = new URLSearchParams({
      client_id: CLIENT_ID,
      format: 'json',
      limit: String(limit),
      search: query,
      audioformat: 'mp32',
      order: 'relevance',
    });

    const url = `${JAMENDO_BASE}/tracks?${queryParams.toString()}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error en búsqueda de texto:', error);
    return [];
  }
}

export function formatDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}
