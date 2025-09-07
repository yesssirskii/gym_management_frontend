import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { SubscriptionService } from '../../services/subscription.service';

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

import { UpdateSubscriptionDialogComponent } from '../dialogs/update-subscription-dialog/update-subscription-dialog.component';

@Component({
  selector: 'app-subscriptions',
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
    UpdateSubscriptionDialogComponent
  ],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css'
})

export class SubscriptionsComponent implements OnInit {
  subscriptions: any[] = [];
  filteredSubscriptions: any[] = [];
  loading = false;
  editDialogVisible = false;
  selectedMember: any = null;
  selectedStatus = '';
  selectedType = '';

  statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Expired', value: 'Expired' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

  typeOptions = [
    { label: 'Daily', value: 'Daily' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Yearly', value: 'Yearly' }
  ];

  constructor(
    private subscriptionService: SubscriptionService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.loading = true;
    this.subscriptionService.getSubscriptions().subscribe({
      next: (data) => {
        this.subscriptions = data;
        this.filteredSubscriptions = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('COMMON.ERROR'),
          detail: this.translate.instant('SUBSCRIPTIONS.LOAD_ERROR')
        });
        this.loading = false;
      }
    });
  }

  filterSubscriptions() {
    this.filteredSubscriptions = this.subscriptions.filter(sub => {
      const statusMatch = !this.selectedStatus || sub.status === this.selectedStatus;
      const typeMatch = !this.selectedType || sub.type === this.selectedType;
      return statusMatch && typeMatch;
    });
  }

  editSubscription(sub: any) {
    this.selectedMember = { id: sub.memberId, ...sub };
    this.editDialogVisible = true;
  }

  renewSubscription(sub: any) {
    const renewData = {
      userId: sub.memberId,
      type: sub.type,
      startDate: new Date(),
      autoRenewal: sub.autoRenewal
    };

    this.subscriptionService.updateUserSubscription(this.selectedMember.id, renewData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('COMMON.SUCCESS'),
          detail: this.translate.instant('SUBSCRIPTIONS.RENEW_SUCCESS')
        });
        this.loadSubscriptions();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('COMMON.ERROR'),
          detail: this.translate.instant('SUBSCRIPTIONS.RENEW_ERROR')
        });
      }
    });
  }

  showPriceDialog() {
    // Implementation for price management dialog
    this.messageService.add({
      severity: 'info',
      summary: 'Coming Soon',
      detail: 'Price management feature will be available soon'
    });
  }

  onSubscriptionUpdated() {
    this.editDialogVisible = false;
    this.loadSubscriptions();
  }
}
