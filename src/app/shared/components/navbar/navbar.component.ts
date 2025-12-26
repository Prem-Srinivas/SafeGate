import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService, Role } from '../../../core/services/auth.service';
import { AsyncPipe, NgIf, NgClass } from '@angular/common';
import { map, Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    NgIf,
    AsyncPipe,
    NgClass
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  role$: Observable<Role | null>;
  homeRoute$;
  user$: Observable<User | null>;

  constructor(private auth: AuthService) {
    this.role$ = this.auth.role$;
    this.user$ = this.auth.user$;
    this.homeRoute$ = this.auth.user$.pipe(
      map(user => {
        if (!user) return '/login';
        if (user.role === 'Admin') return '/admin';
        if (user.role === 'Security Guard') return '/visitors';
        return '/my-visitors';
      })
    );
  }

  logout() {
    this.auth.logout();
  }
}
