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

  paymentMethodOptions = [
    { label: 'Credit card', value: 1 },
    { label: 'Cash', value: 2 },
    { label: 'MultiSport', value: 3 },
  ];

  genderOptions = [
    { label: 'Male', value: 1 },
    { label: 'Female', value: 2 },
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
      this.updateValidators();
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
      oib: ['', [Validators.required, Validators.minLength(11)]],
      gender: ['', [Validators.required]],
      address: [''],
      
      // Member
      emergencyContactName: [''],
      emergencyContactPhone: [''],
      height: [''],
      weight: [''],
      medicalNotes: [''],
      fitnessGoals: [''],

      subscriptionType: ['', Validators.required],
      subscriptionStartDate: [{value: new Date(), disabled: true}],
      paymentMethod: ['', Validators.required],
      autoRenewal: [false],
      
      // Trainer
      specialization: [''],
      yearsOfExperience: [''],
      hourlyRate: [''],
      certifications: [''],
      bio: [''],
      
      // Personnel
      role: [''],
      salary: [''],
      jobDescription: ['']
    });
  }

  onUserTypeChange() {
    this.selectedUserType = this.userForm.get('userType')?.value;
    this.updateValidators();
  }

  updateValidators() {
    const memberFields = ['emergencyContactName', 'emergencyContactPhone', 'height', 'weight', 'medicalNotes', 'fitnessGoals', 'subscriptionType', 'subscriptionStartDate', 'autoRenewal'];
    const trainerFields = ['specialization', 'yearsOfExperience', 'hourlyRate', 'certifications', 'bio'];
    const personnelFields = ['role', 'salary', 'jobDescription'];
    
    const allConditionalFields = [...memberFields, ...trainerFields, ...personnelFields];

    allConditionalFields.forEach(fieldName => {
      const control = this.userForm.get(fieldName);

      if (control) {
        control.clearValidators();
        control.setErrors(null);
        control.updateValueAndValidity({ emitEvent: false });
      }
    });

    if (this.selectedUserType === 'Trainer') {
      const specializationControl = this.userForm.get('specialization');
      const experienceControl = this.userForm.get('yearsOfExperience');
      const rateControl = this.userForm.get('hourlyRate');
      
      if (specializationControl) {
        specializationControl.setValidators([Validators.required]);
        specializationControl.updateValueAndValidity({ emitEvent: false });
      }
      if (experienceControl) {
        experienceControl.setValidators([Validators.required, Validators.min(0)]);
        experienceControl.updateValueAndValidity({ emitEvent: false });
      }
      if (rateControl) {
        rateControl.setValidators([Validators.required, Validators.min(0)]);
        rateControl.updateValueAndValidity({ emitEvent: false });
      }
    } 
    else if (this.selectedUserType === 'Personnel') {
      const roleControl = this.userForm.get('role');
      const salaryControl = this.userForm.get('salary');
      
      if (roleControl) {
        roleControl.setValidators([Validators.required]);
        roleControl.updateValueAndValidity({ emitEvent: false });
      }
      if (salaryControl) {
        salaryControl.setValidators([Validators.required, Validators.min(0)]);
        salaryControl.updateValueAndValidity({ emitEvent: false });
      }
    } 
    else if (this.selectedUserType === 'Member') {
      const subscriptionTypeControl = this.userForm.get('subscriptionType');
      
      if (subscriptionTypeControl) {
        subscriptionTypeControl.setValidators([Validators.required]);
        subscriptionTypeControl.updateValueAndValidity({ emitEvent: false });
      }
    }

    this.userForm.updateValueAndValidity();
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.loading = true;

      const formData = { ...this.userForm.value };

      if (formData.dateOfBirth) {
        const date = new Date(formData.dateOfBirth);
        formData.dateOfBirth = date.toISOString().split('T')[0];
      }
    
      if (formData.subscriptionStartDate) {
        const subDate = new Date(formData.subscriptionStartDate);
        formData.subscriptionStartDate = subDate.toISOString();
      }
      
      const requestData = {
        // Basic user fields - mapped to PascalCase
        Username: formData.username,
        Email: formData.email,
        Password: formData.password,
        FirstName: formData.firstName,
        LastName: formData.lastName,
        PhoneNumber: formData.phoneNumber,
        Oib: formData.oib,
        DateOfBirth: formData.dateOfBirth,
        Address: formData.address || '',
        Gender: formData.gender,
        UserType: this.selectedUserType,
        
        // Member specific fields (only include if user type is Member)
        ...(this.selectedUserType === 'Member' && {
          EmergencyContactName: formData.emergencyContactName || '',
          EmergencyContactPhone: formData.emergencyContactPhone || '',
          Height: formData.height || null,
          Weight: formData.weight || null,
          MedicalNotes: formData.medicalNotes || '',
          FitnessGoals: formData.fitnessGoals || '',
          SubscriptionType: formData.subscriptionType,
          
          // Subscription object for Members
          Subscription: {
            Type: formData.subscriptionType,
            StartDate: formData.subscriptionStartDate || new Date().toISOString(),
            PaymentMethod: formData.paymentMethod,
            AutoRenewal: formData.autoRenewal || false,
            IsCancelled: false,
            CancelledAt: null
          }
        }),
        
        // Trainer specific fields (only include if user type is Trainer)
        ...(this.selectedUserType === 'Trainer' && {
          Specialization: formData.specialization || '',
          YearsOfExperience: formData.yearsOfExperience || 0,
          HourlyRate: formData.hourlyRate || 0,
          Certifications: formData.certifications || '',
          Bio: formData.bio || '',
          SubscriptionType: formData.subscriptionType
        }),
        
        // Personnel specific fields (only include if user type is Personnel)
        ...(this.selectedUserType === 'Personnel' && {
          Role: formData.role,
          Salary: formData.salary || 0,
          JobDescription: formData.jobDescription || '',
          SubscriptionType: formData.subscriptionType
        })
      };
      
      this.userService.createUser(requestData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('COMMON.SUCCESS'),
            detail: this.translate.instant('USERS.Create_Success')
          });

          this.userCreated.emit();
          this.resetForm();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('COMMON.ERROR'),
            detail: this.translate.instant('USERS.Create_Error')
          });

          this.loading = false;
        }
      });
    }
    else {
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);

        if (control) {
          control.markAsTouched();
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
    
    this.userForm.patchValue({
      subscriptionStartDate: new Date(),
      autoRenewal: false
    });
    
    if (this.userType) {
      this.selectedUserType = this.userType;
      this.userForm.patchValue({ userType: this.userType });
      this.updateValidators();
    }
  }
}