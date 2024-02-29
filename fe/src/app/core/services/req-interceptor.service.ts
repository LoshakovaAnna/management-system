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

import {NotificationService} from '@services/notification.service';
import {UrlPageEnum} from '@core/enums';
import {AuthService} from '@services/auth.service';


@Injectable()
export class ReqInterceptor implements HttpInterceptor {
  authToken = '';

  constructor(private router: Router,
              private notificationService: NotificationService,
              private authService: AuthService) {
    this.authService.getToken()
      .subscribe(token => {
        this.authToken = token;
      });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `${this.authToken}`
      }
    });

    return next.handle(req)
      .pipe(
        tap(
          () => {
          },
          (err: any) => {
            if (err && err.status === 403) {
              this.router.navigateByUrl(UrlPageEnum.login);
            }
            if (err instanceof HttpErrorResponse) {
              this.notificationService.showErrorNotification(err.error.message || err.message);
            }
          }));
  }
}
