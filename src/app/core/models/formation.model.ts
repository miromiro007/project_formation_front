export interface Formation {
  _id: string;
  titre: string;
  description: string;
  domaine: string;
  competenceVisee: string[];
  dateDebut: Date;
  dateFin: Date;
  placeDispo: number;
  numeroSalle: string;
}
