import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService) {}

  isLogin = false;

  ngOnInit(): void {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    });
    /*     this.auth.getUserId().subscribe((res) => {
      this.isLogin = res == null ? false : true;
    }); */
  }

  title = 'petLink';
}
