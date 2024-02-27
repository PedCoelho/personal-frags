import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfumeEditModalComponent } from './perfume-edit-modal.component';

describe('PerfumeEditModalComponent', () => {
  let component: PerfumeEditModalComponent;
  let fixture: ComponentFixture<PerfumeEditModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerfumeEditModalComponent]
    });
    fixture = TestBed.createComponent(PerfumeEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
