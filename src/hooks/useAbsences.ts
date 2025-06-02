import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Absence } from '../lib/supabase';
import { calculateDaysBetween, checkAbsenceOverlap } from '../lib/utils';

export const useAbsences = (employeeId: string) => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAbsences();
  }, [employeeId]);

  const fetchAbsences = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('absences')
        .select('*')
        .eq('employee_id', employeeId)
        .order('start_date', { ascending: false });

      if (error) throw error;
      setAbsences(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
    } finally {
      setLoading(false);
    }
  };

  const addAbsence = async (absence: Omit<Absence, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Vérifier le chevauchement
      const hasOverlap = await checkAbsenceOverlap(
        employeeId,
        absence.start_date,
        absence.end_date
      );

      if (hasOverlap) {
        throw new Error('Cette période chevauche une absence existante');
      }

      const { data, error } = await supabase
        .from('absences')
        .insert(absence)
        .select()
        .single();

      if (error) throw error;
      setAbsences(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      throw err;
    }
  };

  const updateAbsence = async (id: string, updates: Partial<Absence>) => {
    try {
      if (updates.start_date && updates.end_date) {
        const hasOverlap = await checkAbsenceOverlap(
          employeeId,
          updates.start_date,
          updates.end_date,
          id
        );

        if (hasOverlap) {
          throw new Error('Cette période chevauche une absence existante');
        }
      }

      const { data, error } = await supabase
        .from('absences')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setAbsences(prev => prev.map(a => a.id === id ? data : a));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      throw err;
    }
  };

  const deleteAbsence = async (id: string) => {
    try {
      const { error } = await supabase
        .from('absences')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAbsences(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      throw err;
    }
  };

  const getAbsenceStats = () => {
    const stats = {
      totalDays: 0,
      byType: {} as Record<Absence['type'], number>,
      byStatus: {} as Record<Absence['status'], number>
    };

    absences.forEach(absence => {
      const days = calculateDaysBetween(absence.start_date, absence.end_date);
      stats.totalDays += days;
      stats.byType[absence.type] = (stats.byType[absence.type] || 0) + days;
      stats.byStatus[absence.status] = (stats.byStatus[absence.status] || 0) + days;
    });

    return stats;
  };

  return {
    absences,
    loading,
    error,
    addAbsence,
    updateAbsence,
    deleteAbsence,
    getAbsenceStats,
    refresh: fetchAbsences
  };
}; 