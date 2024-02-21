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
import {NotificationService} from "@services/notification.service";


@Injectable()
export class ReqInterceptor implements HttpInterceptor {

  constructor(private router: Router,
              private notificationService: NotificationService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {'Content-Type': 'application/json'}
    });
    // req = req.clone({withCredentials: true});

    return next.handle(req)
      .pipe(tap(() => {
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {

            console.log(err)
            this.notificationService.showErrorNotification(err.error.message || err.message);
          }
        }));
  }
}
