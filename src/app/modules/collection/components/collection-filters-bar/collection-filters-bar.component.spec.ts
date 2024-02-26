import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionFiltersBarComponent } from './collection-filters-bar.component';

describe('CollectionFiltersBarComponent', () => {
  let component: CollectionFiltersBarComponent;
  let fixture: ComponentFixture<CollectionFiltersBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionFiltersBarComponent]
    });
    fixture = TestBed.createComponent(CollectionFiltersBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
