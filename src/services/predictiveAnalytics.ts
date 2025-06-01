
import { addDays, format, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';

export interface AbsencePattern {
  period: string;
  probability: number;
  historicalCount: number;
  type: 'school_holiday' | 'bridge_day' | 'summer_peak' | 'end_year' | 'seasonal';
}

export interface PredictiveAlert {
  id: string;
  weekNumber: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  expectedAbsences: number;
  availableStaff: number;
  totalStaff: number;
  message: string;
  suggestions: string[];
  date: Date;
}

export interface TeamRedistribution {
  sourceTeam: string;
  targetTeam: string;
  employees: string[];
  reason: string;
  impact: 'low' | 'medium' | 'high';
}

class PredictiveAnalyticsService {
  private historicalData = [
    { date: '2024-07-15', absences: 12, reason: 'summer_peak' },
    { date: '2024-07-22', absences: 15, reason: 'summer_peak' },
    { date: '2024-08-15', absences: 18, reason: 'summer_peak' },
    { date: '2024-10-28', absences: 8, reason: 'school_holiday' },
    { date: '2024-12-23', absences: 20, reason: 'end_year' },
    { date: '2024-12-30', absences: 22, reason: 'end_year' },
    { date: '2024-11-01', absences: 6, reason: 'bridge_day' },
    { date: '2024-05-08', absences: 7, reason: 'bridge_day' },
  ];

  private schoolHolidays = [
    { start: '2025-02-15', end: '2025-03-03', name: 'Vacances d\'hiver' },
    { start: '2025-04-12', end: '2025-04-28', name: 'Vacances de printemps' },
    { start: '2025-07-05', end: '2025-09-01', name: 'Vacances d\'été' },
    { start: '2025-10-18', end: '2025-11-03', name: 'Vacances de la Toussaint' },
    { start: '2025-12-20', end: '2026-01-05', name: 'Vacances de Noël' },
  ];

  private bridgeDays = [
    { date: '2025-05-02', name: 'Pont du 1er mai' },
    { date: '2025-05-30', name: 'Pont de l\'Ascension' },
    { date: '2025-07-14', name: 'Pont du 14 juillet' },
    { date: '2025-11-11', name: 'Pont du 11 novembre' },
  ];

  analyzeAbsencePatterns(): AbsencePattern[] {
    const patterns: AbsencePattern[] = [];

    // Analyse des vacances scolaires
    this.schoolHolidays.forEach(holiday => {
      const historicalCount = this.getHistoricalAbsences('school_holiday');
      patterns.push({
        period: holiday.name,
        probability: 0.75,
        historicalCount,
        type: 'school_holiday'
      });
    });

    // Analyse des ponts
    this.bridgeDays.forEach(bridge => {
      const historicalCount = this.getHistoricalAbsences('bridge_day');
      patterns.push({
        period: bridge.name,
        probability: 0.65,
        historicalCount,
        type: 'bridge_day'
      });
    });

    // Pic d'été
    patterns.push({
      period: 'Période estivale (Juillet-Août)',
      probability: 0.85,
      historicalCount: this.getHistoricalAbsences('summer_peak'),
      type: 'summer_peak'
    });

    return patterns;
  }

  generatePredictiveAlerts(): PredictiveAlert[] {
    const alerts: PredictiveAlert[] = [];
    const today = new Date();

    // Prochaines 12 semaines
    for (let i = 1; i <= 12; i++) {
      const weekStart = startOfWeek(addDays(today, i * 7));
      const weekEnd = endOfWeek(weekStart);
      const weekNumber = this.getWeekNumber(weekStart);
      
      const riskAssessment = this.assessWeekRisk(weekStart, weekEnd);
      
      if (riskAssessment.riskLevel !== 'low') {
        alerts.push({
          id: `alert-week-${weekNumber}`,
          weekNumber,
          riskLevel: riskAssessment.riskLevel,
          expectedAbsences: riskAssessment.expectedAbsences,
          availableStaff: 32 - riskAssessment.expectedAbsences,
          totalStaff: 32,
          message: riskAssessment.message,
          suggestions: riskAssessment.suggestions,
          date: weekStart
        });
      }
    }

    return alerts.sort((a, b) => b.riskLevel.localeCompare(a.riskLevel));
  }

  generateTeamRedistributions(alert: PredictiveAlert): TeamRedistribution[] {
    const redistributions: TeamRedistribution[] = [];

    if (alert.riskLevel === 'high' || alert.riskLevel === 'critical') {
      redistributions.push({
        sourceTeam: 'Équipe Support',
        targetTeam: 'Équipe Développement',
        employees: ['Marie Martin', 'Pierre Durand'],
        reason: 'Renforcement temporaire pour maintenir la productivité',
        impact: 'medium'
      });

      redistributions.push({
        sourceTeam: 'Équipe Marketing',
        targetTeam: 'Équipe Développement', 
        employees: ['Sophie Leroy'],
        reason: 'Compétences transversales disponibles',
        impact: 'low'
      });
    }

    return redistributions;
  }

  private getHistoricalAbsences(type: string): number {
    return this.historicalData
      .filter(data => data.reason === type)
      .reduce((sum, data) => sum + data.absences, 0);
  }

  private assessWeekRisk(weekStart: Date, weekEnd: Date) {
    let expectedAbsences = 3; // Base normale
    let riskFactors: string[] = [];

    // Vérification vacances scolaires
    const isSchoolHoliday = this.schoolHolidays.some(holiday => 
      isWithinInterval(weekStart, { 
        start: new Date(holiday.start), 
        end: new Date(holiday.end) 
      })
    );

    if (isSchoolHoliday) {
      expectedAbsences += 8;
      riskFactors.push('vacances scolaires');
    }

    // Vérification ponts
    const hasBridgeDay = this.bridgeDays.some(bridge => 
      isWithinInterval(new Date(bridge.date), { start: weekStart, end: weekEnd })
    );

    if (hasBridgeDay) {
      expectedAbsences += 5;
      riskFactors.push('jour de pont');
    }

    // Période estivale
    const isEarlyMonth = weekStart.getMonth();
    if (isEarlyMonth >= 6 && isEarlyMonth <= 7) { // Juillet-Août
      expectedAbsences += 6;
      riskFactors.push('période estivale');
    }

    // Fin d'année
    if (isEarlyMonth === 11) { // Décembre
      expectedAbsences += 4;
      riskFactors.push('fin d\'année');
    }

    let riskLevel: PredictiveAlert['riskLevel'] = 'low';
    let message = '';
    let suggestions: string[] = [];

    if (expectedAbsences >= 15) {
      riskLevel = 'critical';
      message = `Risque critique de sous-effectif : ${expectedAbsences} absences prévues`;
      suggestions = [
        'Bloquer les nouvelles demandes de congés',
        'Activer le plan de continuité d\'activité',
        'Envisager le recours à l\'intérim'
      ];
    } else if (expectedAbsences >= 10) {
      riskLevel = 'high';
      message = `Risque élevé de sous-effectif : ${expectedAbsences} absences prévues`;
      suggestions = [
        'Redistribuer les équipes en fonction des priorités',
        'Reporter les projets non critiques',
        'Sensibiliser les équipes sur la planification'
      ];
    } else if (expectedAbsences >= 6) {
      riskLevel = 'medium';
      message = `Attention : ${expectedAbsences} absences prévues (${riskFactors.join(', ')})`;
      suggestions = [
        'Planifier les tâches critiques en avance',
        'Vérifier la disponibilité des ressources clés'
      ];
    }

    return { riskLevel, expectedAbsences, message, suggestions };
  }

  private getWeekNumber(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - start.getTime();
    return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
  }
}

export const predictiveAnalytics = new PredictiveAnalyticsService();
