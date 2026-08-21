import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { StampService } from '../../shared/stamp.service';
import { ConfirmService } from '../../shared/modal/confirm.service';

@Component({
  selector: 'app-stamp-rally',
  templateUrl: './stamp-rally.component.html',
  styleUrls: ['./stamp-rally.component.scss']
})
export class StampRallyComponent implements OnInit {
  geinins: any[] = [];
  stampedNames: string[] = [];
  selectedGeinin: any = null;
  bookOpen = false;

  pageSize = 12;
  currentPage = 0;
  pageTurning = false;
  turnDirection: 'next' | 'prev' = 'next';

  constructor(
    private dataService: DataService,
    private stampService: StampService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.stampedNames = this.stampService.getAllStampedNames();
    this.dataService.getGeinin().subscribe((geinins: any) => {
      this.geinins = geinins;
    });
    setTimeout(() => {
      this.bookOpen = true;
    }, 300);
  }

  isStamped(name: string): boolean {
    return this.stampedNames.includes(name);
  }

  isMastered(name: string): boolean {
    return this.stampService.isMastered(name);
  }

  selectGeinin(g: any): void {
    if (!this.isStamped(g['name'])) {
      return;
    }
    this.selectedGeinin = g;
  }

  closeDescription(): void {
    this.selectedGeinin = null;
  }

  get stampedCount(): number {
    return this.geinins.filter((g) => this.isStamped(g['name'])).length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.geinins.length / this.pageSize));
  }

  get pagedGeinins(): any[] {
    const start = this.currentPage * this.pageSize;
    return this.geinins.slice(start, start + this.pageSize);
  }

  get leftPageItems(): any[] {
    return this.pagedGeinins.slice(0, this.pageSize / 2);
  }

  get rightPageItems(): any[] {
    return this.pagedGeinins.slice(this.pageSize / 2);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1, 'next');
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1, 'prev');
  }

  private goToPage(page: number, direction: 'next' | 'prev'): void {
    if (page < 0 || page >= this.totalPages || this.pageTurning) {
      return;
    }
    this.turnDirection = direction;
    this.pageTurning = true;
    setTimeout(() => {
      this.currentPage = page;
      this.pageTurning = false;
    }, 300);
  }

  resetStamps(): void {
    this.confirmService.confirm('スタンプラリーをリセットしますか？集めたスタンプはすべて消えます。').subscribe((confirmed) => {
      if (confirmed) {
        this.stampService.resetAll();
        this.stampedNames = [];
      }
    });
  }
}
