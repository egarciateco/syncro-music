export type FilterCategory = {
  id: string;
  label: string;
  icon: string;
  color: string;
  options: FilterOption[];
};

export type FilterOption = {
  id: string;
  label: string;
  value: string;
  paramKey: string;
};

export const FILTER_CATEGORIES: FilterCategory[] = [
  {
    id: 'genre',
    label: 'Por Género',
    icon: 'musical-notes',
    color: '#8B5CF6',
    options: [
      { id: 'rock', label: 'Rock', value: 'rock', paramKey: 'tags' },
      { id: 'pop', label: 'Pop', value: 'pop', paramKey: 'tags' },
      { id: 'jazz', label: 'Jazz', value: 'jazz', paramKey: 'tags' },
      { id: 'classical', label: 'Clásica', value: 'classical', paramKey: 'tags' },
      { id: 'electronic', label: 'Electrónica', value: 'electronic', paramKey: 'tags' },
      { id: 'hiphop', label: 'Hip Hop', value: 'hiphop', paramKey: 'tags' },
      { id: 'reggae', label: 'Reggae', value: 'reggae', paramKey: 'tags' },
      { id: 'metal', label: 'Metal', value: 'metal', paramKey: 'tags' },
      { id: 'indie', label: 'Indie', value: 'indie', paramKey: 'tags' },
      { id: 'folk', label: 'Folk', value: 'folk', paramKey: 'tags' },
      { id: 'blues', label: 'Blues', value: 'blues', paramKey: 'tags' },
      { id: 'latin', label: 'Latino', value: 'latin', paramKey: 'tags' },
      { id: 'cumbia', label: 'Cumbia', value: 'cumbia', paramKey: 'tags' },
      { id: 'tango', label: 'Tango', value: 'tango', paramKey: 'tags' },
      { id: 'bossanova', label: 'Bossa Nova', value: 'bossanova', paramKey: 'tags' },
    ],
  },
  {
    id: 'type',
    label: 'Por Tipo',
    icon: 'layers',
    color: '#EC4899',
    options: [
      { id: 'single', label: 'Single', value: 'single', paramKey: 'type' },
      { id: 'album', label: 'Álbum', value: 'album', paramKey: 'type' },
      { id: 'live', label: 'En Vivo', value: 'live', paramKey: 'tags' },
      { id: 'acoustic', label: 'Acústico', value: 'acoustic', paramKey: 'tags' },
      { id: 'instrumental', label: 'Instrumental', value: 'instrumental', paramKey: 'tags' },
      { id: 'remix', label: 'Remix', value: 'remix', paramKey: 'tags' },
      { id: 'cover', label: 'Cover', value: 'cover', paramKey: 'tags' },
    ],
  },
  {
    id: 'name',
    label: 'Por Nombre',
    icon: 'search',
    color: '#06B6D4',
    options: [],
    // Se manejará con input de texto libre
  },
  {
    id: 'decade',
    label: 'Por Década',
    icon: 'time',
    color: '#F59E0B',
    options: [
      { id: '2020s', label: '2020s', value: '2020', paramKey: 'datebetween' },
      { id: '2010s', label: '2010s', value: '2010', paramKey: 'datebetween' },
      { id: '2000s', label: '2000s', value: '2000', paramKey: 'datebetween' },
      { id: '1990s', label: '1990s', value: '1990', paramKey: 'datebetween' },
      { id: '1980s', label: '1980s', value: '1980', paramKey: 'datebetween' },
      { id: '1970s', label: '1970s', value: '1970', paramKey: 'datebetween' },
    ],
  },
  {
    id: 'national',
    label: 'Nacional',
    icon: 'flag',
    color: '#10B981',
    options: [
      { id: 'argentina', label: 'Argentina', value: 'argentina', paramKey: 'tags' },
      { id: 'rock_arg', label: 'Rock Argentino', value: 'rock argentina', paramKey: 'tags' },
      { id: 'tango_arg', label: 'Tango', value: 'tango', paramKey: 'tags' },
      { id: 'folklore', label: 'Folklore', value: 'folklore', paramKey: 'tags' },
      { id: 'cumbia_arg', label: 'Cumbia', value: 'cumbia', paramKey: 'tags' },
    ],
  },
  {
    id: 'foreign',
    label: 'Extranjero',
    icon: 'globe',
    color: '#6366F1',
    options: [
      { id: 'usa', label: 'USA', value: 'usa', paramKey: 'tags' },
      { id: 'uk', label: 'Reino Unido', value: 'uk', paramKey: 'tags' },
      { id: 'brazil', label: 'Brasil', value: 'brazil', paramKey: 'tags' },
      { id: 'france', label: 'Francia', value: 'france', paramKey: 'tags' },
      { id: 'spain', label: 'España', value: 'spain', paramKey: 'tags' },
      { id: 'mexico', label: 'México', value: 'mexico', paramKey: 'tags' },
      { id: 'japan', label: 'Japón', value: 'japan', paramKey: 'tags' },
      { id: 'korea', label: 'Korea', value: 'kpop', paramKey: 'tags' },
    ],
  },
  {
    id: 'artist',
    label: 'Por Artista',
    icon: 'person',
    color: '#F43F5E',
    options: [],
    // Se manejará con input de texto libre
  },
  {
    id: 'mood',
    label: 'Estado de Ánimo',
    icon: 'happy',
    color: '#A855F7',
    options: [
      { id: 'happy', label: '😄 Feliz', value: 'happy', paramKey: 'tags' },
      { id: 'sad', label: '😢 Triste', value: 'sad', paramKey: 'tags' },
      { id: 'energetic', label: '⚡ Energético', value: 'energetic', paramKey: 'tags' },
      { id: 'relaxing', label: '😌 Relajante', value: 'relaxing', paramKey: 'tags' },
      { id: 'romantic', label: '❤️ Romántico', value: 'romantic', paramKey: 'tags' },
      { id: 'motivational', label: '💪 Motivacional', value: 'motivational', paramKey: 'tags' },
      { id: 'chill', label: '😎 Chill', value: 'chill', paramKey: 'tags' },
      { id: 'melancholic', label: '🌧️ Melancólico', value: 'melancholic', paramKey: 'tags' },
      { id: 'epic', label: '🎆 Épico', value: 'epic', paramKey: 'tags' },
      { id: 'party', label: '🎉 Fiesta', value: 'party', paramKey: 'tags' },
    ],
  },
];
