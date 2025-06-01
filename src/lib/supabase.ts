import { createClient } from '@supabase/supabase-js';
import { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Les variables d\'environnement Supabase ne sont pas définies');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour les tables Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string
          email: string
          full_name: string
          department: string
          role: 'employee' | 'manager'
          avatar_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name: string
          department: string
          role: 'employee' | 'manager'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          department?: string
          role?: 'employee' | 'manager'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      absences: {
        Row: {
          id: string
          employee_id: string
          start_date: string
          end_date: string
          type: 'CP' | 'RTT' | 'Maladie' | 'Autre'
          status: 'pending' | 'approved' | 'rejected'
          reason: string | null
          document_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          employee_id: string
          start_date: string
          end_date: string
          type: 'CP' | 'RTT' | 'Maladie' | 'Autre'
          status?: 'pending' | 'approved' | 'rejected'
          reason?: string | null
          document_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          employee_id?: string
          start_date?: string
          end_date?: string
          type?: 'CP' | 'RTT' | 'Maladie' | 'Autre'
          status?: 'pending' | 'approved' | 'rejected'
          reason?: string | null
          document_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      leave_balances: {
        Row: {
          id: string
          employee_id: string
          year: number
          type: 'CP' | 'RTT'
          total_days: number
          used_days: number
          remaining_days: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          employee_id: string
          year: number
          type: 'CP' | 'RTT'
          total_days: number
          used_days?: number
          remaining_days?: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          employee_id?: string
          year?: number
          type?: 'CP' | 'RTT'
          total_days?: number
          used_days?: number
          remaining_days?: number
          created_at?: string
          updated_at?: string | null
        }
      }
      documents: {
        Row: {
          id: string
          absence_id: string | null
          employee_id: string
          file_name: string
          file_url: string
          file_type: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          absence_id?: string | null
          employee_id: string
          file_name: string
          file_url: string
          file_type?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          absence_id?: string | null
          employee_id?: string
          file_name?: string
          file_url?: string
          file_type?: string | null
          uploaded_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          message: string
          type: 'info' | 'warning' | 'success' | 'error' | 'absence_status' | 'new_request'
          read_status: boolean
          created_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          type: 'info' | 'warning' | 'success' | 'error' | 'absence_status' | 'new_request'
          read_status?: boolean
          created_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          type?: 'info' | 'warning' | 'success' | 'error' | 'absence_status' | 'new_request'
          read_status?: boolean
          created_at?: string
          metadata?: Json | null
        }
      }
      departments: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Employee = Database['public']['Tables']['employees']['Row'] & {
  preferred_theme?: "dark" | "light" | "system";
  enable_email_notifications?: boolean;
  enable_in_app_notifications?: boolean;
};

export type Absence = Database['public']['Tables']['absences']['Row']
export type LeaveBalance = Database['public']['Tables']['leave_balances']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Department = Database['public']['Tables']['departments']['Row'] 

// Helper function to get the public Supabase URL from environment variables
export function getURL() {
  return supabaseUrl.origin;
} 