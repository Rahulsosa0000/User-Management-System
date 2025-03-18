import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { FormComponent } from './component/form/form.component';
import { AuthGuard } from './auth/auth.service';
import { EditpageComponent } from './component/editpage/editpage.component';


export const routes: Routes = [
  { path: '', component: LoginComponent },  // Default Login Page
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },

  { 
    path: 'edit-user/:id', 
    component: EditpageComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'form', 
    component: FormComponent, 
  },
  { path: '**', redirectTo: '' }  // Invalid URL pe redirect
];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
//     canActivate: [AuthGuard] 
