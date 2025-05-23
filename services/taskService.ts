// ~/types/taskTypes.ts o actualiza tu ~/types/types.ts
export interface Sector {
  id: number;
  name: string;
  // Podrías añadir aquí la geolocalización si la necesitas en el frontend directamente
  // geoLocation?: { latitude: number; longitude: number };
}

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string; // o Date
  status: 'PENDIENTE' | 'COMPLETADA';
  sectorId?: number; // ID del sector geográfico asociado
  sectorName?: string; // Nombre del sector, útil para mostrar
  // userId?: number; // El backend lo sabrá por el token JWT
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskCreateDTO {
  title: string;
  description: string;
  dueDate: string; // formato YYYY-MM-DD
  sectorId: number; // O el nombre del sector, dependiendo de tu API
}

export interface TaskUpdateDTO {
  id: number; // Necesario para identificar la tarea a actualizar
  title?: string;
  description?: string;
  dueDate?: string;
  sectorId?: number;
  status?: 'PENDIENTE' | 'COMPLETADA';
}