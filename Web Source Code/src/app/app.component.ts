import { Component, Input } from '@angular/core';
import { AF } from './providers/af';
import { Router } from '@angular/router';
import { FirebaseApp } from "angularfire2";
import { Inject } from "@angular/core";
import { Notification } from './notification';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  private isLoggedIn: boolean;
  @Input() public notifications: Notification[] = [];
  private showNotification: boolean = false;

  constructor(public afService: AF, private router: Router,
              @Inject(FirebaseApp) private firebaseApp: firebase.app.App)  {

    this.afService.getLoggedInUser().subscribe((user) => {
        if (user != null) {
          this.isLoggedIn = true;
        }
      });
  }

  signOut(){
    this.afService.signout();
    this.router.navigate(['']);
    location.reload();
  }

  viewNotification() {
    console.log(this.showNotification);
    this.showNotification = !this.showNotification;
    this.afService.notificationRead();
    console.log(this.showNotification);
  }
}
