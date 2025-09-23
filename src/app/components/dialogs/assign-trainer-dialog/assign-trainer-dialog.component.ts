import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { TrainerService } from '../../../services/trainer-member.service';
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
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-assign-trainer-dialog',
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
    InputTextareaModule,
    InputNumberModule,
    CalendarModule
  ],
  templateUrl: './assign-trainer-dialog.component.html',
  styleUrl: './assign-trainer-dialog.component.css'
})

export class AssignTrainerDialogComponent implements OnInit {
  @Input() visible = false;
  @Input() selectedMember: any = null;
  @Input() selectedTrainer: any = null;
  @Input() mode: 'assignTrainer' | 'addMember' = 'assignTrainer';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() trainerAssigned = new EventEmitter<void>();
  @Output() memberAdded = new EventEmitter<void>();

  assignmentForm: FormGroup;
  loading = false;
  availableTrainers: any[] = [];
  availableMembers: any[] = [];
  selectedTrainerDetails: any = null;

  get dialogTitle(): string {
    return this.mode === 'assignTrainer' 
      ? this.translate.instant('MEMBERS.Assign_Trainer')
      : this.translate.instant('TRAINERS.Assign_Member.Title');
  }

  constructor(
    private fb: FormBuilder,
    private trainerService: TrainerService,
    private userService: UserService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {
    this.assignmentForm = this.fb.group({
      trainerId: [''],
      memberId: [''],
      sessionsPerWeek: [3, [Validators.required, Validators.min(1), Validators.max(7)]],
      sessionRate: [50, [Validators.required, Validators.min(0)]],
      startDate: [new Date(), Validators.required],
      trainingGoals: [''],
      notes: ['']
    });
  }

  ngOnInit() {
    if (this.mode === 'assignTrainer') {
      this.loadAvailableTrainers();
      this.assignmentForm.get('trainerId')?.setValidators([Validators.required]);
    }
    else {
      this.loadAvailableMembers();
      this.assignmentForm.get('memberId')?.setValidators([Validators.required]);

      if (this.selectedTrainer) {
        this.assignmentForm.patchValue({ 
          trainerId: this.selectedTrainer.id,
          sessionRate: this.selectedTrainer.hourlyRate 
        });
      }
    }
    this.assignmentForm.updateValueAndValidity();
  }

  loadAvailableTrainers() {
    this.trainerService.getTrainers().subscribe({
      next: (trainers) => {
        this.availableTrainers = trainers
          .filter(t => t.isAvailable)
          .map(t => ({
            ...t,
            displayName: `${t.firstName} ${t.lastName} - ${t.specialization}`
          }));
      }
    });
  }

  loadAvailableMembers() {
    this.userService.getMembers().subscribe({
      next: (members) => {
        this.availableMembers = members
          .filter(m => m.isActive && !m.hasTrainer)
          .map(m => ({
            ...m,
            displayName: `${m.firstName} ${m.lastName} - ${m.membershipNumber}`
          }));
      }
    });
  }

  onTrainerSelect() {
    const trainerId = this.assignmentForm.get('trainerId')?.value;
    this.selectedTrainerDetails = this.availableTrainers.find(t => t.id === trainerId);
    if (this.selectedTrainerDetails) {
      this.assignmentForm.patchValue({ 
        sessionRate: this.selectedTrainerDetails.hourlyRate 
      });
    }
  }

  onSubmit() {
    if (this.assignmentForm.valid) {
      this.loading = true;
      const formData = this.assignmentForm.value;

      if (this.mode === 'assignTrainer') {
        formData.memberId = this.selectedMember.id;
      } else {
        formData.trainerId = this.selectedTrainer.id;
      }

      this.trainerService.assignMemberToTrainer(formData.trainerId, formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('COMMON.SUCCESS'),
            detail: this.translate.instant(
              this.mode === 'assignTrainer' ? 'TRAINERS.ASSIGN_SUCCESS' : 'TRAINERS.Assign_Member.Success'
            )
          });
          
          if (this.mode === 'assignTrainer') {
            this.trainerAssigned.emit();
          } else {
            this.memberAdded.emit();
          }
          
          this.resetForm();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('COMMON.ERROR'),
            detail: this.translate.instant(
              this.mode === 'assignTrainer' ? 'TRAINERS.ASSIGN_ERROR' : 'TRAINERS.Assign_Member.Error'
            )
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
    this.assignmentForm.reset({
      sessionsPerWeek: 3,
      sessionRate: 50,
      startDate: new Date()
    });
    this.loading = false;
    this.selectedTrainerDetails = null;
  }
}

