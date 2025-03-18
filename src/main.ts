import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './app/interceptor/auth-interceptor.service';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ]
}).catch(err => console.error(err));
 