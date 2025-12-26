import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelLogComponent } from './parcel-log.component';

describe('ParcelLogComponent', () => {
  let component: ParcelLogComponent;
  let fixture: ComponentFixture<ParcelLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
