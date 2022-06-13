import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Pet } from '../../interfaces/pet.interface';
import { PetsService } from '../../services/pets.service';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { AuthService } from 'src/app/auth/services/auth.service';
import { filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.scss'],
})
export class PetsComponent implements OnInit {
  pets: Pet[] = [];
  isLoading: boolean = true;

  // Filters
  sortBy: string = '';
  kindFilter: string = 'all';

  constructor(
    private petsService: PetsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get all pets
    this.getPets();

    this.authService.sendUserId();

    // Check if its authenticated
    /* const myauth = getAuth();
    onAuthStateChanged(myauth, (user) => {
      if (user) {
        //console.log(user);
        this.authService.usserLoggedIn.emit(true);
        this.authService.currentUserUid.emit(user.uid);
      } else {
        console.log('no logeado');
      }
    }); */
  }

  // Filter pets by kind
  getKindFilter(kind: string) {
    this.kindFilter = kind;
    this.getPets();
  }

  // Filter sort by
  getSortByFilter(sortBy: string) {
    this.sortBy = sortBy;
    this.getPets();
  }

  // Get all pets
  getPets() {
    this.petsService
      .getAllPets()
      .pipe(
        map((res) => {
          let list = res;
          if (this.kindFilter !== 'all') {
            list = res.filter((pet) => pet.kind === this.kindFilter);
          }

          if (this.sortBy === 'oldest') {
            list.sort(
              (a, b) =>
                new Date(a.postDate).setHours(0, 0, 0, 0) -
                new Date(b.postDate).setHours(0, 0, 0, 0)
            );
          } else {
            list.sort((a, b) => (a.name < b.name ? 1 : -1));
          }
          return list;
        })
      )
      .subscribe((res) => {
        this.pets = res;
        this.isLoading = false;
      });
  }
}
