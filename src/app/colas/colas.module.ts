import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { ContentColasComponent } from './content-colas/content-colas.component';
import { SingleTableComponent } from './single-table/single-table.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserComponent } from './user/user.component';
import { SingleFormComponent } from './single-form/single-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';
import { PipesPipe } from './pipes.pipe';
import { DirectivesDirective, CedulaDirective } from './directives.directive';
import {CustomFormsModule } from 'ng2-validation';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    CustomFormsModule
  ],
  declarations: [ContentColasComponent, SingleTableComponent, UserProfileComponent, UserComponent, SingleFormComponent, PipesPipe, DirectivesDirective, CedulaDirective],
  exports: [
    ContentColasComponent
  ]
})
export class ColasModule { }
