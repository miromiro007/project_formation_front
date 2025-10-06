import { Component , OnInit , Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { Formation } from 'src/app/core/models/formation.model';
import { FormBuilder ,FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationService } from 'src/app/core/services/formation.service';
@Component({
  selector: 'app-formation-edit',
  templateUrl: './formation-edit.component.html',
  styleUrls: ['./formation-edit.component.css']
})
export class FormationEditComponent implements OnInit, OnChanges {

  @Input() formation: Formation | null = null;  // formation à éditer passée depuis parent
  @Output() close = new EventEmitter<void>();   // event pour fermer le modal après submission ou annulation

  editForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private formationService: FormationService
  ) {
    this.editForm = this.fb.group({
      titre: ['', Validators.required],
      domaine: ['', Validators.required],
      description: [''],
      competenceVisee: ['', Validators.required],  // chaîne CSV des compétences visées
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      placeDispo: [1, [Validators.required, Validators.min(1)]],
      numeroSalle: ['']
    });
  }

  ngOnInit(): void {
    if (this.formation) {
      this.patchForm(this.formation);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formation'] && this.formation) {
      this.patchForm(this.formation);
    }
  }

  patchForm(formation: Formation): void {
    this.editForm.patchValue({
      titre: formation.titre,
      domaine: formation.domaine,
      description: formation.description,
      competenceVisee: formation.competenceVisee.join(', '),
      dateDebut: this.formatDateForInput(formation.dateDebut),
      dateFin: this.formatDateForInput(formation.dateFin),
      placeDispo: formation.placeDispo,
      numeroSalle: formation.numeroSalle
    });
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }

  onSubmit(): void {
    if (this.editForm.valid && this.formation) {
      const token = localStorage.getItem('authToken') || '';

      const updatedFormation = {
        titre: this.editForm.value.titre,
        domaine: this.editForm.value.domaine,
        description: this.editForm.value.description,
        competenceVisee: this.editForm.value.competenceVisee.split(',').map((x: string) => x.trim()),
        dateDebut: new Date(this.editForm.value.dateDebut),
        dateFin: new Date(this.editForm.value.dateFin),
        placeDispo: this.editForm.value.placeDispo,
        numeroSalle: this.editForm.value.numeroSalle
      };

      this.formationService.updateFormation(this.formation._id!, updatedFormation, token).subscribe({
        next: () => this.close.emit(),  // émet l’événement de fermeture après mise à jour
        error: () => this.errorMessage = 'Erreur lors de la mise à jour.'
      });
    }
  }

  onCancel(): void {
    this.close.emit();  // émets aussi l’événement pour fermer sans sauvegarder
  }
}
