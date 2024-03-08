import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfumeGraphComponent } from './perfume-graph.component';

describe('PerfumeGraphComponent', () => {
  let component: PerfumeGraphComponent;
  let fixture: ComponentFixture<PerfumeGraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerfumeGraphComponent]
    });
    fixture = TestBed.createComponent(PerfumeGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
