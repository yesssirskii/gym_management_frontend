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
    DialogModule
  ],
  templateUrl: './update-subscription-dialog.component.html',
  styleUrl: './update-subscription-dialog.component.css'
})

export class UpdateSubscriptionDialogComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() selectedMember: any = null;
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
    { label: 'Bank Transfer', value: 'BankTransfer' },
    { label: 'Online', value: 'Online' }
  ];

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {
    this.subscriptionForm = this.fb.group({
      type: ['', Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [{ value: '', disabled: true }],
      price: ['', [Validators.required, Validators.min(0)]],
      autoRenewal: [false],
      paymentMethod: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.onTypeChange();
  }

    ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedMember'] && this.selectedMember) {
      this.patchFormValues();
    }
  }

  patchFormValues() {
        console.log('Selected member:', this.selectedMember);
    console.log('Member subscription:', this.selectedMember?.subscription);
    this.subscriptionForm.patchValue({
      type: this.selectedMember.subscription.subscriptionType,
      autoRenewal: this.selectedMember.subscription.autoRenewal || false
    });
  }

  onTypeChange() {
    const selectedType = this.subscriptionTypes.find(t => t.value === this.subscriptionForm.get('type')?.value);
    if (selectedType) {
      const prices = { Daily: 10, Monthly: 100, Yearly: 1000 };
      
      this.subscriptionForm.patchValue({ price: prices[selectedType.value as keyof typeof prices] });
      this.calculateEndDate();
    }
  }

  calculateEndDate() {
    const startDate = this.subscriptionForm.get('startDate')?.value;
    const type = this.subscriptionForm.get('type')?.value;
    
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
    if (this.subscriptionForm.valid && this.selectedMember) {
      this.loading = true;
      const formData = {
        userId: this.selectedMember.id,
        ...this.subscriptionForm.getRawValue()
      };

      this.subscriptionService.updateUserSubscription(formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('COMMON.SUCCESS'),
            detail: this.translate.instant('SUBSCRIPTIONS.UPDATE_SUCCESS')
          });
          this.subscriptionUpdated.emit();
          this.resetForm();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('COMMON.ERROR'),
            detail: this.translate.instant('SUBSCRIPTIONS.UPDATE_ERROR')
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

