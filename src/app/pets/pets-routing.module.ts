import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPetComponent } from './pages/add-pet/add-pet.component';
import { PetDetailComponent } from './pages/pet-detail/pet-detail.component';
import { PetsComponent } from './pages/pets/pets.component';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { PetCommentsComponent } from './pages/pet-comments/pet-comments.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: PetsComponent,
      },
      {
        path: 'add',
        component: AddPetComponent,
        ...canActivate(() => redirectUnauthorizedTo(['/403'])),
      },
      {
        path: ':id',
        component: PetDetailComponent,
      },
      {
        path: ':id/comments',
        component: PetCommentsComponent,
        ...canActivate(() => redirectUnauthorizedTo(['/403'])),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetsRoutingModule {}
