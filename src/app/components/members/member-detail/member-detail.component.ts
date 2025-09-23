import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../services/user.service';
import { SubscriptionService } from '../../../services/subscription.service';
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

import { UpdateSubscriptionDialogComponent } from '../../dialogs/update-subscription-dialog/update-subscription-dialog.component';
import { AssignTrainerDialogComponent } from '../../dialogs/assign-trainer-dialog/assign-trainer-dialog.component';

@Component({
  selector: 'app-member-detail',
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
    UpdateSubscriptionDialogComponent,
    AssignTrainerDialogComponent
  ],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})

export class MemberDetailComponent implements OnInit {
  member: any = null;
  subscription: any = null;
  currentTrainer: any = null;
  loading = true;
  canEdit = false;
  subscriptionDialogVisible = false;
  assignTrainerDialogVisible = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private subscriptionService: SubscriptionService,
    private trainerService: TrainerService,
    private authService: AuthService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {
    this.canEdit = this.authService.hasRole(['Owner', 'Manager', 'Receptionist', 'Trainer']);
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadMemberDetail(id);
  }

  loadMemberDetail(id: number) {
    this.loading = true;
    
    // Load member basic info
    this.userService.getMemberById(id).subscribe({
      next: (member) => {
        this.member = member;
        this.loadSubscription(id);
        this.loadTrainer(id);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('COMMON.ERROR'),
          detail: this.translate.instant('MEMBERS.LOAD_ERROR')
        });
        this.loading = false;
      }
    });
  }

  loadSubscription(memberId: number) {
    this.subscriptionService.getUserActiveSubscription(memberId).subscribe({
      next: (sub) => {
        this.subscription = sub;

        if(this.subscription){
          const endDate = new Date(sub.endDate);
          const today = new Date();
        
          const diffInTime = endDate.getTime() - today.getTime();
          const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
        
          this.subscription = {
            ...sub,
            daysRemaining: diffInDays > 0 ? diffInDays : 0
          }
        }
        else{
        this.subscription = null;
        }
      },
      error: () => {
        this.subscription = null;
      }
    });
  }

  loadTrainer(memberId: number) {
    this.trainerService.getMemberTrainer(memberId).subscribe({
      next: (trainer) => {
        this.currentTrainer = trainer;
        this.loading = false;
      },
      error: () => {
        // No trainer assigned is not an error
        this.currentTrainer = null;
        this.loading = false;
      }
    });
  }

  showUpdateSubscription() {
    if(this.member.userType == 'Trainer' || this.member.userType == 'Personnel'){
      this.messageService.add({
        severity: 'info',
        detail: this.translate.instant('MEMBERS.Is_trainer_subscription'),
      });
    }

    this.userService.getMemberById(this.member.id).subscribe(updated => {
      this.member = updated;
      this.subscriptionDialogVisible = true;
  });
  }

  showAssignTrainer() {
    if(this.currentTrainer != null){
      this.messageService.add({
        severity: 'info',
        detail: this.translate.instant('MEMBERS.Trainer_assigned'),
      });

      this.assignTrainerDialogVisible = false;
    }
    else if(this.member.userType == 'Trainer'){
      this.messageService.add({
        severity: 'info',
        detail: this.translate.instant('MEMBERS.Is_trainer'),
      });

      this.assignTrainerDialogVisible = false;
    }
    else{
      this.assignTrainerDialogVisible = true;
    }
  }

  onSubscriptionUpdated() {
    this.subscriptionDialogVisible = false;
    this.loadMemberDetail(this.member.id);
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant('COMMON.SUCCESS'),
      detail: this.translate.instant('SUBSCRIPTIONS.UPDATE_SUCCESS')
    });
  }

  onTrainerAssigned() {
    this.assignTrainerDialogVisible = false;
    this.loadTrainer(this.member.id);
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant('COMMON.SUCCESS'),
      detail: this.translate.instant('TRAINERS.ASSIGN_SUCCESS')
    });
  }
  
  goBack() {
    this.router.navigate(['/members']);
  }
}
