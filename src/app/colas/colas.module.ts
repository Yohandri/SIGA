import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { ContentColasComponent } from './content-colas/content-colas.component';
import { SingleTableComponent } from './single-table/single-table.component';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  declarations: [ContentColasComponent, SingleTableComponent],
  exports: [
    ContentColasComponent
  ]
})
export class ColasModule { }
