import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Pet } from 'src/app/pets/interfaces/pet.interface';
import { PetsService } from 'src/app/pets/services/pets.service';

@Component({
  selector: 'app-pet-preview',
  templateUrl: './pet-preview.component.html',
  styleUrls: ['./pet-preview.component.scss'],
})
export class PetPreviewComponent implements OnInit {
  pet!: Pet;
  isLoading = false;

  constructor(
    private petsService: PetsService,
    @Inject(MAT_DIALOG_DATA) public userId: string,
    private router: Router,
    private dialogRef: MatDialogRef<PetPreviewComponent>
  ) {}

  ngOnInit(): void {
    this.petsService.getPetById(this.userId).subscribe((pet) => {
      this.pet = pet;
    });
  }

  goOwnerPage() {
    this.router.navigateByUrl(`user/${this.pet.ownerId}`);
    this.dialogRef.close();
  }

  addComment() {
    this.router.navigateByUrl(`pets/${this.pet.id}/comments`);
    this.dialogRef.close();
  }
}
