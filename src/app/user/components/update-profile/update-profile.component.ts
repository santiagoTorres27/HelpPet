import { Component, Inject, OnInit } from '@angular/core';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/auth/interfaces/user';
import { UserService } from 'src/app/auth/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss'],
})
export class UpdateProfileComponent implements OnInit {
  updateProfileForm!: FormGroup;

  constructor(
    private usersService: UserService,
    private storage: Storage,
    private dialogRef: MatDialogRef<UpdateProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public myProfile: User
  ) {}

  ngOnInit(): void {
    this.updateProfileForm = new FormGroup({
      name: new FormControl(this.myProfile.name),
      lastname: new FormControl(this.myProfile.lastname),
      location: new FormControl(this.myProfile.location),
      phone: new FormControl(this.myProfile.phone),
      email: new FormControl(this.myProfile.email),
      aboutMe: new FormControl(this.myProfile.aboutMe),
    });
  }

  cancel() {
    this.dialogRef.close();
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

  // Accept changes
  submitChanges() {
    Swal.fire({
      icon: 'question',
      text: '¿Estás seguro que deseas actualizar los datos de tu perfil?',
      showCancelButton: true,
      confirmButtonText: 'Si, quiero actualizarlos',
      cancelButtonText: 'Quizás más tarde',
      confirmButtonColor: '#F2B84B',
      reverseButtons: true,
    }).then((res) => {
      if (res.isConfirmed) {
        this.uploadUserImg();
        this.dialogRef.close(true);
      }
    });
  }

  // Update user profile
  updateProfile(url?: string) {
    let userUpdated = {
      ...this.updateProfileForm.value,
      uid: this.myProfile.uid,
      imgUrl: this.myProfile.imgUrl,
    };

    if (url) {
      userUpdated = {
        ...userUpdated,
        imgUrl: url,
      };
    }

    this.usersService
      .updateUser(userUpdated, this.myProfile.id!)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }

  // Upload changes
  uploadUserImg() {
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
            this.updateProfile(url);
          });
        }
      );
    } else {
      this.updateProfile();
    }

    this.dialogRef.close(true);
  }
}
