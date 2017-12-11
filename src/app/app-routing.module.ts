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

 
const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '',  component: LoginComponent },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'Pantalla',  component: PantallaComponent },
  { path: 'Pacientes',  component: PacientesComponent },
  { path: 'COLAS',  component: ContentColasComponent,
  	children: [
      { path: 'single',  component: SingleTableComponent }
    ]  },

  { path: '**' ,redirectTo: ''}
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}