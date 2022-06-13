import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PetsRoutingModule } from './pets-routing.module';
import { PetCardComponent } from './components/pet-card/pet-card.component';
import { PetsComponent } from './pages/pets/pets.component';
import { MaterialModule } from '../material/material.module';
import { PetDetailComponent } from './pages/pet-detail/pet-detail.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddPetComponent } from './pages/add-pet/add-pet.component';
import { HttpClientModule } from '@angular/common/http';
import { PetCommentsComponent } from './pages/pet-comments/pet-comments.component';
import { CommentComponent } from './components/comment/comment.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    PetCardComponent,
    PetsComponent,
    PetDetailComponent,
    ToolbarComponent,
    AddPetComponent,
    PetCommentsComponent,
    CommentComponent,
  ],
  imports: [
    CommonModule,
    PetsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
  ],
})
export class PetsModule {}
