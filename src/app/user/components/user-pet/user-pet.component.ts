import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Pet } from 'src/app/pets/interfaces/pet.interface';

@Component({
  selector: 'app-user-pet',
  templateUrl: './user-pet.component.html',
  styleUrls: ['./user-pet.component.scss'],
})
export class UserPetComponent implements OnInit {
  @Input() pet!: Pet;

  @Input() onMyPet = false;

  @Output() editPet: EventEmitter<string> = new EventEmitter();

  @Output() onDeletePet: EventEmitter<string> = new EventEmitter();

  @Output() onShowPet: EventEmitter<string> = new EventEmitter();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigate() {
    console.log(this.router.navigateByUrl(`/pets/${this.pet.id}`));
  }

  userPetEdit() {
    this.editPet.emit(this.pet.id);
  }

  deletePet() {
    this.onDeletePet.emit(this.pet.id);
  }

  showPetPreview() {
    this.onShowPet.emit(this.pet.id);
  }
}
