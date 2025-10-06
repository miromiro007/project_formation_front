export type UserRole = 'admin' | 'employe'; // selon tes rôles
export type UserStatus = 'actif' | 'inactif' | 'en_attente';

export interface User {
  _id: string;
  nom: string;
  email: string;
  password: string; // Attention à ne pas afficher dans UI !
  role: UserRole;
  competence: string[];
  statut: UserStatus;
  validationCode?: string | null;
  validationCodeExpires?: Date | null;
  emailVerified: boolean;
  enLigne: boolean;
  createdAt: Date;
  updatedAt: Date;
}
