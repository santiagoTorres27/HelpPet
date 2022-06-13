import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/auth/interfaces/user';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Comment } from '../../interfaces/comment.interface';
import { CommentsService } from '../../services/comments.service';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { UserService } from 'src/app/auth/services/user.service';
import { map } from 'rxjs/operators';
import { PetsService } from '../../services/pets.service';
import { Pet } from '../../interfaces/pet.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pet-comments',
  templateUrl: './pet-comments.component.html',
  styleUrls: ['./pet-comments.component.scss'],
})
export class PetCommentsComponent implements OnInit {
  petId = '';
  text = '';

  myProfile!: User;

  comments: Comment[] = [];
  myauth = getAuth();
  pet!: Pet;

  commentForm: FormGroup = new FormGroup({
    comment: new FormControl(null, [Validators.required]),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private commentsService: CommentsService,
    private usersService: UserService,
    private petsService: PetsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.sendUserId();

    this.activatedRoute.params.subscribe(({ id }) => {
      this.petId = id;
      this.petsService.getPetById(this.petId).subscribe((res) => {
        this.pet = res;
      });
    });

    this.getComments();

    onAuthStateChanged(this.myauth, (user) => {
      const id = user?.uid;

      if (id) {
        // Get user info
        this.usersService
          .getUserById(id)
          .pipe(map((res) => res.filter((pet) => pet.uid === id)))
          .subscribe((res) => {
            this.myProfile = res[0];
          });
      }
    });
  }

  getComments() {
    this.commentsService
      .fetchPosts(this.petId)
      .pipe(
        map((res) => {
          let list = res;
          list.sort((a, b) => (a.date < b.date ? 1 : -1));
          return list;
        })
      )
      .subscribe((res) => {
        this.comments = res;
      });
  }

  sendComment() {
    const comment: Comment = {
      userId: '1',
      text: this.commentForm.value['comment'],
      date: new Date(),
      emitterName: `${this.myProfile.name} ${this.myProfile.lastname}`,
      emitterImg: this.myProfile.imgUrl,
    };

    this.commentsService
      .addCommentByPet(this.petId, comment)
      .subscribe((res) => {
        this.getComments();
      });

    this.commentForm.reset();
  }
}
