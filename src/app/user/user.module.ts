import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { UserPetComponent } from './components/user-pet/user-pet.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { UpdatePetComponent } from './components/update-pet/update-pet.component';
import { UserProfileCardComponent } from './components/user-profile-card/user-profile-card.component';
import { PetPreviewComponent } from './components/pet-preview/pet-preview.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    UserProfileComponent,
    UserPetComponent,
    MyProfileComponent,
    UpdateProfileComponent,
    UpdatePetComponent,
    UserProfileCardComponent,
    PetPreviewComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
  ],
})
export class UserModule {}
