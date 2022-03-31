import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveHomeComponent } from './live-home.component';

describe('LiveHomeComponent', () => {
  let component: LiveHomeComponent;
  let fixture: ComponentFixture<LiveHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
