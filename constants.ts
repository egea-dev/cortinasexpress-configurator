import { CurtainType } from './types';

export const MINIMUM_UNITS = 10;
export const MAX_HEIGHT = 270;
export const HIDE_PRICE_THRESHOLD = 100;

export const CURTAIN_TYPES: CurtainType[] = [
  { id: 'visillo', label: 'Visillo', pricePerM2: 25, description: 'Tejido ligero que deja pasar la luz pero otorga privacidad.' },
  { id: 'oscurante', label: 'Oscurante', pricePerM2: 35, description: 'Bloquea gran parte de la luz, ideal para dormitorios.' },
  { id: 'opacante', label: 'Opacante', pricePerM2: 45, description: 'Bloqueo total de luz (Blackout). Máxima oscuridad.' },
  { id: 'todos', label: 'Todos', pricePerM2: 35, description: 'Combinación de tejidos para versatilidad total.' },
];