import { Injectable } from '@angular/core';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  Firestore,
  collection,
  doc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { environment } from '../../environments/environment';

export interface RankingEntry {
  uid: string;
  displayName: string;
  masteredCount: number;
  stampedCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private db: Firestore;
  private readonly collectionName = 'rankings';

  constructor() {
    const app = getApps().length ? getApp() : initializeApp(environment.firebaseConfig);
    this.db = getFirestore(app);
  }

  async syncUserStats(
    uid: string,
    displayName: string,
    stats: { masteredCount: number; stampedCount: number }
  ): Promise<void> {
    await setDoc(
      doc(this.db, this.collectionName, uid),
      {
        displayName,
        masteredCount: stats.masteredCount,
        stampedCount: stats.stampedCount,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  async getTopRankings(topCount = 20): Promise<RankingEntry[]> {
    // Ordered by a single field only, so no Firestore composite index needs to be
    // provisioned up front. The secondary sort (stampedCount) is applied client-side.
    const q = query(
      collection(this.db, this.collectionName),
      orderBy('masteredCount', 'desc'),
      limit(topCount * 3)
    );
    const snapshot = await getDocs(q);
    const entries = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        uid: docSnap.id,
        displayName: data['displayName'] || '匿名',
        masteredCount: data['masteredCount'] || 0,
        stampedCount: data['stampedCount'] || 0,
      };
    });
    return entries
      .sort((a, b) => b.masteredCount - a.masteredCount || b.stampedCount - a.stampedCount)
      .slice(0, topCount);
  }
}
