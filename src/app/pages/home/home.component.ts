import { Component } from '@angular/core';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  currentUser$ = this.authService.currentUser$;

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.signOut();
  }
}
