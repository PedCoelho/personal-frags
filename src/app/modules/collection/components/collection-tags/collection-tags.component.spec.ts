import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTagsComponent } from './collection-tags.component';

describe('CollectionTagsComponent', () => {
  let component: CollectionTagsComponent;
  let fixture: ComponentFixture<CollectionTagsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionTagsComponent]
    });
    fixture = TestBed.createComponent(CollectionTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
