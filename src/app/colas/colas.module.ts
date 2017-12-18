import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { ContentColasComponent } from './content-colas/content-colas.component';
import { SingleTableComponent } from './single-table/single-table.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserComponent } from './user/user.component';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  declarations: [ContentColasComponent, SingleTableComponent, UserProfileComponent, UserComponent],
  exports: [
    ContentColasComponent
  ]
})
export class ColasModule { }
