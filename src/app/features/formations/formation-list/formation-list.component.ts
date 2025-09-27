import { Component,OnInit } from '@angular/core';
import { FormationService } from 'src/app/core/services/formation.service';
import { Formation } from 'src/app/core/models/formation.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formation-list',
  templateUrl: './formation-list.component.html',
  styleUrls: ['./formation-list.component.css']
})
export class FormationListComponent implements OnInit {
  formations: Formation[] = [];
  filterTitre: string = '';
  filterDomaine: string = '';
  selectedFormation: Formation | null = null;

  constructor(private formationService: FormationService, private router: Router) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations() {
    const filters = {
      titre: this.filterTitre,
      domaine: this.filterDomaine
    };
    this.formationService.getFormations(filters).subscribe({
      next: data => this.formations = data,
      error: err => console.error('Erreur chargement formations', err)
    });
  }

  onFilter() {
    this.loadFormations();
  }

  goToCreate() {
    this.router.navigate(['/formations/create']);
  }

  goToEdit(id: string) {
    this.router.navigate(['/formations/edit', id]);
  }

  showDetails(formation: Formation) {
    this.selectedFormation = formation;
  }

  closeDetails() {
    this.selectedFormation = null;
  }
}
