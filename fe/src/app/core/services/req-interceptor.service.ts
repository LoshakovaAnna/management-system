import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

// import {VDMA_USER} from '../models';

@Injectable()
export class ReqInterceptor implements HttpInterceptor {

  constructor(private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {'Content-Type': 'application/json'}
    });
    // req = req.clone({withCredentials: true});

    return next.handle(req)
     /* .pipe(tap(() => {
      },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status !== 401 && !req.url.includes('GetCurrentUser')) {
            return;
          }
          if (!window.location.href.includes('login')) {
            VDMA_USER.name = null;
            this.router.navigate(['login'], {
              state: {
                previousUrl: window.location.hash.substr(2)
              }
            });
          }
        }
      }));*/
  }
}
