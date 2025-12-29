import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './core/services/auth.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let authServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      role$: of(null),
      user$: of(null),
      setRole: jasmine.createSpy('setRole'),
      logout: jasmine.createSpy('logout')
    };

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
