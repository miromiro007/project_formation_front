import { FormationService  , FormationRequest  } from 'src/app/core/services/formation.service';
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-formation-create',
  templateUrl: './formation-create.component.html',
  styleUrls: ['./formation-create.component.css']
})
export class FormationCreateComponent implements OnInit {
  createForm: FormGroup;
  errorMessage = '';

  @Output() close = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private formationService: FormationService
  ) {
    this.createForm = this.fb.group({
      titre: ['', Validators.required],
      domaine: ['', Validators.required],
      description: [''],
      competenceVisee: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      placeDispo: [1, [Validators.required, Validators.min(1)]],
      numeroSalle: ['']
    });
  }

  ngOnInit(): void {}

onSubmit(): void {
  if (this.createForm.valid) {
    const token = localStorage.getItem('authToken') || '';
    const newFormation: FormationRequest = {
      titre: this.createForm.value.titre,
      domaine: this.createForm.value.domaine,
      description: this.createForm.value.description,
      competenceVisee: this.createForm.value.competenceVisee.split(',').map((x: string) => x.trim()),
      dateDebut: new Date(this.createForm.value.dateDebut).toISOString(),
      dateFin: new Date(this.createForm.value.dateFin).toISOString(),
      placeDispo: this.createForm.value.placeDispo,
      numeroSalle: this.createForm.value.numeroSalle
    };
    this.formationService.addFormation(newFormation, token).subscribe({
      next: () => this.close.emit(),
      error: () => this.errorMessage = 'Erreur lors de la création.'
    });
  }
}

  onCancel(): void {
    this.close.emit();
  }
}
