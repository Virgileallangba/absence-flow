import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Employee, TeamWellbeing } from '../lib/supabase';

export const useTeam = (departmentId: string) => {
  const [team, setTeam] = useState<Employee[]>([]);
  const [wellbeing, setWellbeing] = useState<TeamWellbeing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchTeamData();
  }, [departmentId]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les membres de l'équipe
      const { data: teamData, error: teamError } = await supabase
        .from('employees')
        .select('*')
        .eq('department', departmentId)
        .order('full_name');

      if (teamError) throw teamError;

      // Récupérer les données de bien-être
      const { data: wellbeingData, error: wellbeingError } = await supabase
        .from('team_wellbeing')
        .select('*')
        .eq('team_id', departmentId)
        .single();

      if (wellbeingError && wellbeingError.code !== 'PGRST116') {
        throw wellbeingError;
      }

      setTeam(teamData || []);
      setWellbeing(wellbeingData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
    } finally {
      setLoading(false);
    }
  };

  const updateTeamMember = async (employeeId: string, updates: Partial<Employee>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', employeeId)
        .select()
        .single();

      if (error) throw error;
      setTeam(prev => prev.map(member => member.id === employeeId ? data : member));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      throw err;
    }
  };

  const updateWellbeing = async (updates: Partial<TeamWellbeing>) => {
    try {
      const { data, error } = await supabase
        .from('team_wellbeing')
        .upsert({
          team_id: departmentId,
          ...updates
        })
        .select()
        .single();

      if (error) throw error;
      setWellbeing(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      throw err;
    }
  };

  const getTeamStats = () => {
    const stats = {
      totalMembers: team.length,
      byRole: team.reduce((acc, member) => {
        acc[member.role] = (acc[member.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      wellbeingScore: wellbeing?.score || 0,
      wellbeingTrend: wellbeing?.trend || 0
    };

    return stats;
  };

  return {
    team,
    wellbeing,
    loading,
    error,
    updateTeamMember,
    updateWellbeing,
    getTeamStats,
    refresh: fetchTeamData
  };
}; 