import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
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
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-update-user-dialog',
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
    CalendarModule
  ],
  templateUrl: './update-user-dialog.component.html',
  styleUrl: './update-user-dialog.component.css'
})

export class UpdateUserDialogComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() member: any = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() memberUpdated = new EventEmitter<void>();

  memberForm!: FormGroup;
  loading = false;
  showPasswordFields = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    if (this.member) {
      this.populateForm();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['member'] && this.member) {
      this.populateForm();
    }
  }

  initializeForm() {
    this.memberForm = this.fb.group({
      membershipNumber: [{value: '', disabled: true}],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: [''],
      dateOfBirth: ['', Validators.required],
      address: [''],
      isActive: [true],
      
      // Medical fields
      emergencyContactName: [''],
      emergencyContactPhone: [''],
      height: [null],
      weight: [null],
      medicalNotes: [''],
      fitnessGoals: [''],
      
      // Password fields
      changePassword: [false],
      newPassword: [''],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  populateForm() {
    if (this.member && this.memberForm) {
      // Convert date string to Date object if needed
      let dateOfBirth = this.member.dateOfBirth;
      if (typeof dateOfBirth === 'string') {
        dateOfBirth = new Date(dateOfBirth);
      }

      this.memberForm.patchValue({
        membershipNumber: this.member.membershipNumber,
        username: this.member.username,
        email: this.member.email,
        firstName: this.member.firstName,
        lastName: this.member.lastName,
        phoneNumber: this.member.phoneNumber,
        dateOfBirth: dateOfBirth,
        address: this.member.address,
        isActive: this.member.isActive !== undefined ? this.member.isActive : true,
        emergencyContactName: this.member.emergencyContactName,
        emergencyContactPhone: this.member.emergencyContactPhone,
        height: this.member.height,
        weight: this.member.weight,
        medicalNotes: this.member.medicalNotes,
        fitnessGoals: this.member.fitnessGoals,
        changePassword: false,
        newPassword: '',
        confirmPassword: ''
      });
    }
  }

  onChangePasswordToggle() {
    this.showPasswordFields = this.memberForm.get('changePassword')?.value;
    
    if (this.showPasswordFields) {
      this.memberForm.get('newPassword')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.memberForm.get('confirmPassword')?.setValidators([Validators.required]);
    } else {
      this.memberForm.get('newPassword')?.clearValidators();
      this.memberForm.get('confirmPassword')?.clearValidators();
      this.memberForm.get('newPassword')?.setValue('');
      this.memberForm.get('confirmPassword')?.setValue('');
    }
    
    this.memberForm.get('newPassword')?.updateValueAndValidity();
    this.memberForm.get('confirmPassword')?.updateValueAndValidity();
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const changePassword = formGroup.get('changePassword')?.value;
    if (!changePassword) {
      return null;
    }

    const password = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit() {
    if (this.memberForm.valid && this.member) {
      this.loading = true;
      
      const formData = { ...this.memberForm.value };
      
      // Remove password fields if not changing password
      if (!formData.changePassword) {
        delete formData.newPassword;
        delete formData.confirmPassword;
      }
      delete formData.changePassword;
      
      // Format date if needed
      if (formData.dateOfBirth instanceof Date) {
        formData.dateOfBirth = formData.dateOfBirth.toISOString().split('T')[0];
      }
      
      this.userService.updateUser(this.member.id, formData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('COMMON.SUCCESS'),
            detail: this.translate.instant('MEMBERS.UPDATE_SUCCESS')
          });
          this.memberUpdated.emit();
          this.onCancel();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('COMMON.ERROR'),
            detail: this.translate.instant('MEMBERS.UPDATE_ERROR')
          });
          this.loading = false;
        }
      });
    }
  }

  onCancel() {
    this.resetForm();
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onDialogHide() {
    this.resetForm();
    this.visibleChange.emit(false);
  }

  resetForm() {
    this.showPasswordFields = false;
    this.loading = false;
    if (this.member) {
      this.populateForm();
    } else {
      this.memberForm.reset({
        isActive: true,
        changePassword: false
      });
    }
  }
}
