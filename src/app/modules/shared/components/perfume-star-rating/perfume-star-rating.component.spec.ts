import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfumeStarRatingComponent } from './perfume-star-rating.component';

describe('PerfumeStarRatingComponent', () => {
  let component: PerfumeStarRatingComponent;
  let fixture: ComponentFixture<PerfumeStarRatingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerfumeStarRatingComponent]
    });
    fixture = TestBed.createComponent(PerfumeStarRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
