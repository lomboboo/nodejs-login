import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent }  from './app.component';
import {PanelComponent} from "./panel/panel.component";
import {RegisterComponent} from "./register/register.component";

@NgModule({
  imports:      [
    BrowserModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot([
      { path: 'register', component: RegisterComponent},
      { path: '**', redirectTo: '', pathMatch: 'full'}
    ]),
    HttpModule,
    FormsModule
  ],
  declarations: [ AppComponent, PanelComponent, RegisterComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
