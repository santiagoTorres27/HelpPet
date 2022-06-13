import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pet } from '../../interfaces/pet.interface';

@Component({
  selector: 'app-pet-card',
  templateUrl: './pet-card.component.html',
  styleUrls: ['./pet-card.component.scss'],
})
export class PetCardComponent implements OnInit {
  @Input() pet!: Pet;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  goPetDetail() {
    this.router.navigateByUrl(`/pets/${this.pet.id}`);
  }
}
