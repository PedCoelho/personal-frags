import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfumeSearchComponent } from './perfume-search.component';

describe('PerfumeSearchComponent', () => {
  let component: PerfumeSearchComponent;
  let fixture: ComponentFixture<PerfumeSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerfumeSearchComponent]
    });
    fixture = TestBed.createComponent(PerfumeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
