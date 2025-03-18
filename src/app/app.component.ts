import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "./component/navbar/navbar.component";
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet,
    ReactiveFormsModule,
    CommonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'userform';

  constructor(private router: Router) {}

  //  Hide navbar on the login page
  shouldShowNavbar(): boolean {
    return this.router.url !== '/';  // Hide navbar on "/login" route
  }

  shouldShowForm(): boolean {
    return this.router.url !== '/form';  // Hide navbar on "/form" route
  }
}
