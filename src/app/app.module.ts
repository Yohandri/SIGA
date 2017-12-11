import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { Global } from './global';
import { HttpModule }    from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { httpService } from './http.service';
import { AuthGuard, TypeUserGuard} from './auth-guard.service';
import { AuthService }      from './auth.service';
import { FilterPipePipe, FullTextSearchPipe } from './filter-pipe.pipe';
import { SelectModule } from 'ng2-select';
import {NgxMaskModule} from 'ngx-mask';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppErisComponent } from './app-eris/app-eris.component';
import { PantallaComponent } from './pantalla/pantalla.component';
import { PacientesComponent } from './pacientes/pacientes.component';
import { YoTableComponent } from './yo-table/yo-table.component';
import { HistoriaClinicaComponent } from './historia-clinica/historia-clinica.component';
import { FormTriajeComponent } from './form-triaje/form-triaje.component';
import { FormAdmisionComponent } from './form-admision/form-admision.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AppErisComponent,
    FilterPipePipe,
    FullTextSearchPipe,
    PantallaComponent,
    PacientesComponent,
    YoTableComponent,
    HistoriaClinicaComponent,
    FormTriajeComponent,
    FormAdmisionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
  httpService,
    Global,
    AuthGuard,
    TypeUserGuard,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
