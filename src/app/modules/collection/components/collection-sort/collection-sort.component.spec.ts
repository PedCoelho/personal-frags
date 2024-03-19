import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionSortComponent } from './collection-sort.component';

describe('CollectionSortComponent', () => {
  let component: CollectionSortComponent;
  let fixture: ComponentFixture<CollectionSortComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionSortComponent],
    });
    fixture = TestBed.createComponent(CollectionSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
