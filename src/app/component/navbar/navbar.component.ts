import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']  // ✅ Fix styleUrls
})
export class NavbarComponent {
  constructor(private router: Router, private authService: AuthService) {} // ✅ Use AuthService

  goToForm() {
    this.router.navigate(['/form']);
  }

  logout() {
    this.authService.logout();  // ✅ Use AuthService
    this.router.navigate(['/']); 
  }
}
