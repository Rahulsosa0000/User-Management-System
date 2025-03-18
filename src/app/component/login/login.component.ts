import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,  
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      alert('Please fill in all fields!');
      return;
    }
  
    const { username, password } = this.loginForm.value;
  
    this.authService.login(username, password).subscribe(
      (response: any) => {
        console.log('Login Response:', response);
  
        if (response.accessToken && response.refreshToken) {
          localStorage.setItem('JWT', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
  
          console.log('Stored Access Token:', response.accessToken);
          console.log('Stored Refresh Token:', response.refreshToken);
  
          alert('Login Successful! Redirecting...');
          this.router.navigateByUrl('/dashboard');
        } else {
          alert('Login failed. Invalid response from server.');
        }
      },
      (error) => {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials.');
      }
    );
  }
}  