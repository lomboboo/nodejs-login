import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../authentication/authentication.service';

@Component({
  selector: 'testme-panel',
  moduleId: module.id,
  templateUrl: './panel.component.html',
})
export class PanelComponent implements OnInit {
  loginBtn: string = 'Login';
  registerBtn: string = 'Register';
  test: any[];

  constructor(private _authenticationService: AuthenticationService) {

  }

  showTest(): void {
    console.log("Test mutherfucker...");
    let email = 'lomboboo1@gmail.com';
    let password = '123456R';
    let firstName = "Roman1";
    let lastName = "Prokopchuk1";
    let userData = {email, password, firstName, lastName};
    this._authenticationService.test(userData)
      .subscribe(user => console.log(user), err => console.log(err));

  }

  ngOnInit() {

  }
}
