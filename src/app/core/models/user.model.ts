export interface User {
  id: string;
  nom: string;
  email: string;
  role: 'employe' | 'admin';
  competence?: string[];
  statut: 'en_attente' | 'actif' | 'inactif';
  emailVerified: boolean;
  enLigne: boolean;
}
