import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  @Input() user!: User;
  copied = false;

  fermer() {
    const event = new CustomEvent('close');
    window.dispatchEvent(event);
  }

  copierId(id: string) {
    navigator.clipboard.writeText(id);
    this.copied = true;
    setTimeout(() => (this.copied = false), 1500);
  }
}
