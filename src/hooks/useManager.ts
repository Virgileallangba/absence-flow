import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { ManagerBadge, ManagerRanking } from '../lib/supabase';

export const useManager = (managerId: string) => {
  const [badges, setBadges] = useState<ManagerBadge[]>([]);
  const [ranking, setRanking] = useState<ManagerRanking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchManagerData();
  }, [managerId]);

  const fetchManagerData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('manager_badges')
        .select('*')
        .eq('id', managerId)
        .order('progress', { ascending: false });

      if (badgesError) throw badgesError;

      // Récupérer le classement
      const { data: rankingData, error: rankingError } = await supabase
        .from('manager_rankings')
        .select('*')
        .eq('id', managerId)
        .single();

      if (rankingError && rankingError.code !== 'PGRST116') {
        throw rankingError;
      }

      setBadges(badgesData || []);
      setRanking(rankingData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
    } finally {
      setLoading(false);
    }
  };

  const updateBadge = async (badgeId: string, updates: Partial<ManagerBadge>) => {
    try {
      const { data, error } = await supabase
        .from('manager_badges')
        .update(updates)
        .eq('id', badgeId)
        .select()
        .single();

      if (error) throw error;
      setBadges(prev => prev.map(badge => badge.id === badgeId ? data : badge));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      throw err;
    }
  };

  const updateRanking = async (updates: Partial<ManagerRanking>) => {
    try {
      const { data, error } = await supabase
        .from('manager_rankings')
        .upsert({
          id: managerId,
          ...updates
        })
        .select()
        .single();

      if (error) throw error;
      setRanking(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      throw err;
    }
  };

  const getManagerStats = () => {
    const stats = {
      totalBadges: badges.length,
      unlockedBadges: badges.filter(badge => badge.unlocked).length,
      averageProgress: badges.reduce((acc, badge) => acc + badge.progress, 0) / (badges.length || 1),
      currentRank: ranking?.rank || 0,
      score: ranking?.score || 0
    };

    return stats;
  };

  return {
    badges,
    ranking,
    loading,
    error,
    updateBadge,
    updateRanking,
    getManagerStats,
    refresh: fetchManagerData
  };
}; 