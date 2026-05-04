
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface Project {
  id: string;
  name: string;
  description: string;
  slaHours: number;
  users: string[]; // User IDs
}

export interface User {
  id: string;
  name: string;
  email: string;
  projects: string[]; // Project IDs
  role: 'Agent' | 'Admin' | 'Customer';
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  projectId: string;
  createdById: string;
  assignedToId?: string;
  priority: Priority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export type TimeRange = 'Weekly' | 'Monthly' | 'Quarterly';
