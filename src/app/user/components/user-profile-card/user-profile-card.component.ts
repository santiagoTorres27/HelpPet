import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/auth/interfaces/user';

@Component({
  selector: 'app-user-profile-card',
  templateUrl: './user-profile-card.component.html',
  styleUrls: ['./user-profile-card.component.scss'],
})
export class UserProfileCardComponent implements OnInit {
  @Input() user!: User;

  @Input() onMyProfile = false;

  @Output() onEditProfile: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  mattabInfo() {
    this.onEditProfile.emit(true);
  }
}
