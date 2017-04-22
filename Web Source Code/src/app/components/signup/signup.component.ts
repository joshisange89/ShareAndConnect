import { Component } from '@angular/core';
import { AF } from '../../providers/af';
import { Router, ActivatedRoute} from "@angular/router";
import { ContactInfo } from '../../contactinfo';
declare let google: any;
import { FirebaseApp } from "angularfire2";
import { Inject } from "@angular/core";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  private user: ContactInfo;
  private name: string;
  private password: string;
  private email: string;
  private zipcode: string;
  private address: string;
  private mobileno: number;
  private latitude: number;
  private longitude: number;
  private uid: string = "";
  private error: any;
  private image: any = "";
  private messaging: firebase.messaging.Messaging;

  constructor(private afService: AF, private router: Router, route: ActivatedRoute, @Inject(FirebaseApp) private firebaseApp: firebase.app.App) {}

  signup() {

    this.user = {
      name: this.name,
      image: this.image,
      password: this.password,
      email: this.email,
      zipcode: this.zipcode,
      address: this.address,
      mobileno: this.mobileno,
      latitude: this.latitude,
      longitude: this.longitude,
      uid: this.uid
    };

    this.getLatitudeLongitude(this.setLatLong, this.address+" "+this.zipcode, this.user);

    this.afService.signUp(this.email, this.password).then((newUser) => {
      this.afService.saveUserInfo(newUser.uid, this.user).then(() => {

        /*
        this.messaging = firebase.messaging(this.firebaseApp);
        this.messaging.requestPermission().then(() => {
          this.messaging.getToken().then((token) => {
            console.log("Token granted", token);
            this.afService.saveUserToken(token).then();
          });
        });
        */

        this.router.navigate(['']);
      })
        .catch((error) => {
          this.error = error;
        });
    })
      .catch((error) => {
        this.error = error;
        console.log(this.error);
      });
  }

  getLatitudeLongitude(callback, address, user) {
    let geocoder = new google.maps.Geocoder();
    if (geocoder) {
      geocoder.geocode({'address': address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          return callback(results[0], user);
        }
      });
    }
  }

  setLatLong(result, user) {
    user.latitude = result.geometry.location.lat();
    console.log(user.latitude);
    user.longitude = result.geometry.location.lng();
    console.log(user.longitude);
  }

}
