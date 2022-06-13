import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  constructor(private router: Router, private auth: AuthService) {}

  isLogin = false;

  @Output() onOpenSidenav: EventEmitter<void> = new EventEmitter();

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
      if (res == null) {
        this.isLogin = false;
      } else {
        this.isLogin = true;
      }
    }); */
  }

  goPets() {
    this.router.navigateByUrl('pets');
  }

  goLogin() {
    this.router.navigateByUrl('/auth/login');
  }

  myProfile() {
    this.router.navigateByUrl('/profile');
  }

  signOut() {
    Swal.fire({
      icon: 'warning',
      text: '¿Estás seguro que deseas cerrar sesión?',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true,
      confirmButtonColor: '#F3594B',
    }).then((res) => {
      if (res.isConfirmed) {
        this.auth.logout();
        this.router.navigateByUrl('/');
        localStorage.removeItem('userId');

        localStorage.removeItem('userId');
        this.auth.sendUserId();
      }
    });
  }

  openSidenav() {
    this.onOpenSidenav.emit();
  }
}
