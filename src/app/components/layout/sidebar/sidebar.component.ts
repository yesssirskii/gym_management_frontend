import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { MenuModule } from 'primeng/menu';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MenuModule,
    TranslateModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.buildMenu();
  }

  buildMenu() {
    const currentUser = this.authService.getCurrentUser();

    this.menuItems = [
      {
        label: 'MENU.DASHBOARD',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
      }
    ];

    // Add menu items based on user type
    if (currentUser?.userType === 'Trainer') {
      // Add all trainer-accessible menu items directly
      this.menuItems.push(
        {
          label: 'MENU.MEMBERS',
          icon: 'pi pi-users',
          routerLink: '/members'
        },
        {
          label: 'MENU.PERSONNEL',
          icon: 'pi pi-id-card',
          routerLink: '/personnel'
        },
        {
          label: 'MENU.TRAINERS',
          icon: 'pi pi-id-card',
          routerLink: '/trainers'
        }
      );
    }

    // Add Trainers section for Members
    if (currentUser?.userType === 'Member') {
      this.menuItems.push({
        label: 'MENU.TRAINERS',
        icon: 'pi pi-star',
        routerLink: '/trainers'
      });
    }

    // Always add Subscriptions
    this.menuItems.push({
      label: 'MENU.SUBSCRIPTIONS',
      icon: 'pi pi-credit-card',
      routerLink: '/subscriptions'
    });
  }
}