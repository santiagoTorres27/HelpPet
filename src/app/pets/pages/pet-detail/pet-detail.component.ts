import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Comment } from '../../interfaces/comment.interface';
import { Pet } from '../../interfaces/pet.interface';
import { CommentsService } from '../../services/comments.service';
import { PetsService } from '../../services/pets.service';

@Component({
  selector: 'app-pet-detail',
  templateUrl: './pet-detail.component.html',
  styleUrls: ['./pet-detail.component.scss'],
})
export class PetDetailComponent implements OnInit {
  pet!: Pet;
  isLoading = true;
  petId = '';

  ageMap = {
    '=1': 'año',
    other: 'años',
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private petsService: PetsService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.sendUserId();

    this.activatedRoute.params.subscribe(({ id }) => {
      this.petId = id;
      this.petsService.getPetById(id).subscribe((pet) => {
        this.pet = pet;
        this.isLoading = false;
      });
    });
  }

  addComment() {
    this.router.navigateByUrl(`pets/${this.petId}/comments`);
  }
}
