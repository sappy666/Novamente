export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  specialty: string;
  practitioner: string;
  date: string;
  time: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface SpecialtyInfo {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  description: string;
  focusAreas: string[];
  fullDetails: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  specialty: string;
  initials: string;
}

export interface Coordinator {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatarUrl?: string;
  initials?: string;
}
