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
}

// DTO Filtro
export interface FilterDTO {
  status: string; // "PENDING" | "COMPLETED"
  word: string; // Palabra clave para buscar en título o descripción
}