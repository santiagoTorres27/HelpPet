import { Component, Inject, OnInit } from '@angular/core';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/auth/interfaces/user';
import { Pet } from 'src/app/pets/interfaces/pet.interface';
import { PetsService } from 'src/app/pets/services/pets.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-pet',
  templateUrl: './update-pet.component.html',
  styleUrls: ['./update-pet.component.scss'],
})
export class UpdatePetComponent implements OnInit {
  animalKind: string[] = ['dog', 'cat', 'bird', 'other'];

  updatePetForm!: FormGroup;

  constructor(
    private petsService: PetsService,
    private storage: Storage,
    private dialogRef: MatDialogRef<UpdatePetComponent>,
    @Inject(MAT_DIALOG_DATA) public myPet: Pet
  ) {}

  ngOnInit(): void {
    this.updatePetForm = new FormGroup({
      name: new FormControl(this.myPet.name, [Validators.required]),
      description: new FormControl(this.myPet.description, [
        Validators.required,
      ]),
      kind: new FormControl(this.myPet.kind, [Validators.required]),
      age: new FormControl(this.myPet.age, [Validators.required]),
      location: new FormControl(this.myPet.location, [Validators.required]),
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  updateProfile() {
    this.dialogRef.close();
  }

  updatePetProfile(url?: string) {
    const pet = { ...this.updatePetForm.value };

    let petUpdated = {
      ...this.myPet,
      ...pet,
    };

    if (url) {
      petUpdated = {
        ...petUpdated,
        photoUrl: url,
      };
    }

    this.petsService
      .updatePet(petUpdated, this.myPet.id!)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }

  submitChanges() {
    Swal.fire({
      icon: 'question',
      text: '¿Estás seguro que deseas actualizar los datos de tu masctoa?',
      showCancelButton: true,
      confirmButtonText: 'Si, quiero actualizarlos',
      cancelButtonText: 'Quizás más tarde',
      confirmButtonColor: '#F2B84B',
      reverseButtons: true,
    }).then((res) => {
      if (res.isConfirmed) {
        this.uploadPetImg();
        this.dialogRef.close(true);
      }
    });
  }

  isImgSelected: boolean = false;
  imageUrl: string = '';
  fileUpload: any;

  showPreview(e: any) {
    this.isImgSelected = true;
    if (e.target.files) {
      this.fileUpload = e.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
    }
  }

  // Upload changes
  uploadPetImg() {
    if (this.isImgSelected) {
      const file = this.fileUpload;
      const imgRef = ref(this.storage, `users/${file.name}`);
      const uploadTask = uploadBytesResumable(imgRef, file);
      uploadTask.on(
        'state_changed',
        () => {
          console.log('Uploading img...');
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            this.updatePetProfile(url);
          });
        }
      );
    } else {
      this.updatePetProfile();
    }

    this.dialogRef.close(true);
  }
}
