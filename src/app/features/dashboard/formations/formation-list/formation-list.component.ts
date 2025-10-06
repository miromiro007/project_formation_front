  import { Component  , OnInit} from '@angular/core';
  import { FormationService } from 'src/app/core/services/formation.service';
  import { Formation } from 'src/app/core/models/formation.model';
  import { Router } from '@angular/router';
  import { FormBuilder, FormGroup } from '@angular/forms';

  @Component({
    selector: 'app-formation-list',
    templateUrl: './formation-list.component.html',
    styleUrls: ['./formation-list.component.css']
  })
  export class FormationListComponent implements OnInit {
    formations: Formation[] = [];
    selectedFormation: Formation | null = null;
    errorMessage = '';
    filterForm: FormGroup;
    isEditing: boolean = false;
    formationToEdit: Formation | null = null;
    isCreating: boolean = false;


    constructor(
      private formationService: FormationService,
      private router: Router,
      private fb: FormBuilder
    ) {
      this.filterForm = this.fb.group({
        titre: [''],
        domaine: [''],
        placeDispo: ['']
      });
    }

  ngOnInit(): void {
    // Charger valeurs du localStorage si présentes
    const savedFilters = localStorage.getItem('formationFilters');
    if (savedFilters) {
      this.filterForm.setValue(JSON.parse(savedFilters));
    }

    this.loadFormations();

    // Sauvegarder dans localStorage à chaque changement du formulaire
    this.filterForm.valueChanges.subscribe(value => {
      localStorage.setItem('formationFilters', JSON.stringify(value));
    });
  }

    loadFormations(): void {
      const filters = this.filterForm.value;

      // Convertir placeDispo en nombre si définie
      if (filters.placeDispo) {
      filters.placeDispo = Number(filters.placeDispo);
      }
      this.formationService.getFormations().subscribe({
        next: (formations) => {
          this.formations = formations;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors du chargement des formations';
          console.error('Error loading formations:', error);
        }
      });
    }

    onCreate(): void {
      this.isCreating = true;;
    }

    closeCreateForm(): void {
      this.isCreating = false;
      this.loadFormations(); // recharge les formations après création
    }

    onEdit(formation: Formation): void {
      this.formationToEdit = formation;
      this.isEditing = true;
    }



    closeEditForm(): void {
      this.isEditing = false;
      this.formationToEdit = null;
      this.loadFormations(); // recharger la liste après édition
    }

    onDelete(id: string): void {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
        const token = localStorage.getItem('authToken') || '';
        this.formationService.deleteFormation(id, token).subscribe({
          next: () => {
            this.loadFormations();
          },
          error: (error) => {
            this.errorMessage = 'Erreur lors de la suppression';
            console.error('Error deleting formation:', error);
          }
        });
      }
    }

    toggleDetails(formation: Formation): void {
      this.selectedFormation = this.selectedFormation === formation ? null : formation;
    }

    closeDetails(): void {
      this.selectedFormation = null;
    }

    onFilter(): void {
    const filters = this.filterForm.value;
    // Convertir placeDispo en nombre si défini
    if (filters.placeDispo) {
      filters.placeDispo = Number(filters.placeDispo);
    }
    this.formationService.getFormations(filters).subscribe({
      next: (filteredFormations) => {
        this.formations = filteredFormations;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du filtrage des formations';
        console.error('Error filtering formations:', error);
      }
    });
  }
  copyId(id: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id).then(() => {
        alert('ID copié dans le presse-papiers !');
      }, () => {
        alert('Erreur lors de la copie.');
      });
    } else {
      // fallback si Clipboard API non disponible
      window.prompt("Copiez l'ID :", id);
    }
  }
  }
