import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

import { AssignTrainerDialogComponent } from '../../dialogs/assign-trainer-dialog/assign-trainer-dialog.component';

@Component({
  selector: 'app-trainer-detail',
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
    AssignTrainerDialogComponent
  ],
  templateUrl: './trainer-detail.component.html',
  styleUrl: './trainer-detail.component.css'
})

export class TrainerDetailComponent implements OnInit {
  trainer: any = null;
  loading = true;
  canEdit = false;
  addMemberDialogVisible = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainerService: TrainerService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
  ) {
    this.canEdit = this.authService.hasRole(['Owner', 'Manager', 'Receptionist', 'Trainer']);
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadTrainerDetail(id);
  }

  loadTrainerDetail(id: number) {
    this.loading = true;
    this.trainerService.getTrainerById(id).subscribe({
      next: (trainer) => {
        this.trainer = trainer;
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

  showAddMember() {
    this.addMemberDialogVisible = true;
  }

  viewMember(memberId: number) {
    this.router.navigate(['/members', memberId]);
  }

  removeMember(member: any) {
    this.confirmationService.confirm({
      message: this.translate.instant('TRAINERS.REMOVE_MEMBER_CONFIRM', { 
        member: member.memberFirstName + ' ' + member.memberLastName 
      }),
      header: this.translate.instant('TRAINERS.REMOVE_MEMBER'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.trainerService.removeMemberFromTrainer(this.trainer.id, member.memberId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: this.translate.instant('COMMON.SUCCESS'),
              detail: this.translate.instant('TRAINERS.REMOVE_MEMBER_SUCCESS')
            });
            this.loadTrainerDetail(this.trainer.id);
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: this.translate.instant('COMMON.ERROR'),
              detail: this.translate.instant('TRAINERS.REMOVE_MEMBER_ERROR')
            });
          }
        });
      }
    });
  }

  onMemberAdded() {
    this.addMemberDialogVisible = false;
    this.loadTrainerDetail(this.trainer.id);
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant('COMMON.SUCCESS'),
      detail: this.translate.instant('TRAINERS.ADD_MEMBER_SUCCESS')
    });
  }

  goBack() {
    this.router.navigate(['/trainers']);
  }
}
