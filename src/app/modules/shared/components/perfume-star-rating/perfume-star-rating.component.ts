import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'perfume-star-rating',
  templateUrl: './perfume-star-rating.component.html',
  styleUrls: ['./perfume-star-rating.component.scss'],
  imports: [NgFor],
})
export class PerfumeStarRatingComponent {
  @Input()
  set rating(val: number) {
    this.starArray = this.arrayFromRating(val);
  }

  public starArray: any[] = [];

  ngOnInit(): void {}

  public arrayFromRating(val: number) {
    return new Array(val);
  }
}
