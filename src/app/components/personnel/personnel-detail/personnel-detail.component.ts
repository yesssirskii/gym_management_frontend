import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
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

@Component({
  selector: 'app-personnel-detail',
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
    ReactiveFormsModule
  ],
  templateUrl: './personnel-detail.component.html',
  styleUrl: './personnel-detail.component.css'
})

export class PersonnelDetailComponent implements OnInit {
  personnel: any = null;
  loading = true;
  canEdit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {
    this.canEdit = this.authService.hasRole(['Owner', 'Manager', 'Receptionist', 'Trainer']);
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadPersonnelDetail(id);
  }

  loadPersonnelDetail(id: number) {
    this.loading = true;
    this.userService.getPersonnelById(id).subscribe({
      next: (personnel) => {
        this.personnel = personnel;
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

  goBack() {
    this.router.navigate(['/personnel']);
  }
}
