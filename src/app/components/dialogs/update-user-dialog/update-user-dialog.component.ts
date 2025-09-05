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
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';

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
    CalendarModule,
    InputNumberModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule
],
  templateUrl: './update-user-dialog.component.html',
  styleUrl: './update-user-dialog.component.css'
})

export class UpdateUserDialogComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() member: any = null;
  @Input() userType = '';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() memberUpdated = new EventEmitter<void>();

  memberForm!: FormGroup;
  loading = false;
  selectedUserType = '';

    subscriptionTypeOptions = [
    { label: 'Daily', value: 1 },
    { label: 'Monthly', value: 2 },
    { label: 'Yearly', value: 3 }
  ];

  specializationOptions = [
    { label: 'Bodybuilding', value: 'Bodybuilding' },
    { label: 'Nutritionist', value: 'Nutritionist' },
    { label: 'Cardio', value: 'Cardio' },
    { label: 'Yoga', value: 'Yoga' }
  ];

  personnelRoleOptions = [
    { label: 'Owner', value: 'Owner' },
    { label: 'Manager', value: 'Manager' },
    { label: 'Receptionist', value: 'Receptionist' },
    { label: 'Cleaner', value: 'Cleaner' },
    { label: 'Maintenance', value: 'Maintenance' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    if (this.userType) {
      this.selectedUserType = this.userType;
      this.memberForm.patchValue({ userType: this.userType });
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
      oib: ['', [Validators.required]],
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

      // Trainer fields
      specialization: [''],
      yearsOfExperience: [''],
      hourlyRate: [''],
      certifications: [''],
      bio: [''],
      
      // Personnel fields
      role: [''],
      salary: [''],
      jobDescription: [''],
    
    });
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
        oib: this.member.oib,
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

        specialization: this.member.specialization,
        yearsOfExperience: this.member.yearsOfExperience,
        hourlyRate: this.member.hourlyRate,
        certifications: this.member.certifications,
        bio: this.member.bio,

        role: this.member.role,
        salary: this.member.salary,
        jobDescription: this.member.jobDescription
      });
    }
  }

  onSubmit() {
    if (this.memberForm.valid && this.member) {
      this.loading = true;
      
      const formData = { ...this.memberForm.value };
      
      if (formData.dateOfBirth instanceof Date) {
        formData.dateOfBirth = formData.dateOfBirth.toISOString().split('T')[0];
      }
      
      this.userService.updateUser(this.member.id, formData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('COMMON.SUCCESS'),
            detail: this.translate.instant('USERS.Update_Success')
          });
          this.memberUpdated.emit();
          this.onCancel();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('COMMON.ERROR'),
            detail: this.translate.instant('USERS.Update_Error')
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
