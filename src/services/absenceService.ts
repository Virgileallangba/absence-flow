import { supabase } from '@/lib/supabase';
import type { Absence } from '@/lib/supabase';

export const absenceService = {
  // Récupérer toutes les absences d'un employé
  async getEmployeeAbsences(employeeId: string) {
    const { data, error } = await supabase
      .from('absences')
      .select('*')
      .eq('employee_id', employeeId)
      .order('start_date', { ascending: false });

    if (error) {
      console.error("absenceService.getEmployeeAbsences error:", error);
      throw error;
    }
    return data as Absence[];
  },

  // Récupérer les absences en attente pour un manager
  async getPendingAbsences() {
    const { data, error } = await supabase
      .from('absences')
      .select(`
        *,
        employee:employee_id (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("absenceService.getPendingAbsences error:", error);
      throw error;
    }
    return data;
  },

  // Créer une nouvelle demande d'absence
  async createAbsence(absence: Omit<Absence, 'id' | 'created_at' | 'updated_at'>) {
    console.log("absenceService.createAbsence: Attempting to create absence", absence); // Log des données envoyées
    const { data, error } = await supabase
      .from('absences')
      .insert([absence])
      .select()
      .single();

    if (error) {
      console.error("absenceService.createAbsence error:", error); // Log de l'erreur
      throw error;
    }
    console.log("absenceService.createAbsence: Absence created successfully", data); // Log des données retournées
    return data as Absence;
  },

  // Mettre à jour le statut d'une absence
  async updateAbsenceStatus(absenceId: string, status: 'approved' | 'rejected') {
    const { data, error } = await supabase
      .from('absences')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', absenceId)
      .select()
      .single();

    if (error) {
      console.error("absenceService.updateAbsenceStatus error:", error);
      throw error;
    }
    return data as Absence;
  },

  // Récupérer les statistiques d'absence pour un employé
  async getEmployeeAbsenceStats(employeeId: string, year: number) {
    const { data, error } = await supabase
      .from('absences')
      .select('type, status')
      .eq('employee_id', employeeId)
      .gte('start_date', `${year}-01-01`)
      .lte('end_date', `${year}-12-31`);

    if (error) {
      console.error("absenceService.getEmployeeAbsenceStats error:", error);
      throw error;
    }
    return data;
  }
}; 