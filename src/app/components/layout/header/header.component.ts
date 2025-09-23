import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, UserInfoDto } from '../../../services/auth.service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { UserProfileDialogComponent } from '../../dialogs/user-profile-dialog/user-profile-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ButtonModule, 
    CardModule, 
    TagModule, 
    TableModule, 
    ProgressSpinnerModule, 
    TranslateModule, 
    TooltipModule, 
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    UserProfileDialogComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  userProfileVisible = false;
  currentUser: UserInfoDto | null = null;
  currentLanguage = 'en';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.currentLanguage = this.translate.currentLang || this.translate.defaultLang || 'en';
    
    this.translate.onLangChange.subscribe(event => {
      this.currentLanguage = event.lang;
    });
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLanguage = lang;
    
    localStorage.setItem('selectedLanguage', lang);
    
    this.messageService.add({
      severity: 'info',
      detail: this.translate.instant('HEADER.Language_Changed_To', { language: lang.toUpperCase() }),
      life: 1000
    });
  }

  showUserProfile() {
    this.userProfileVisible = true;
  }

  logout() {
    this.confirmationService.confirm({
      message: this.translate.instant('HEADER.LOGOUT_CONFIRM'),
      header: this.translate.instant('HEADER.LOGOUT'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.authService.logout().subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: this.translate.instant('HEADER.LOGOUT_SUCCESS'),
              detail: this.translate.instant('HEADER.LOGOUT_SUCCESS_DETAIL')
            });
            this.router.navigate(['/login']);
          },
          error: () => {
            // Even if logout fails, redirect to login
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }
}
