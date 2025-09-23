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
import { UpdateUserDialogComponent } from '../../dialogs/update-user-dialog/update-user-dialog.component';

@Component({
  selector: 'app-personnel',
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
  templateUrl: './personnel.component.html',
  styleUrl: './personnel.component.css'
})

export class PersonnelComponent implements OnInit {
  personnel: any[] = [];
  loading = false;
  createDialogVisible = false;

  editLoadingId: number | null = null;
  editDialogVisible = false;
  selectedPersonnelDetails: any = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadPersonnel();
  }

  loadPersonnel() {
    this.loading = true;
    this.userService.getPersonnel().subscribe({
      next: (data) => {
        this.personnel = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('COMMON.ERROR'),
          detail: this.translate.instant('PERSONNEL.LOAD_ERROR')
        });
        this.loading = false;
      }
    });
  }

  viewPersonnel(id: number) {
    this.router.navigate(['/personnel', id]);
  }

  editPersonnel(person: any) {
    this.editLoadingId = person.id;
    
    this.userService.getPersonnelById(person.id).subscribe({
      next: (fullPersonnelData) => {
        this.selectedPersonnelDetails = fullPersonnelData;
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

  deletePersonnel(person: any) {
    this.confirmationService.confirm({
      message: this.translate.instant('PERSONNEL.DELETE_CONFIRM', { name: person.firstName + ' ' + person.lastName }),
      header: this.translate.instant('COMMON.DELETE'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(person.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: this.translate.instant('COMMON.SUCCESS'),
              detail: this.translate.instant('PERSONNEL.DELETE_SUCCESS')
            });
            this.loadPersonnel();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: this.translate.instant('COMMON.ERROR'),
              detail: this.translate.instant('PERSONNEL.DELETE_ERROR')
            });
          }
        });
      }
    });
  }

  onUserCreated() {
    this.createDialogVisible = false;
    this.loadPersonnel();
  }

  onPersonnelUpdated() {
    this.editDialogVisible = false;
    this.loadPersonnel();
  }
}


