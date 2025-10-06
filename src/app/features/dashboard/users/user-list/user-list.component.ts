import { Component , OnInit} from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user.model';
import { FormsModule} from '@angular/forms';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filtre = { role: '', nom: '', email: '' };
  loading = false;
  message = '';
  selectedUser: User | null = null;

  private localStorageKey = 'userListFilters';

  constructor(private userService: UserService) {}

  ngOnInit() {
    // Restaurer filtres depuis localStorage
    const savedFilters = localStorage.getItem(this.localStorageKey);
    if (savedFilters) {
      try {
        this.filtre = JSON.parse(savedFilters);
      } catch {
        this.filtre = { role: '', nom: '', email: '' };
      }
    }
    this.getUsers();
  }

  getUsers() {
    this.loading = true;

    // Sauvegarder filtres dans localStorage
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.filtre));

    this.userService.getProfiles(this.filtre).subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
        this.message = '';
      },
      error: () => {
        this.message = 'Erreur de chargement';
        this.loading = false;
      }
    });
  }

  changerStatut(user: User, statut: 'actif' | 'inactif') {
    this.userService.changeUserStatus(user._id, statut).subscribe({
      next: (updated) => {
        user.statut = updated.statut;
      },
      error: () => {
        this.message = "Impossible de changer le statut";
      }
    });
  }

  validerCompte(user: User) {
    const code = prompt("Code reçu par l'utilisateur : ");
    if (code) {
      this.userService.validateEmailChange(user.email, code).subscribe({
        next: (resp) => {
          user.emailVerified = true;
          this.message = resp.message;
        },
        error: () => {
          this.message = "Échec validation email";
        }
      });
    }
  }

  supprimer(user: User) {
    if (confirm(`Supprimer ${user.nom} ?`)) {
      this.userService.deleteUser(user._id).subscribe({
        next: (resp) => {
          this.users = this.users.filter(u => u._id !== user._id);
          this.message = resp.message;
        },
        error: () => {
          this.message = "Suppression impossible";
        }
      });
    }
  }

  voirProfil(userId: string): void {
    const user = this.users.find(u => u._id === userId);
    if (user) {
      this.selectedUser = user;
    }
  }

  fermerProfil(): void {
    this.selectedUser = null;
  }
}
