import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
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
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-create-user-dialog',
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
    DialogModule,
    DropdownModule,
    PasswordModule,
    InputTextModule,
    CalendarModule,
    InputNumberModule,
    InputTextareaModule,
    CheckboxModule
  ],
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.css'
})

export class CreateUserDialogComponent implements OnInit {
  @Input() visible = false;
  @Input() userType = '';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() userCreated = new EventEmitter<void>();

  userForm!: FormGroup;
  loading = false;
  selectedUserType = '';

  userTypeOptions = [
    { label: 'Member', value: 'Member' },
    { label: 'Trainer', value: 'Trainer' },
    { label: 'Personnel', value: 'Personnel' }
  ];

  subscriptionTypeOptions = [
    { label: 'Daily', value: 1 },
    { label: 'Monthly', value: 2 },
    { label: 'Yearly', value: 3 }
  ];

  specializationOptions = [
    { label: 'Bodybuilding', value: 1 },
    { label: 'Nutritionist', value: 2 },
    { label: 'Cardio', value: 3 },
    { label: 'Yoga', value: 4 }
  ];

  personnelRoleOptions = [
    { label: 'Owner', value: 1 },
    { label: 'Manager', value: 2 },
    { label: 'Receptionist', value: 3 },
    { label: 'Cleaner', value: 4 },
    { label: 'Maintenance', value: 5 }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private translate: TranslateService,
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    if (this.userType) {
      this.selectedUserType = this.userType;
      this.userForm.patchValue({ userType: this.userType });
    }
  }

  initializeForm() {
    this.userForm = this.fb.group({
      userType: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: [''],
      dateOfBirth: ['', Validators.required],
      
      // Member fields
      emergencyContactName: [''],
      emergencyContactPhone: [''],
      height: [''],
      weight: [''],
      medicalNotes: [''],
      fitnessGoals: [''],
      subscriptionType: [''],
      subscriptionStartDate: [new Date()],
      autoRenewal: [false],
      
      // Trainer fields
      specialization: [''],
      yearsOfExperience: [''],
      hourlyRate: [''],
      certifications: [''],
      bio: [''],
      
      // Personnel fields
      role: [''],
      employeeId: [''],
      salary: [''],
      jobDescription: ['']
    });
  }

  onUserTypeChange() {
    this.selectedUserType = this.userForm.get('userType')?.value;
    this.updateValidators();
  }

  updateValidators() {
    // Clear all conditional validators
    Object.keys(this.userForm.controls).forEach(key => {
      if (!['userType', 'username', 'email', 'password', 'firstName', 'lastName', 'dateOfBirth'].includes(key)) {
        this.userForm.get(key)?.clearValidators();
      }
    });

    // Add validators based on user type
    if (this.selectedUserType === 'Trainer') {
      this.userForm.get('specialization')?.setValidators([Validators.required]);
      this.userForm.get('yearsOfExperience')?.setValidators([Validators.required]);
      this.userForm.get('hourlyRate')?.setValidators([Validators.required]);
    } else if (this.selectedUserType === 'Personnel') {
      this.userForm.get('role')?.setValidators([Validators.required]);
      this.userForm.get('employeeId')?.setValidators([Validators.required]);
      this.userForm.get('salary')?.setValidators([Validators.required]);
    }

    // Update form validation
    this.userForm.updateValueAndValidity();
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.loading = true;
      const formData = this.userForm.value;
      
      this.userService.createUser(formData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('COMMON.SUCCESS'),
            detail: this.translate.instant('USERS.CREATE_SUCCESS')
          });
          this.userCreated.emit();
          this.resetForm();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('COMMON.ERROR'),
            detail: this.translate.instant('USERS.CREATE_ERROR')
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
    this.userForm.reset();
    this.selectedUserType = '';
    this.loading = false;
    if (this.userType) {
      this.selectedUserType = this.userType;
      this.userForm.patchValue({ userType: this.userType });
    }
  }
}
