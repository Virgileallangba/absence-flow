import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from './supabase';
import type { Employee, Absence, LeaveBalance, TeamWellbeing, ManagerBadge } from './supabase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fonction pour calculer le nombre de jours entre deux dates
export const calculateDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Fonction pour formater une date en format français
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Fonction pour calculer le solde de congés restant
export const calculateRemainingLeave = async (employeeId: string, year: number): Promise<LeaveBalance[]> => {
  const { data, error } = await supabase
    .from('leave_balances')
    .select('*')
    .eq('employee_id', employeeId)
    .eq('year', year);

  if (error) throw error;
  return data || [];
};

// Fonction pour obtenir le bien-être de l'équipe
export const getTeamWellbeing = async (teamId: string): Promise<TeamWellbeing | null> => {
  const { data, error } = await supabase
    .from('team_wellbeing')
    .select('*')
    .eq('team_id', teamId)
    .single();

  if (error) throw error;
  return data;
};

// Fonction pour obtenir les badges d'un manager
export const getManagerBadges = async (employeeId: string): Promise<ManagerBadge[]> => {
  const { data, error } = await supabase
    .from('manager_badges')
    .select('*')
    .eq('id', employeeId);

  if (error) throw error;
  return data || [];
};

// Fonction pour vérifier si une absence chevauche une autre
export const checkAbsenceOverlap = async (
  employeeId: string,
  startDate: string,
  endDate: string,
  excludeAbsenceId?: string
): Promise<boolean> => {
  let query = supabase
    .from('absences')
    .select('*')
    .eq('employee_id', employeeId)
    .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

  if (excludeAbsenceId) {
    query = query.neq('id', excludeAbsenceId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data?.length || 0) > 0;
};

// Fonction pour calculer les statistiques d'absence
export const calculateAbsenceStats = async (employeeId: string, year: number): Promise<{
  totalDays: number;
  byType: Record<string, number>;
}> => {
  const { data, error } = await supabase
    .from('absences')
    .select('*')
    .eq('employee_id', employeeId)
    .gte('start_date', `${year}-01-01`)
    .lte('end_date', `${year}-12-31`);

  if (error) throw error;

  const stats = {
    totalDays: 0,
    byType: {} as Record<string, number>
  };

  data?.forEach(absence => {
    const days = calculateDaysBetween(absence.start_date, absence.end_date);
    stats.totalDays += days;
    stats.byType[absence.type] = (stats.byType[absence.type] || 0) + days;
  });

  return stats;
};

// Fonction pour vérifier les permissions
export const checkPermission = async (userId: string, requiredRole: 'employee' | 'manager' | 'hr'): Promise<boolean> => {
  const { data, error } = await supabase
    .from('employees')
    .select('role')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data?.role === requiredRole;
};

// Fonction pour envoyer une notification
export const sendNotification = async (
  userId: string,
  message: string,
  type: 'info' | 'warning' | 'success' | 'error' | 'absence_status' | 'new_request',
  metadata?: Record<string, string | number | boolean | null>
): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      message,
      type,
      metadata
    });

  if (error) throw error;
};
