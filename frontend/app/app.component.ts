import { Component } from '@angular/core';
import { AuthenticationService } from './authentication/authentication.service';

@Component({
    selector: 'testme-app',
    moduleId: module.id,
    templateUrl: './app.component.html',
    providers: [ AuthenticationService ]
})
export class AppComponent {
    me: String = "Roman";
}
