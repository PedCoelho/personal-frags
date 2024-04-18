import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiOverviewButtonComponent } from './ai-overview-button.component';

describe('AiOverviewButtonComponent', () => {
  let component: AiOverviewButtonComponent;
  let fixture: ComponentFixture<AiOverviewButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiOverviewButtonComponent]
    });
    fixture = TestBed.createComponent(AiOverviewButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
