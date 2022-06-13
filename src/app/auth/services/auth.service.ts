import { EventEmitter, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  // current user
  //usserLoggedIn = new EventEmitter(false);
  //currentUserUid = new EventEmitter();
  userId$ = new Subject<string | null>();

  sendUserId() {
    return this.userId$.next(localStorage.getItem('userId'));
  }

  getUserId() {
    return this.userId$.asObservable();
  }

  // Register new user user with email
  register({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Login into the page
  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Logout
  logout() {
    return signOut(this.auth);
  }
}
