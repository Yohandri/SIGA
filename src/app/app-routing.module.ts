import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, TypeUserGuard } from './auth-guard.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PantallaComponent } from './pantalla/pantalla.component';
import { PacientesComponent } from './pacientes/pacientes.component';
import { ContentColasComponent } from './colas/content-colas/content-colas.component';
import {SingleTableComponent} from './colas/single-table/single-table.component';
import { SingleFormComponent } from "./colas/single-form/single-form.component";

 
const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '',  component: LoginComponent },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'Admin-ERIS',  component: ContentColasComponent, canActivate:[AuthGuard,TypeUserGuard],
  children: [
    { path: ':entityname',  component: SingleTableComponent },
    { path: ':entityname/:id',  component: SingleFormComponent }   
 ]  },
 //{ path: 'Pacientes',  component: PacientesComponent },
  { path: 'Admin-COLAS',  component: ContentColasComponent, canActivate:[AuthGuard,TypeUserGuard],
 	children: [
     { path: ':entityname',  component: SingleTableComponent },
     { path: ':entityname/:id',  component: SingleFormComponent }   
  ]  },
  { path: 'Admin-global',  component: ContentColasComponent, canActivate:[AuthGuard,TypeUserGuard],
  children: [
    { path: ':entityname',  component: SingleTableComponent },
    { path: ':entityname/:id',  component: SingleFormComponent }   
 ]  },

  { path: '**' ,redirectTo: ''}
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}