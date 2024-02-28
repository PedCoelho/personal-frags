import { NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'perfume-star-rating',
  templateUrl: './perfume-star-rating.component.html',
  styleUrls: ['./perfume-star-rating.component.scss'],
  imports: [NgFor],
})
export class PerfumeStarRatingComponent implements OnInit {
  @Input() rating: number = 0;

  public starArray: any[] = [];

  ngOnInit(): void {
    this.starArray = this.arrayFromRating();
  }

  public arrayFromRating() {
    return new Array(this.rating);
  }
}
