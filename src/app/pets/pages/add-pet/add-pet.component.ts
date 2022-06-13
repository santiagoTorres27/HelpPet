import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  getDownloadURL,
  listAll,
  ref,
  Storage,
  uploadBytes,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Auth } from '@angular/fire/auth';
import { PetsService } from '../../services/pets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-pet',
  templateUrl: './add-pet.component.html',
  styleUrls: ['./add-pet.component.scss'],
})
export class AddPetComponent implements OnInit {
  isImgSelected: boolean = false;

  animalKind: string[] = ['dog', 'cat', 'bird', 'other'];

  addPetForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    kind: new FormControl(null, [Validators.required]),
    age: new FormControl(null, [Validators.required]),
    location: new FormControl(null, [Validators.required]),
  });

  constructor(
    private storage: Storage,
    private authService: AuthService,
    public auth: Auth,
    private petService: PetsService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  currentUserId?: string = '';

  ngOnInit(): void {
    this.currentUserId = this.auth.currentUser?.uid;

    this.authService.sendUserId();
  }

  submitForm() {
    if (this.addPetForm.invalid) {
      /*       this.snackbar.open('Debes rellenar todos los campos', 'OK', {
        duration: 2000,
      }); */
      Swal.fire({
        icon: 'warning',
        text: 'Debes rellenar todos los campos',
      });
    } else {
      Swal.fire({
        icon: 'question',
        text: '¿Estás seguro que deseas publicarlo?',
        showCancelButton: true,
        confirmButtonText: 'Si, quiero publicarlo!',
        cancelButtonText: 'Quizás más tarde',
        reverseButtons: true,
        confirmButtonColor: '#F2B84B',
      }).then((res) => {
        if (res.isConfirmed) {
          Swal.fire({
            title: '¡Tu mascota ha sido publicada!',
            icon: 'success',
            confirmButtonText: 'OK!',
            confirmButtonColor: '#F2B84B',
          }).then((res) => {
            if (res.isConfirmed) {
              //Upload pet
              this.uploadPet();

              this.router.navigateByUrl('/pets');
            }
          });
        }
      });
    }
  }

  imageUrl: string = '';
  fileUpload: any;

  showPreview(e: any) {
    if (e.target.files) {
      this.fileUpload = e.target.files[0];
      this.isImgSelected = true;
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
    }
  }

  uploadPet() {
    const file = this.fileUpload;
    const imgRef = ref(this.storage, `images/${file.name}`);
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
          //Uploading pet info
          const pet = {
            ...this.addPetForm.value,
            photoUrl: url,
            ownerId: this.currentUserId,
            postDate: new Date().toISOString(),
          };
          //console.log(url);
          this.petService
            .addPet(pet)
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    );
  }

  cancel() {
    this.router.navigateByUrl('pets');
  }
}
