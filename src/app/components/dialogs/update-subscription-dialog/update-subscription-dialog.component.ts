import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { SubscriptionService } from '../../../services/subscription.service';

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
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from "primeng/inputnumber";

@Component({
  selector: 'app-update-subscription-dialog',
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
    CalendarModule,
    CheckboxModule,
    InputNumberModule
  ],
  templateUrl: './update-subscription-dialog.component.html',
  styleUrl: './update-subscription-dialog.component.css'
})

export class UpdateSubscriptionDialogComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() selectedSubscription: any = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() subscriptionUpdated = new EventEmitter<void>();

  subscriptionForm: FormGroup;
  loading = false;
  
  subscriptionTypes = [
    { label: 'Daily', value: 'Daily', days: 1 },
    { label: 'Monthly', value: 'Monthly', days: 30 },
    { label: 'Yearly', value: 'Yearly', days: 365 }
  ];

  paymentMethods = [
    { label: 'Cash', value: 'Cash' },
    { label: 'Credit Card', value: 'CreditCard' },
    { label: 'MultiSport', value: 'MultiSport' },
  ];

  subscriptionStatuses = [
    { label: 'Active', value: 'Active' },
    { label: 'Expired', value: 'Expired' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {
    this.subscriptionForm = this.fb.group({
      subscriptionId: [''],
      subscriptionType: ['', Validators.required],
      startDate: [{ value: '', disabled: true}],
      endDate: [{ value: '', disabled: true }],
      price: [{ value: '', disabled: true }],
      status: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      autoRenewal: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.onTypeChange();
  }

    ngOnChanges(changes: SimpleChanges) {
      console.log("Selected member: ",this.selectedSubscription)

      if (changes['selectedSubscription'] && this.selectedSubscription) {
        this.patchFormValues();
      }
  }

  patchFormValues() {
    const subscriptionData = this.getSubscriptionData();
    
    if (!subscriptionData) {
      console.warn('No subscription data found');
      return;
    }

    let subscriptionStartDate = subscriptionData.startDate;
    if (typeof subscriptionStartDate === 'string') {
      subscriptionStartDate = new Date(subscriptionStartDate);
    }

    let subscriptionEndDate = subscriptionData.endDate;
    if (typeof subscriptionEndDate === 'string') {
      subscriptionEndDate = new Date(subscriptionEndDate);
    }

    this.subscriptionForm.patchValue({
      subscriptionId: subscriptionData.id,
      subscriptionType: subscriptionData.subscriptionType,
      startDate: subscriptionStartDate,
      endDate: subscriptionEndDate,
      price: subscriptionData.price,
      status: subscriptionData.status,
      paymentMethod: subscriptionData.paymentMethod,
      autoRenewal: subscriptionData.autoRenewal || false
    });

    console.log(this.subscriptionForm)
  }

  private getSubscriptionData(): any {
    if (!this.selectedSubscription) {
      return null;
    }

    if (this.selectedSubscription.subscription) {
      return this.selectedSubscription.subscription;
    }

    if (this.selectedSubscription.subscriptionType || 
        this.selectedSubscription.startDate || 
        this.selectedSubscription.endDate) {
      return this.selectedSubscription;
    }

    return null;
  }

  onTypeChange() {
    const selectedType = this.subscriptionTypes.find(t => t.value === this.subscriptionForm.get('subscriptionType')?.value);
    if (selectedType) {
      const prices = { Daily: 5, Monthly: 50, Yearly: 500 };
      
      this.subscriptionForm.patchValue({ price: prices[selectedType.value as keyof typeof prices] });
      this.calculateEndDate();
    }
  }

  calculateEndDate() {
    const startDate = this.subscriptionForm.get('startDate')?.value;
    const type = this.subscriptionForm.get('subscriptionType')?.value;
    
    if (startDate && type) {
      const selectedType = this.subscriptionTypes.find(t => t.value === type);
      if (selectedType) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + selectedType.days);
        this.subscriptionForm.patchValue({ endDate });
      }
    }
  }

  onSubmit() {
    if (this.subscriptionForm.valid && this.selectedSubscription) {
      this.loading = true;

      const formData = {
        userId: this.selectedSubscription.id,
        ...this.subscriptionForm.getRawValue()
      };

      this.subscriptionService.updateUserSubscription(this.selectedSubscription.userId, formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('COMMON.SUCCESS'),
            detail: this.translate.instant('SUBSCRIPTIONS.Update_Success')
          });
          this.subscriptionUpdated.emit();
          this.resetForm();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('COMMON.ERROR'),
            detail: this.translate.instant('SUBSCRIPTIONS.Update_Error')
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
    this.subscriptionForm.reset({
      startDate: new Date(),
      autoRenewal: false
    });
    this.loading = false;
  }
}

