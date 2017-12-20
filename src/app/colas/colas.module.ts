import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { ContentColasComponent } from './content-colas/content-colas.component';
import { SingleTableComponent } from './single-table/single-table.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserComponent } from './user/user.component';
import { SingleFormComponent } from './single-form/single-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ContentColasComponent, SingleTableComponent, UserProfileComponent, UserComponent, SingleFormComponent],
  exports: [
    ContentColasComponent
  ]
})
export class ColasModule { }
