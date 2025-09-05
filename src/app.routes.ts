import { Routes } from '@angular/router';
import { LoginComponent } from './app/components/auth/login/login.component';
import { LayoutComponent } from './app/components/layout/layout/layout.component';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { MembersComponent } from './app/components/members/members/members.component';
import { PersonnelComponent } from './app/components/personnel/personnel/personnel.component';
import { MemberDetailComponent } from './app/components/members/member-detail/member-detail.component';
import { PersonnelDetailComponent } from './app/components/personnel/personnel-detail/personnel-detail.component';
import { TrainersComponent } from './app/components/trainers/trainers/trainers.component';
import { TrainerDetailComponent } from './app/components/trainers/trainer-detail/trainer-detail.component';
import { SubscriptionsComponent } from './app/components/subscriptions/subscriptions.component';

import { RoleGuard } from './app/guards/role.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    //canActivate: [AuthGuard],
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
        data: { roles: ['Owner', 'Manager', 'Receptionist', 'Member'] }
      },
      { 
        path: 'trainers/:id', 
        component: TrainerDetailComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Owner', 'Manager', 'Receptionist', 'Member'] }
      },
      { 
        path: 'subscriptions', 
        component: SubscriptionsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Owner', 'Manager', 'Receptionist'] }
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];

export class AppRoutingModule {}