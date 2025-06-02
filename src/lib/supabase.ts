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
      team_wellbeing: {
        Row: {
          id: string
          team_id: string
          score: number
          trend: number
          factors: {
            name: string
            value: number
            max: number
          }[]
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          team_id: string
          score: number
          trend: number
          factors: {
            name: string
            value: number
            max: number
          }[]
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          team_id?: string
          score?: number
          trend?: number
          factors?: {
            name: string
            value: number
            max: number
          }[]
          created_at?: string
          updated_at?: string | null
        }
      }
      manager_badges: {
        Row: {
          id: string
          name: string
          description: string
          icon_name: string
          progress: number
          unlocked: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon_name: string
          progress: number
          unlocked: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon_name?: string
          progress?: number
          unlocked?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      manager_rankings: {
        Row: {
          id: string
          rank: number
          name: string
          score: number
          avatar: string | null
          initials: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          rank: number
          name: string
          score: number
          avatar?: string | null
          initials: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          rank?: number
          name?: string
          score?: number
          avatar?: string | null
          initials?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      hr_audits: {
        Row: {
          id: string
          title: string
          status: 'compliant' | 'warning' | 'non-compliant'
          description: string
          recommendation: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          status: 'compliant' | 'warning' | 'non-compliant'
          description: string
          recommendation: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          status?: 'compliant' | 'warning' | 'non-compliant'
          description?: string
          recommendation?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      hr_recommendations: {
        Row: {
          id: string
          type: 'policy' | 'employee' | 'team'
          title: string
          description: string
          impact: 'high' | 'medium' | 'low'
          priority: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          type: 'policy' | 'employee' | 'team'
          title: string
          description: string
          impact: 'high' | 'medium' | 'low'
          priority: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          type?: 'policy' | 'employee' | 'team'
          title?: string
          description?: string
          impact?: 'high' | 'medium' | 'low'
          priority?: number
          created_at?: string
          updated_at?: string | null
        }
      }
      hr_messages: {
        Row: {
          id: string
          role: 'user' | 'assistant'
          content: string
          timestamp: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          role: 'user' | 'assistant'
          content: string
          timestamp: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          role?: 'user' | 'assistant'
          content?: string
          timestamp?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      compliance_checks: {
        Row: {
          id: string
          category: string
          status: 'compliant' | 'warning' | 'non-compliant'
          description: string
          requirement: string
          evidence: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          category: string
          status: 'compliant' | 'warning' | 'non-compliant'
          description: string
          requirement: string
          evidence: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          category?: string
          status?: 'compliant' | 'warning' | 'non-compliant'
          description?: string
          requirement?: string
          evidence?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      audit_simulations: {
        Row: {
          id: string
          title: string
          status: 'passed' | 'failed' | 'in-progress'
          date: string
          findings: {
            type: 'success' | 'warning' | 'error'
            description: string
          }[]
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          status: 'passed' | 'failed' | 'in-progress'
          date: string
          findings: {
            type: 'success' | 'warning' | 'error'
            description: string
          }[]
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          status?: 'passed' | 'failed' | 'in-progress'
          date?: string
          findings?: {
            type: 'success' | 'warning' | 'error'
            description: string
          }[]
          created_at?: string
          updated_at?: string | null
        }
      }
      integration_statuses: {
        Row: {
          id: string
          name: string
          connected: boolean
          lastSync: string
          notifications: {
            type: string
            enabled: boolean
          }[]
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          connected: boolean
          lastSync: string
          notifications: {
            type: string
            enabled: boolean
          }[]
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          connected?: boolean
          lastSync?: string
          notifications?: {
            type: string
            enabled: boolean
          }[]
          created_at?: string
          updated_at?: string | null
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
export type TeamWellbeing = Database['public']['Tables']['team_wellbeing']['Row']
export type ManagerBadge = Database['public']['Tables']['manager_badges']['Row']
export type ManagerRanking = Database['public']['Tables']['manager_rankings']['Row']
export type HRAudit = Database['public']['Tables']['hr_audits']['Row']
export type HRRecommendation = Database['public']['Tables']['hr_recommendations']['Row']
export type HRMessage = Database['public']['Tables']['hr_messages']['Row']
export type ComplianceCheck = Database['public']['Tables']['compliance_checks']['Row']
export type AuditSimulation = Database['public']['Tables']['audit_simulations']['Row']
export type IntegrationStatus = Database['public']['Tables']['integration_statuses']['Row']

// Helper function to get the public Supabase URL from environment variables
export function getURL() {
  return supabaseUrl.origin;
} 