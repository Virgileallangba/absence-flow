-- Insert test data for team_wellbeing
INSERT INTO public.team_wellbeing (team_id, score, trend, factors)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 85, 5, '[
        {"name": "Satisfaction", "value": 90, "max": 100},
        {"name": "Productivité", "value": 85, "max": 100},
        {"name": "Collaboration", "value": 80, "max": 100}
    ]'::jsonb),
    ('00000000-0000-0000-0000-000000000002', 75, -2, '[
        {"name": "Satisfaction", "value": 80, "max": 100},
        {"name": "Productivité", "value": 75, "max": 100},
        {"name": "Collaboration", "value": 70, "max": 100}
    ]'::jsonb);

-- Insert test data for manager_badges
INSERT INTO public.manager_badges (name, description, icon_name, progress, unlocked)
VALUES 
    ('Leader Visionnaire', 'Atteint 100% de satisfaction d''équipe', 'Trophy', 100, true),
    ('Gestionnaire Agile', 'Gère efficacement 10 projets simultanément', 'TrendingUp', 75, false),
    ('Mentor Inspirant', 'A formé 5 nouveaux managers', 'Star', 50, false);

-- Insert test data for manager_rankings
INSERT INTO public.manager_rankings (rank, name, score, avatar, initials)
VALUES 
    (1, 'Marie Dubois', 95, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie', 'MD'),
    (2, 'Thomas Martin', 88, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas', 'TM'),
    (3, 'Sophie Bernard', 85, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie', 'SB');

-- Insert test data for hr_audits
INSERT INTO public.hr_audits (title, status, description, recommendation)
VALUES 
    ('Conformité des contrats', 'compliant', 'Vérification des clauses contractuelles', 'Maintenir les procédures actuelles'),
    ('Égalité salariale', 'warning', 'Écart de 2% détecté', 'Réviser la grille salariale'),
    ('Documentation RH', 'non-compliant', 'Manque de documents obligatoires', 'Mettre à jour la documentation');

-- Insert test data for hr_recommendations
INSERT INTO public.hr_recommendations (type, title, description, impact, priority)
VALUES 
    ('policy', 'Mise à jour du règlement intérieur', 'Adapter le règlement aux nouvelles normes', 'high', 1),
    ('employee', 'Formation management', 'Proposer une formation aux nouveaux managers', 'medium', 2),
    ('team', 'Restructuration équipe', 'Réorganiser l''équipe pour plus d''efficacité', 'low', 3);

-- Insert test data for hr_messages
INSERT INTO public.hr_messages (role, content, timestamp)
VALUES 
    ('user', 'Comment gérer un refus de congés ?', '2024-03-20 10:00:00+00'),
    ('assistant', 'Le refus doit être motivé et notifié dans un délai raisonnable...', '2024-03-20 10:01:00+00');

-- Insert test data for compliance_checks
INSERT INTO public.compliance_checks (category, status, description, requirement, evidence)
VALUES 
    ('RGPD', 'compliant', 'Protection des données personnelles', 'Article 5 du RGPD', 'Audit externe 2024'),
    ('Santé', 'warning', 'Protocole de sécurité', 'Code du travail', 'Rapport d''inspection'),
    ('Travail', 'non-compliant', 'Temps de repos', 'Directive européenne', 'Contrôle URSSAF');

-- Insert test data for audit_simulations
INSERT INTO public.audit_simulations (title, status, date, findings)
VALUES 
    ('Audit RGPD', 'passed', '2024-03-20', '[
        {"type": "success", "description": "Conformité des données"},
        {"type": "warning", "description": "Mise à jour nécessaire des procédures"}
    ]'::jsonb),
    ('Audit Santé', 'failed', '2024-03-19', '[
        {"type": "error", "description": "Protocole de sécurité non conforme"},
        {"type": "warning", "description": "Formation manquante"}
    ]'::jsonb);

-- Insert test data for integration_statuses
INSERT INTO public.integration_statuses (name, connected, lastSync, notifications)
VALUES 
    ('slack', true, '2024-03-20 09:00:00+00', '[
        {"type": "Nouvelle demande", "enabled": true},
        {"type": "Statut mis à jour", "enabled": true}
    ]'::jsonb),
    ('teams', true, '2024-03-20 08:30:00+00', '[
        {"type": "Absence approuvée", "enabled": true},
        {"type": "Rappel congés", "enabled": false}
    ]'::jsonb); 