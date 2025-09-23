import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { TrainerService } from '../../../services/trainer-member.service';
import { AuthService } from '../../../services/auth.service';

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

import { CreateUserDialogComponent } from '../../dialogs/create-user-dialog/create-user-dialog.component';
import { UpdateUserDialogComponent } from '../../dialogs/update-user-dialog/update-user-dialog.component';

@Component({
  selector: 'app-trainers',
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

    CreateUserDialogComponent,
    UpdateUserDialogComponent
  ],
  templateUrl: './trainers.component.html',
  styleUrl: './trainers.component.css'
})

export class TrainersComponent implements OnInit {
  trainers: any[] = [];
  loading = false;
  createDialogVisible = false;
  canEdit = false;

  editLoadingId: number | null = null;
  editDialogVisible = false;
  selectedTrainerDetails: any = null;

  constructor(
    private trainerService: TrainerService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
  ) {
    this.canEdit = this.authService.hasRole(['Owner', 'Manager', 'Receptionist', 'Trainer']);
  }

  ngOnInit() {
    this.loadTrainers();
  }

  loadTrainers() {
    this.loading = true;
    this.trainerService.getTrainers().subscribe({
      next: (data) => {
        this.trainers = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('COMMON.ERROR'),
          detail: this.translate.instant('TRAINERS.LOAD_ERROR')
        });
        this.loading = false;
      }
    });
  }

  viewTrainer(id: number) {
    this.router.navigate(['/trainers', id]);
  }

  editTrainer(trainer: any) {
    this.editLoadingId = trainer.id;
    
    this.trainerService.getTrainerById(trainer.id).subscribe({
      next: (fullTrainerData) => {
        this.selectedTrainerDetails = fullTrainerData;
        this.editDialogVisible = true;
        this.editLoadingId = null;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('COMMON.ERROR'),
          detail: this.translate.instant('MEMBERS.LOAD_DETAIL_ERROR')
        });
        this.editLoadingId = null;
      }
    });
  }

  showCreateDialog() {
    this.createDialogVisible = true;
  }

  deleteTrainer(trainer: any) {
    this.confirmationService.confirm({
      message: this.translate.instant('TRAINERS.DELETE_CONFIRM', { name: trainer.firstName + ' ' + trainer.lastName }),
      header: this.translate.instant('COMMON.DELETE'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Call delete trainer service
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('COMMON.SUCCESS'),
          detail: this.translate.instant('TRAINERS.DELETE_SUCCESS')
        });
        this.loadTrainers();
      }
    });
  }

  onUserCreated() {
    this.createDialogVisible = false;
    this.loadTrainers();
  }

    onTrainerUpdated() {
      this.editDialogVisible = false;
      this.loadTrainers();
  }
}
