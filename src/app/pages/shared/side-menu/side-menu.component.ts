import { Component } from '@angular/core';
import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  currentUser$ = this.authService.currentUser$;
  isOpen = false;

  constructor(private authService: AuthService) {}

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  closeMenu(): void {
    this.isOpen = false;
  }

  logout(): void {
    this.authService.signOut();
  }
}
