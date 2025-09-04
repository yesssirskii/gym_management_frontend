import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

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
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-user-profile-dialog',
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
    DropdownModule,
    DividerModule,
    DialogModule,
    TabViewModule,
    PasswordModule,
    InputTextModule,
    InputTextareaModule
  ],
  templateUrl: './user-profile-dialog.component.html',
  styleUrl: './user-profile-dialog.component.css'
})

export class UserProfileDialogComponent implements OnInit {
  @Input() visible = false;
  @Input() user: any = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  profileForm: FormGroup;
  passwordForm: FormGroup;
  loadingProfile = false;
  loadingPassword = false;
  activityLog: any[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      address: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    if (this.user) {
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phoneNumber: this.user.phoneNumber || '',
        address: this.user.address || ''
      });
      
      // Load activity log (mock data for now)
      this.activityLog = [
        { date: new Date(), action: 'Login', details: 'Successful login' },
        { date: new Date(Date.now() - 86400000), action: 'Profile Update', details: 'Updated contact information' }
      ];
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    
    return null;
  }

  updateProfile() {
    if (this.profileForm.valid && this.user) {
      this.loadingProfile = true;
      
      this.userService.updateUser(this.user.id, this.profileForm.value).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('COMMON.SUCCESS'),
            detail: this.translate.instant('PROFILE.UPDATE_SUCCESS')
          });
          
          this.profileForm.markAsPristine();
          this.loadingProfile = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('COMMON.ERROR'),
            detail: this.translate.instant('PROFILE.UPDATE_ERROR')
          });
          this.loadingProfile = false;
        }
      });
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      this.loadingPassword = true;
      
      // API call to change password would go here
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('COMMON.SUCCESS'),
          detail: this.translate.instant('PROFILE.PASSWORD_CHANGE_SUCCESS')
        });
        this.passwordForm.reset();
        this.loadingPassword = false;
      }, 1000);
    }
  }

  onDialogHide() {
    this.visibleChange.emit(false);
  }
}