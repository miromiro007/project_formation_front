export interface Formation {
  id: string;
  titre: string;
  domaine: string;
  description: string;
  dateDebut: string;  // ISO 8601, ex: '2024-06-01'
  dateFin: string;    // ISO 8601
  minPlace: number;
  maxPlace: number;
}

