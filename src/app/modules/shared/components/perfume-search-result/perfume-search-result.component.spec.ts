import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfumeSearchResultComponent } from './perfume-search-result.component';

describe('PerfumeSearchResultComponent', () => {
  let component: PerfumeSearchResultComponent;
  let fixture: ComponentFixture<PerfumeSearchResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerfumeSearchResultComponent]
    });
    fixture = TestBed.createComponent(PerfumeSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
