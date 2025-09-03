import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../services/user.service';
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
import { UpdateSubscriptionDialogComponent } from '../../dialogs/update-subscription-dialog/update-subscription-dialog.component';
import { UpdateUserDialogComponent } from '../../dialogs/update-user-dialog/update-user-dialog.component';

@Component({
  selector: 'app-members',
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
    UpdateSubscriptionDialogComponent,
    UpdateUserDialogComponent
  ],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})

export class MembersComponent implements OnInit {
  members: any[] = [];
  loading = false;
  selectedMember: any = null;
  selectedMemberDetails: any = null;
  editLoadingId: number | null = null;
  canEdit = false;

  createDialogVisible = false;
  subscriptionDialogVisible = false;
  editDialogVisible = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
  ) {
    this.canEdit = this.authService.hasRole(['Owner', 'Manager', 'Receptionist', 'Trainer']);
  }

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.loading = true;
    this.userService.getMembers().subscribe({
      next: (data) => {
        this.members = data;
        this.loading = false;
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

  viewMember(id: number) {
    this.router.navigate(['/members', id]);
  }

  editMember(member: any) {
    // Show loading on the specific edit button
    this.editLoadingId = member.id;
    
    // Fetch complete member details before opening dialog
    this.userService.getMemberById(member.id).subscribe({
      next: (fullMemberData) => {
        this.selectedMemberDetails = fullMemberData;
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

  updateSubscription(member: any) {
    this.selectedMember = member;
    this.subscriptionDialogVisible = true;
  }

  deleteMember(member: any) {
    this.confirmationService.confirm({
      message: this.translate.instant('MEMBERS.DELETE_CONFIRM', { name: member.firstName + ' ' + member.lastName }),
      header: this.translate.instant('COMMON.DELETE'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(member.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: this.translate.instant('COMMON.SUCCESS'),
              detail: this.translate.instant('MEMBERS.DELETE_SUCCESS')
            });
            this.loadMembers();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: this.translate.instant('COMMON.ERROR'),
              detail: this.translate.instant('MEMBERS.DELETE_ERROR')
            });
          }
        });
      }
    });
  }

  onUserCreated() {
    this.createDialogVisible = false;
    this.loadMembers();
  }

  onSubscriptionUpdated() {
    this.subscriptionDialogVisible = false;
    this.loadMembers();
  }

  onMemberUpdated() {
    this.editDialogVisible = false;
    this.loadMembers();
  }
}
