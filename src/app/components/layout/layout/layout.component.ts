import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FooterComponent } from '../footer/footer.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    BreadcrumbModule,
    FooterComponent,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})

export class LayoutComponent implements OnInit, OnDestroy {
  breadcrumbs: MenuItem[] = [];
  home: MenuItem = { 
    icon: 'pi pi-home', 
    routerLink: '/dashboard',
    label: ''
  };
  
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.updateBreadcrumbs();
    
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateBreadcrumbs();
      });

    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateBreadcrumbs();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateBreadcrumbs() {
    const url = this.router.url;
    const urlSegments = url.split('/').filter(segment => segment);
    
    this.breadcrumbs = this.buildBreadcrumbs(urlSegments);
  }

  private buildBreadcrumbs(segments: string[]): MenuItem[] {
    const breadcrumbs: MenuItem[] = [];
    
    if (segments.length === 0) {
      return breadcrumbs;
    }

    let currentPath = '';
    
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentPath += `/${segment}`;
      
      if (this.isNumeric(segment) && i === segments.length - 1) {
        const parentSegment = segments[i - 1];
        const detailLabel = this.getDetailLabel(parentSegment);
        breadcrumbs.push({
          label: detailLabel,
          routerLink: currentPath
        });
      } else if (!this.isNumeric(segment)) {
        const label = this.getBreadcrumbLabel(segment);
        const routerLink = i === segments.length - 1 ? undefined : currentPath;
        
        breadcrumbs.push({
          label: label,
          routerLink: routerLink
        });
      }
    }
    
    return breadcrumbs;
  }

  private getBreadcrumbLabel(segment: string): string {
    const labelMap: { [key: string]: string } = {
      'dashboard': 'MENU.DASHBOARD',
      'members': 'MENU.MEMBERS',
      'personnel': 'MENU.PERSONNEL',
      'trainers': 'MENU.TRAINERS',
      'subscriptions': 'MENU.SUBSCRIPTIONS',
      'profile': 'HEADER.PROFILE',
      'settings': 'MENU.SETTINGS'
    };

    const translationKey = labelMap[segment];
    return translationKey ? this.translate.instant(translationKey) : this.capitalizeFirst(segment);
  }

  private getDetailLabel(parentSegment: string): string {
    const detailLabelMap: { [key: string]: string } = {
      'members': 'MEMBERS.Detail_title',
      'personnel': 'PERSONNEL.Detail_Title',
      'trainers': 'TRAINERS.Trainer_Details.Title',
      'subscriptions': 'SUBSCRIPTIONS.DETAIL_TITLE'
    };

    const translationKey = detailLabelMap[parentSegment];
    return translationKey ? this.translate.instant(translationKey) : 'Details';
  }

  private isNumeric(value: string): boolean {
    return !isNaN(Number(value)) && !isNaN(parseFloat(value));
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

