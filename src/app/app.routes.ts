import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { LayoutComponent } from './components/layout/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MembersComponent } from './components/members/members/members.component';
import { PersonnelComponent } from './components/personnel/personnel/personnel.component';
import { MemberDetailComponent } from './components/members/member-detail/member-detail.component';
import { PersonnelDetailComponent } from './components/personnel/personnel-detail/personnel-detail.component';
import { TrainersComponent } from './components/trainers/trainers/trainers.component';
import { TrainerDetailComponent } from './components/trainers/trainer-detail/trainer-detail.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';

import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { 
        path: 'members', 
        component: MembersComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Owner', 'Manager', 'Receptionist', 'Trainer'] }
      },
      { 
        path: 'members/:id', 
        component: MemberDetailComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Owner', 'Manager', 'Receptionist', 'Trainer'] }
      },
      { 
        path: 'personnel', 
        component: PersonnelComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Owner', 'Manager', 'Trainer'] }
      },
      { 
        path: 'personnel/:id', 
        component: PersonnelDetailComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Owner', 'Manager', 'Trainer'] }
      },
      { 
        path: 'trainers', 
        component: TrainersComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Owner', 'Manager', 'Receptionist', 'Member', 'Trainer'] }
      },
      { 
        path: 'trainers/:id', 
        component: TrainerDetailComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Owner', 'Manager', 'Receptionist', 'Member', 'Trainer'] }
      },
      { 
        path: 'subscriptions', 
        component: SubscriptionsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Owner', 'Manager', 'Receptionist', 'Trainer'] }
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];

export class AppRoutingModule {}