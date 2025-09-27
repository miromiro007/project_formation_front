import { Component,OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {
  userRole: string | null = null;

  currentView: 'list' | 'create' | 'edit' = 'list';
  selectedFormationId: string | null = null;
  startEdit(id: string) {
    this.selectedFormationId = id;
    this.currentView = 'edit';
  }
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.userRole = user ? user.role : null;
    });
  }
}
