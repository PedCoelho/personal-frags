import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Subscription,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import {
  PerfumeResult,
  PerfumeSearchService,
} from '../../services/perfume-search.service';

@Component({
  selector: 'perfume-search',
  templateUrl: './perfume-search.component.html',
  styleUrls: ['./perfume-search.component.scss'],
})
export class PerfumeSearchComponent implements OnDestroy {
  public searchBar: FormControl = new FormControl(['']);
  public results: PerfumeResult[] = [];

  private subs: Subscription[] = [];

  constructor(
    private searchService: PerfumeSearchService,
    private cd: ChangeDetectorRef
  ) {
    const searchSub = this.searchBar.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(100),
        switchMap((val: string) => this.searchService.query(val))
        // catchError((error) => {
        //   throw error;
        // })
      )
      .subscribe((data) => {
        console.log(data);
        this.results = data ? data : [];
        this.cd.detectChanges();
      });

    this.subs.push(searchSub);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
