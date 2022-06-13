import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from 'src/app/auth/interfaces/user';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from 'src/app/auth/services/user.service';
import { Pet } from 'src/app/pets/interfaces/pet.interface';
import { PetsService } from 'src/app/pets/services/pets.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  userId: string = '';
  user!: User;
  pets: Pet[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UserService,
    private petsService: PetsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.sendUserId();

    this.activatedRoute.params.subscribe(({ id }) => {
      this.userId = id;
    });

    // Get user info
    this.usersService
      .getUserById(this.userId)
      .pipe(map((res) => res.filter((pet) => pet.uid === this.userId)))
      .subscribe((res) => {
        this.user = res[0];
      });

    // Get user pets
    this.petsService
      .getAllPets()
      .pipe(map((res) => res.filter((pet) => pet.ownerId === this.userId)))
      .subscribe((res) => {
        this.pets = res;
      });
  }
}
