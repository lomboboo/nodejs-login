import {Injectable} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AuthenticationService {

  private registerUrl = '/user';

  constructor( private _http: Http ) {

  }

  test(body: Object): Observable<any> {
    let bodyString = JSON.stringify(body);
    let headers = new Headers( { 'Content-Type': 'application/json' } );
    let options = new RequestOptions({ headers: headers });

    return this._http.post( this.registerUrl, body, options )
      .map( (res: Response) => res.json() )
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }
}
