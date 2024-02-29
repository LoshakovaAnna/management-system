import {Injectable} from '@angular/core';
import {Observable, Subject, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';

import {environment} from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string = environment.apiUrl;

  private authToken: Subject<string> = new Subject();

  constructor(private http: HttpClient) {
  }

  login(body: any): Observable<any> {
    return this.http.post<string>(`${this.url}/api/v1/login`, body)
      .pipe(
        tap(token => {
          this.authToken.next(token)
        })
      );
  }

  getToken(): Observable<string> {
    return this.authToken;
  }
}
