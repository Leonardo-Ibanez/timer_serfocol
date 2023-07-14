import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module'; // Asegúrate de importar correctamente el módulo MaterialModule
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    AppRoutingModule ///////////////nuevo
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
