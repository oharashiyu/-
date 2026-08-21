import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth;
  currentUser$ = new BehaviorSubject<User | null>(null);

  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(app);
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser$.next(user);
    });
  }

  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signOut() {
    return signOut(this.auth);
  }

  async updateDisplayName(displayName: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      return;
    }
    await updateProfile(user, { displayName });
    this.currentUser$.next(this.auth.currentUser);
  }

  getCurrentUid(): string | null {
    return this.currentUser$.value?.uid || null;
  }
}
