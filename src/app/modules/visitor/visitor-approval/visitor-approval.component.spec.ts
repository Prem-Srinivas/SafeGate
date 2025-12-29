import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorApprovalComponent } from './visitor-approval.component';

describe('VisitorApprovalComponent', () => {
  let component: VisitorApprovalComponent;
  let fixture: ComponentFixture<VisitorApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
