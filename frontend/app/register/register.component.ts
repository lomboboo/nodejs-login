import { Component } from '@angular/core';
import { RegisterModel } from './register.model';

@Component({
  moduleId: module.id,
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  model = new RegisterModel();

}
