import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { RankingEntry, RankingService } from '../../shared/ranking.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  rankings: RankingEntry[] = [];
  isLoading = true;
  currentUid: string | null = null;

  constructor(
    private rankingService: RankingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUid = this.authService.getCurrentUid();
    this.rankingService.getTopRankings().then((rankings) => {
      this.rankings = rankings;
      this.isLoading = false;
    });
  }

  isCurrentUser(entry: RankingEntry): boolean {
    return !!this.currentUid && entry.uid === this.currentUid;
  }
}
