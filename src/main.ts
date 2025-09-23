import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { HttpClient } from '@angular/common/http';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { MessageService, ConfirmationService } from 'primeng/api';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes),
    MessageService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    ...TranslateModule.forRoot({
      defaultLanguage: 'hr',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }).providers!
  ]
});