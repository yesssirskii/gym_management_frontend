import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { SubscriptionService } from '../../services/subscription.service';
import { TrainerService } from '../../services/trainer-member.service';

import { CardModule } from 'primeng/card';
import { TranslateModule } from '@ngx-translate/core';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { CurrencyPipe } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardModule,
    TranslateModule,
    TagModule,
    TableModule,
    CurrencyPipe,
    DatePipe
    ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  currentUser: any;
  stats = {
    totalMembers: 0,
    activeSubscriptions: 0,
    totalTrainers: 0,
    monthlyRevenue: 0
  };
  recentMembers: any[] = [];
  subscriptions: any[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private subscriptionService: SubscriptionService,
    private trainerService: TrainerService,
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.userService.getMembers().subscribe({
      next: (members) => {
        this.stats.totalMembers = members.length;
        this.recentMembers = members
          .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
          .slice(0, 5);
      }
    });

    this.trainerService.getTrainers().subscribe({
      next: (trainers) => {
        this.stats.totalTrainers = trainers.length;
      }
    });

    this.subscriptionService.getSubscriptions().subscribe({
      next: (subscriptions) => {
        this.stats.monthlyRevenue = subscriptions
          .filter(s => s.isCancelled === false)
          .reduce((sum, s) => sum + (s.price || 0), 0);

        this.subscriptions = subscriptions.map(sub => {
          const endDate = new Date(sub.endDate);
          const today = new Date();

          const diffInTime = endDate.getTime() - today.getTime();
          const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

          return {
            ...sub,
            daysRemaining: diffInDays
          };
        });

        this.stats.activeSubscriptions = subscriptions.filter(s => s.isCancelled == false).length;
      }
    });
  }
}
