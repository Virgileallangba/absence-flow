# AbsenceFlow – Gestion des absences avec Supabase & Vercel

## Présentation

AbsenceFlow est une application moderne de gestion des absences, construite avec React, Vite, TypeScript, shadcn-ui, Tailwind CSS et Supabase.

---

## Installation & Lancement

1. **Cloner le dépôt**
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
```

2. **Variables d'environnement**

Créez un fichier `.env` ou configurez sur Vercel :
```
VITE_SUPABASE_URL=...   # URL de votre projet Supabase
VITE_SUPABASE_ANON_KEY=... # Clé anonyme Supabase
```

3. **Lancer en développement**
```sh
npm run dev
```

---

## Déploiement sur Vercel

- Connectez votre dépôt à Vercel
- Ajoutez les variables d'environnement dans le dashboard Vercel
- Déployez !

---

## Intégration Supabase

### a. Appliquer les migrations
Dans le dashboard Supabase, ouvrez l'onglet **SQL Editor** et copiez le contenu de :
- `supabase/migrations/20240320000000_add_new_tables.sql`

Exécutez le script pour créer les tables et politiques de sécurité.

### b. Insérer les données de test
Dans le même éditeur SQL, copiez le contenu de :
- `supabase/seed.sql`

Exécutez pour insérer des exemples de données.

---

## Utilisation des hooks personnalisés

### Absences (employé)
```tsx
import { useAbsences } from '@/hooks/useAbsences';
const { absences, addAbsence, updateAbsence, deleteAbsence, loading, error } = useAbsences(employeeId);
```

### Équipe
```tsx
import { useTeam } from '@/hooks/useTeam';
const { team, wellbeing, updateTeamMember, updateWellbeing, loading } = useTeam(departmentId);
```

### Manager
```tsx
import { useManager } from '@/hooks/useManager';
const { badges, ranking, updateBadge, updateRanking, loading } = useManager(managerId);
```

---

## Utilitaires disponibles

- `calculateDaysBetween(start, end)` : nombre de jours entre deux dates
- `formatDate(date)` : format français
- `calculateRemainingLeave(employeeId, year)` : solde de congés
- `checkAbsenceOverlap(...)` : vérifie le chevauchement
- `sendNotification(...)` : envoie une notification

---

## Bonnes pratiques
- **RLS** : Testez les accès selon les rôles (employé, manager, etc.)
- **Sécurité** : N'utilisez jamais la clé service côté front
- **Types** : Utilisez les types TypeScript fournis dans `src/lib/supabase.ts`
- **Migrations** : Pour la prod, utilisez la CLI Supabase ou GitHub Actions

---

## Technologies principales
- React, Vite, TypeScript, Tailwind CSS, shadcn-ui
- Supabase (Postgres, Auth, Storage)
- Vercel (déploiement)

---

## Liens utiles
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## Édition et contribution

- Modifiez le code localement ou via Lovable
- Utilisez `npm run lint` pour vérifier la qualité du code
- Proposez vos améliorations via Pull Request

---

Pour toute question, ouvrez une issue ou contactez l'équipe !
