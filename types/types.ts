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
export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: "PENDING" | "COMPLETED";
  userId: number;
  sectorId: number;
  location: string; // WKT
  createdAt: string;
  sectorName?: string; // opcional para mostrar el nombre del sector
}

// DTO para crear tarea
export interface TaskCreateDTO {
  title: string;
  description: string;
  dueDate: string;
  status?: "PENDING" | "COMPLETED";
  sectorId: number;
  location: string; // WKT
}

// DTO para actualizar tarea
export interface TaskUpdateDTO {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: "PENDING" | "COMPLETED";
  sectorId?: number;
  location?: string; // WKT
}

// (Opcional) Para estadísticas o consultas espaciales
export interface TaskStatsBySector {
  sectorId: number;
  sectorName: string;
  totalTasks: number;
}

export interface NearestTask {
  id: number;
  title: string;
  distance: number;
  dueDate: string;
}

export interface CompletedTaskDistanceDTO {
  id: number;
  title: string;
  completedAt: string;
  distance: number;
}

// Puedes agregar más DTO según tus endpoints de consultas espaciales.