import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { VisitorLogComponent } from './features/visitor-log/visitor-log.component';
import { ResidentApprovalComponent } from './features/resident-approval/resident-approval.component';
import { ParcelLogComponent } from './features/parcel-log/parcel-log.component';
import { ResidentParcelComponent } from './features/resident-parcel/resident-parcel.component';
import { AdminComponent } from './features/admin/admin.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { NotAuthorizedComponent } from './features/not-authorized/not-authorized.component';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Security Guard', 'Resident'] }
  },

  // Visitor Routes
  {
    path: 'visitors',
    component: VisitorLogComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Security Guard', 'Admin'] }
  },
  {
    path: 'my-visitors',
    component: ResidentApprovalComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Resident', 'Admin'] }
  },

  // Parcel Routes
  {
    path: 'parcels',
    component: ParcelLogComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Security Guard', 'Admin'] }
  },
  {
    path: 'my-parcels',
    component: ResidentParcelComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Resident', 'Admin'] }
  },

  // Admin Routes
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] }
  },

  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: '**', component: NotFoundComponent }
];
