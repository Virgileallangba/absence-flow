-- Create team_wellbeing table
CREATE TABLE IF NOT EXISTS public.team_wellbeing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES public.departments(id),
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    trend INTEGER NOT NULL,
    factors JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create manager_badges table
CREATE TABLE IF NOT EXISTS public.manager_badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100),
    unlocked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create manager_rankings table
CREATE TABLE IF NOT EXISTS public.manager_rankings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rank INTEGER NOT NULL,
    name TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    avatar TEXT,
    initials TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create hr_audits table
CREATE TABLE IF NOT EXISTS public.hr_audits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('compliant', 'warning', 'non-compliant')),
    description TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create hr_recommendations table
CREATE TABLE IF NOT EXISTS public.hr_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('policy', 'employee', 'team')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    impact TEXT NOT NULL CHECK (impact IN ('high', 'medium', 'low')),
    priority INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create hr_messages table
CREATE TABLE IF NOT EXISTS public.hr_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create compliance_checks table
CREATE TABLE IF NOT EXISTS public.compliance_checks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('compliant', 'warning', 'non-compliant')),
    description TEXT NOT NULL,
    requirement TEXT NOT NULL,
    evidence TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create audit_simulations table
CREATE TABLE IF NOT EXISTS public.audit_simulations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'in-progress')),
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    findings JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create integration_statuses table
CREATE TABLE IF NOT EXISTS public.integration_statuses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    connected BOOLEAN NOT NULL DEFAULT false,
    lastSync TIMESTAMP WITH TIME ZONE NOT NULL,
    notifications JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies
ALTER TABLE public.team_wellbeing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manager_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manager_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_statuses ENABLE ROW LEVEL SECURITY;

-- Create policies for team_wellbeing
CREATE POLICY "Team wellbeing is viewable by team members"
    ON public.team_wellbeing
    FOR SELECT
    USING (auth.uid() IN (
        SELECT employee_id FROM public.employees WHERE department_id = team_id
    ));

-- Create policies for manager_badges
CREATE POLICY "Manager badges are viewable by all authenticated users"
    ON public.manager_badges
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policies for manager_rankings
CREATE POLICY "Manager rankings are viewable by all authenticated users"
    ON public.manager_rankings
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policies for hr_audits
CREATE POLICY "HR audits are viewable by HR and managers"
    ON public.hr_audits
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM public.employees 
            WHERE role IN ('hr', 'manager')
        )
    );

-- Create policies for hr_recommendations
CREATE POLICY "HR recommendations are viewable by HR and managers"
    ON public.hr_recommendations
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM public.employees 
            WHERE role IN ('hr', 'manager')
        )
    );

-- Create policies for hr_messages
CREATE POLICY "HR messages are viewable by HR and managers"
    ON public.hr_messages
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM public.employees 
            WHERE role IN ('hr', 'manager')
        )
    );

-- Create policies for compliance_checks
CREATE POLICY "Compliance checks are viewable by HR and managers"
    ON public.compliance_checks
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM public.employees 
            WHERE role IN ('hr', 'manager')
        )
    );

-- Create policies for audit_simulations
CREATE POLICY "Audit simulations are viewable by HR and managers"
    ON public.audit_simulations
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM public.employees 
            WHERE role IN ('hr', 'manager')
        )
    );

-- Create policies for integration_statuses
CREATE POLICY "Integration statuses are viewable by HR and managers"
    ON public.integration_statuses
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM public.employees 
            WHERE role IN ('hr', 'manager')
        )
    );

-- Add foreign key constraints
ALTER TABLE public.team_wellbeing
    ADD CONSTRAINT fk_team_wellbeing_department
    FOREIGN KEY (team_id)
    REFERENCES public.departments(id)
    ON DELETE CASCADE;

ALTER TABLE public.manager_badges
    ADD CONSTRAINT fk_manager_badges_employee
    FOREIGN KEY (id)
    REFERENCES public.employees(id)
    ON DELETE CASCADE;

ALTER TABLE public.manager_rankings
    ADD CONSTRAINT fk_manager_rankings_employee
    FOREIGN KEY (id)
    REFERENCES public.employees(id)
    ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX idx_team_wellbeing_team_id ON public.team_wellbeing(team_id);
CREATE INDEX idx_manager_badges_unlocked ON public.manager_badges(unlocked);
CREATE INDEX idx_manager_rankings_rank ON public.manager_rankings(rank);
CREATE INDEX idx_hr_audits_status ON public.hr_audits(status);
CREATE INDEX idx_hr_recommendations_priority ON public.hr_recommendations(priority);
CREATE INDEX idx_compliance_checks_status ON public.compliance_checks(status);
CREATE INDEX idx_audit_simulations_status ON public.audit_simulations(status);
CREATE INDEX idx_integration_statuses_name ON public.integration_statuses(name);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_team_wellbeing_updated_at
    BEFORE UPDATE ON public.team_wellbeing
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_manager_badges_updated_at
    BEFORE UPDATE ON public.manager_badges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_manager_rankings_updated_at
    BEFORE UPDATE ON public.manager_rankings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hr_audits_updated_at
    BEFORE UPDATE ON public.hr_audits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hr_recommendations_updated_at
    BEFORE UPDATE ON public.hr_recommendations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hr_messages_updated_at
    BEFORE UPDATE ON public.hr_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_checks_updated_at
    BEFORE UPDATE ON public.compliance_checks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audit_simulations_updated_at
    BEFORE UPDATE ON public.audit_simulations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_statuses_updated_at
    BEFORE UPDATE ON public.integration_statuses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 