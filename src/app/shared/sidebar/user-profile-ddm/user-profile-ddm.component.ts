import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-profile-ddm',
  templateUrl: './user-profile-ddm.component.html',
  styleUrls: ['./user-profile-ddm.component.css']
})
export class UserProfileDdmComponent implements OnInit {
  addUserImg = 'assets/table/userAddGray.svg';
  profilePicImg = 'assets/table/userUploadGray.svg';
  signoutVisible = false;
  signoutVisible1 = false;
  signoutVisible2 = false;
  signoutVisible3 = false;
  signoutVisible4 = false;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  onProfileImg(): void {
    this.profilePicImg = 'assets/table/userUploadBlue.svg';
  }

  outProfileImg(): void {
    this.profilePicImg = 'assets/table/userUploadGray.svg';
  }

  showSignout(): void {
    this.signoutVisible = true;
  }

  hideSignout(): void {
    this.signoutVisible = false;
  }

  showSignout1(): void {
    this.signoutVisible1 = true;
  }

  hideSignout1(): void {
    this.signoutVisible1 = false;
  }

  showSignout2(): void {
    this.signoutVisible2 = true;
  }

  hideSignout2(): void {
    this.signoutVisible2 = false;
  }

  showSignout3(): void {
    this.signoutVisible3 = true;
  }

  hideSignout3(): void {
    this.signoutVisible3 = false;
  }

  showSignout4(): void {
    this.signoutVisible4 = true;
  }

  hideSignout4(): void {
    this.signoutVisible4 = false;
  }

  onAddUserImg(): void {
    this.addUserImg = 'assets/table/userAddBlue.svg';
  }

  outAddUserImg(): void {
    this.addUserImg = 'assets/table/userAddGray.svg';
  }

  signOut(): void {

  }

}
