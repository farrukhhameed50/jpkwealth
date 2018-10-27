import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

export class Auth{
  user: string;
  loggedIn: boolean;
  token: string;
  constructor(user: string, loggedIn: boolean, token: string){
    this.user = user;
    this.loggedIn = loggedIn;
    this.token = token;
  }
}

@Injectable()
export class AuthProvider {
  auth = null;

  constructor(public http: Http) {
    console.log('Hello AuthProvider Provider');
  }
  
  public login(creds){
    if (creds.user === null || creds.pass === null) {
      return Observable.throw("Please provide login info");
    } else {
      return Observable.create(observer => {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        // At this point make a request to your backend to make a real check!
        this.http.post('http://jpkwealth.net/api/login.php', "submit=signin&username=" + creds.user + "&password=" + creds.pass, options).map(res => res.json()).subscribe(data => {
          let access = (data.login == "success");
          this.auth = new Auth(data.username, true, data.token);
          observer.next(access);
          observer.complete();
        });
      });
    }
  }
  
  public getAuth() : Auth {
    return this.auth;
  }
  
  public logout() {
    return Observable.create(observer => {
      this.auth = null;
      observer.next(true);
      observer.complete();
    });
  }

}
