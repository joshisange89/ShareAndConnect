import { Component } from '@angular/core';
import { AF } from '../../providers/af';
import { Router, ActivatedRoute} from "@angular/router";
import { ContactInfo } from '../../contactinfo';
declare let google: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user: ContactInfo;
  name: string;
  password: string;
  email: string;
  zipcode: string;
  address: string;
  mobileno: string;
  latitude: number;
  longitude: number;
  error: any;

  constructor(private afService: AF, private router: Router, route: ActivatedRoute) {}

  signup() {
    this.user = {
      name: this.name,
      password: this.password,
      email: this.email,
      zipcode: this.zipcode,
      address: this.address,
      mobileno: this.mobileno,
      latitude: this.latitude,
      longitude: this.longitude
    };

    this.getLatitudeLongitude(this.setLatLong, this.address+" "+this.zipcode, this.user);

    this.afService.signUp(this.email, this.password).then((newUser) => {
      this.afService.saveUserInfo(newUser.uid, this.user).then(() => {
        this.router.navigate(['']);
        //location.reload();
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
