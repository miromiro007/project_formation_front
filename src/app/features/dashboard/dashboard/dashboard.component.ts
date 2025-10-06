  import { Component,OnInit } from '@angular/core';
  import { AuthService } from 'src/app/core/services/auth.service';
  import { Router } from '@angular/router';

type UserRole = 'admin' | 'employe';
type UserStatus = 'actif' | 'inactif' | 'en_attente';
  @Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
  })


export class DashboardComponent implements OnInit {

  userRole: UserRole | null = null;
  userStatut: UserStatus | null = null;
  statutMessage: string | null = null;
  loadingUser: boolean = true;
  activeSection: 'formations' | 'reservations' | 'utilisateurs' = 'formations';
  showEditProfile = false;
  loadingSection: boolean = false;


  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isLoadingUser().subscribe(loading => {
      this.loadingUser = loading;
    });

    this.authService.getCurrentUser().subscribe(user => {
      this.userRole = user ? user.role : null;
      if (user) {
        this.userStatut = user.statut;
        if (user.statut === 'en_attente') {
          this.statutMessage = "Votre compte est en attente de validation par l'administrateur";
        } else if (user.statut === 'inactif') {
          this.statutMessage = "Votre compte a été désactivé. Contactez l'administrateur.";
        } else {
          this.statutMessage = null; // Compte actif, accès normal
        }
      }
    });

    const savedSection = localStorage.getItem('activeDashboardSection') as 'formations' | 'reservations' | 'utilisateurs' | null;
    if (savedSection) {
      this.activeSection = savedSection;
    }
  }

  setActiveSection(section: 'formations' | 'reservations' | 'utilisateurs'): void {
    this.activeSection = section;
    localStorage.setItem('activeDashboardSection', section);
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

   toggleEditProfile() {
    this.showEditProfile = !this.showEditProfile;
  }

  


}
