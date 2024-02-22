import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchResult } from '../perfume-search/models/perfume-search.models';
import { ArrayFromNumberPipe } from './../../pipes/array-from-number.pipe';

@Component({
  selector: 'perfume-search-result',
  templateUrl: './perfume-search-result.component.html',
  styleUrls: ['./perfume-search-result.component.scss'],
})
export class PerfumeSearchResultComponent {
  @Input() perfume?: SearchResult;
  @Output('action-triggered') actionTriggered =
    new EventEmitter<SearchResult>();

  public arrayFromRating(rating: number) {
    return new ArrayFromNumberPipe().transform(rating);
  }
}
