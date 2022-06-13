import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  constructor(private route: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.sendUserId();
  }

  goHome() {
    this.route.navigateByUrl('/pets');
  }
}
