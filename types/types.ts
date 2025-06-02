// USUARIO
export interface User {
  id: number;
  username: string;
  name: string;
  role: "USER" | "ADMIN";
  location: string; // WKT
}

// SECTOR
export interface Sector {
  id: number;
  name: string;
  location: string; // WKT
}

// TAREA

export type TaskStatus = 'PENDING' | 'COMPLETED' | 'IN_PROGRESS'

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string | null;
  status: TaskStatus;
  userId: number;
  sectorId: number | null;
  location: string | null; // Permitir null
  createdAt: string;
}

// DTO Filtro
export interface FilterDTO {
  status: string; // "PENDING" | "COMPLETED"
  word: string; // Palabra clave para buscar en título o descripción
}

export interface ApiResponse {
  success: boolean
  message?: string
  data?: any
}

export interface UserLocationResponse {
  success: boolean;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  message?: string;
}

export interface NearestPendingTask {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  userId: number;
  sectorId: number;
  location: string;
  createdAt: string;
  // Elimina 'distance' y 'sector' si no vienen del backend
}

export interface SectorTaskCount {
  sector: {
    name: string;
  };
  count: number;
}
