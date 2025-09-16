import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
    TranslateModule,
    ReactiveFormsModule,
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private translate: TranslateService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.translate.setDefaultLang('hr');
    this.translate.use('hr');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('LOGIN.SUCCESS'),
            detail: this.translate.instant('LOGIN.WELCOME', { name: response.user.firstName })
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('LOGIN.ERROR'),
            detail: this.translate.instant('LOGIN.INVALID_CREDENTIALS')
          });
          this.loading = false;
        }
      });
    }
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }
}
