import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { RankingService } from './ranking.service';

@Injectable({
  providedIn: 'root'
})
export class StampService {
  private readonly storageKeyPrefix = 'geinin-stamp-data';
  private readonly masteredCount = 3;

  constructor(
    private authService: AuthService,
    private rankingService: RankingService
  ) {}

  private getStorageKey(): string {
    const uid = this.authService.getCurrentUid();
    return uid ? `${this.storageKeyPrefix}-${uid}` : `${this.storageKeyPrefix}-guest`;
  }

  private migrateLegacyData(key: string): string | null {
    const legacyRaw = localStorage.getItem(this.storageKeyPrefix);
    if (!legacyRaw) {
      return null;
    }
    localStorage.setItem(key, legacyRaw);
    localStorage.removeItem(this.storageKeyPrefix);
    return legacyRaw;
  }

  private getCounts(): Record<string, number> {
    const key = this.getStorageKey();
    const raw = localStorage.getItem(key) || this.migrateLegacyData(key);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const counts: Record<string, number> = {};
      parsed.forEach((name: string) => {
        counts[name] = 1;
      });
      return counts;
    }
    return parsed || {};
  }

  private saveCounts(counts: Record<string, number>): void {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(counts));
  }

  syncRanking(): void {
    const uid = this.authService.getCurrentUid();
    if (!uid) {
      return;
    }
    const counts = this.getCounts();
    const stampedCount = Object.keys(counts).length;
    const masteredCount = Object.values(counts).filter((c) => c >= this.masteredCount).length;
    const user = this.authService.currentUser$.value;
    const displayName = user?.displayName || user?.email || '匿名';
    this.rankingService.syncUserStats(uid, displayName, { masteredCount, stampedCount });
  }

  getAllStampedNames(): string[] {
    return Object.keys(this.getCounts());
  }

  getCount(name: string): number {
    return this.getCounts()[name] || 0;
  }

  isStamped(name: string): boolean {
    return this.getCount(name) > 0;
  }

  isMastered(name: string): boolean {
    return this.getCount(name) >= this.masteredCount;
  }

  addCorrectAnswer(name: string): void {
    const counts = this.getCounts();
    counts[name] = (counts[name] || 0) + 1;
    this.saveCounts(counts);
    this.syncRanking();
  }

  resetAll(): void {
    localStorage.removeItem(this.getStorageKey());
    this.syncRanking();
  }
}
