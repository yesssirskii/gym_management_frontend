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
import { FormsModule } from '@angular/forms';

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
    FormsModule,

    UpdateSubscriptionDialogComponent,
  ],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css'
})

export class SubscriptionsComponent implements OnInit {
  subscriptions: any[] = [];
  filteredSubscriptions: any[] = [];
  loading = false;
  editDialogVisible = false;
  subscription: any = null;

  selectedStatus: string | null = null;
  selectedType: string | null = null;

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
        this.subscriptions = data.map(sub => {
          const endDate = new Date(sub.endDate);
          const today = new Date();

          // normalize both dates to midnight
          endDate.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);

          const diffInTime = endDate.getTime() - today.getTime();
          // +1 to make the end date inclusive
          const diffInDays = Math.max(0, Math.ceil(diffInTime / (1000 * 60 * 60 * 24)) + 1);

          return { ...sub, daysRemaining: diffInDays };
        });

        this.filteredSubscriptions = this.subscriptions;
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

  onStatusChange(value: string | null) {
    this.selectedStatus = value;
    this.filterSubscriptions();
  }

  onTypeChange(value: string | null) {
    this.selectedType = value;
    this.filterSubscriptions();
  }

  filterSubscriptions() {
    this.filteredSubscriptions = this.subscriptions.filter(sub => {
      const statusMatch = !this.selectedStatus || sub.status === this.selectedStatus;
      const typeMatch = !this.selectedType || sub.subscriptionType === this.selectedType;
      return statusMatch && typeMatch;
    });
  }

  resetFilters() {
    this.selectedStatus = null;
    this.selectedType = null;
    this.filterSubscriptions();
  }

  editSubscription(sub: any) {
    this.subscription = sub;
    this.editDialogVisible = true;
  }

  renewSubscription(sub: any) {
    const renewData = {
      userId: sub.memberId,
      type: sub.type,
      startDate: new Date(),
      autoRenewal: sub.autoRenewal
    };

    this.subscriptionService.renewSubscription(sub.userId, renewData).subscribe({
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
    this.messageService.add({
      severity: 'info',
      summary: 'Coming Soon',
      detail: 'Price management feature will be available soon'
    });
  }

  onSubscriptionUpdated() {
    this.editDialogVisible = false;
    this.subscription = null;
    this.loadSubscriptions();
  }
}
