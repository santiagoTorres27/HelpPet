import { Component, OnInit, ViewChild } from '@angular/core';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { User } from 'src/app/auth/interfaces/user';
import { UserService } from 'src/app/auth/services/user.service';
import { map } from 'rxjs/operators';
import { PetsService } from 'src/app/pets/services/pets.service';
import { Pet } from 'src/app/pets/interfaces/pet.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MatTabGroup } from '@angular/material/tabs';
import { FormControl, FormControlName, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { UpdateProfileComponent } from '../../components/update-profile/update-profile.component';
import { UpdatePetComponent } from '../../components/update-pet/update-pet.component';
import { PetPreviewComponent } from '../../components/pet-preview/pet-preview.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  myauth = getAuth();
  myProfile!: User;
  myPets: Pet[] = [];

  @ViewChild('tabs') tabGroup!: MatTabGroup;
  showEditPage: boolean = false;
  showEditPet: boolean = false;

  updateProfileForm!: FormGroup;

  constructor(
    private usersService: UserService,
    private petsService: PetsService,
    private router: Router,
    private matDialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Verify if a user is logged in
    onAuthStateChanged(this.myauth, (user) => {
      const id = user?.uid;

      if (id) {
        this.authService.sendUserId();

        // Get user info
        this.usersService
          .getUserById(id)
          .pipe(map((res) => res.filter((pet) => pet.uid === id)))
          .subscribe((res) => {
            this.myProfile = res[0];
          });

        this.petsService
          .getAllPets()
          .pipe(map((res) => res.filter((pet) => pet.ownerId === id)))
          .subscribe((res) => {
            this.myPets = res;
          });
      }
    });
  }

  // Go to update pet page
  mattabInfo(edit: boolean) {
    const dialog = this.matDialog.open(UpdateProfileComponent, {
      data: this.myProfile,
    });

    dialog.afterClosed().subscribe((res) => {
      if (res) {
        Swal.fire({
          title: '¡Tu perfil ha sido actualizado!',
          icon: 'success',
          confirmButtonText: 'OK!',
          confirmButtonColor: '#F2B84B',
        });
      }
    });
  }

  // Show pet preview
  showPetPreview(id: string) {
    const dialog = this.matDialog.open(PetPreviewComponent, {
      data: id,
    });
  }

  getPetId(id: string) {
    const myPet = this.myPets.filter((pet) => pet.id === id);
    const dialog = this.matDialog.open(UpdatePetComponent, {
      data: myPet[0],
    });

    dialog.afterClosed().subscribe((res) => {
      if (res) {
        Swal.fire({
          title: '¡La información de tu mascota ha sido actualizada!',
          icon: 'success',
          confirmButtonText: 'OK!',
          confirmButtonColor: '#F2B84B',
        });
      }
    });
  }

  deletePet(id: string) {
    Swal.fire({
      icon: 'warning',
      text: '¿Estás seguro que deseas eliminar esta mascota?',
      showCancelButton: true,
      confirmButtonText: 'Si, quiero eliminarla!',
      cancelButtonText: 'No',
      reverseButtons: true,
      confirmButtonColor: '#F3594B',
    }).then((res) => {
      if (res.isConfirmed) {
        this.petsService
          .deletePet(id)
          .then(() => {
            Swal.fire({
              title: '¡Tu mascota ha sido eliminada!',
              icon: 'success',
              confirmButtonText: 'OK!',
              confirmButtonColor: '#F2B84B',
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }

  updateProfile() {
    Swal.fire({
      icon: 'question',
      text: '¿Estás seguro que deseas actualizar tu perfil?',
      showCancelButton: true,
      confirmButtonText: 'Si, quiero actualizarlo!',
      cancelButtonText: 'Quizás más tarde',
      reverseButtons: true,
      confirmButtonColor: '#F2B84B',
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire({
          title: '¡Tu perfil ha sido actualizado!',
          icon: 'success',
          confirmButtonText: 'OK!',
          confirmButtonColor: '#F2B84B',
        }).then((res) => {
          if (res.isConfirmed) {
            //Upload pet
            const userUpdated = {
              ...this.updateProfileForm.value,
              uid: this.myProfile.uid,
            };
            console.log(userUpdated, this.myProfile.id);

            this.usersService
              .updateUser(userUpdated, this.myProfile.id!)
              .then(() => {
                this.cancelUpdate();
                this.router.navigateByUrl('/profile');
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
      }
    });
  }

  updatePetProfile() {
    Swal.fire({
      icon: 'question',
      text: '¿Estás seguro que deseas actualizar la información de tu mascota?',
      showCancelButton: true,
      confirmButtonText: 'Si, quiero actualizarla!',
      cancelButtonText: 'Quizás más tarde',
      reverseButtons: true,
      confirmButtonColor: '#F2B84B',
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire({
          title: '¡La información de tu mascota ha sido actualizada!',
          icon: 'success',
          confirmButtonText: 'OK!',
          confirmButtonColor: '#F2B84B',
        }).then((res) => {
          if (res.isConfirmed) {
            //Upload pet
            console.log('Actualizando');
            this.cancelPetUpdate();
          }
        });
      }
    });
  }

  cancelUpdate() {
    this.showEditPage = false;
    this.tabGroup.selectedIndex = 0;
  }

  cancelPetUpdate() {
    this.showEditPet = false;
    this.tabGroup.selectedIndex = 1;
  }
}
