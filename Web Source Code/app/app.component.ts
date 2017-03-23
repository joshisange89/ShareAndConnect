import { Component } from '@angular/core';
import { AF } from './providers/af';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  isLoggedIn: boolean;

  constructor(public afService: AF, private router: Router) {
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
}
