import { Component } from '@angular/core';
import { AF } from '../../providers/af';
import { Router, ActivatedRoute} from "@angular/router";
import { ContactInfo } from '../../contactinfo';
declare let google: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})

export class LandingComponent {
  user: ContactInfo;
  uid: string = "";
  name: string;
  password: string;
  email: string;
  zipcode: string;
  address: string;
  mobileno: number;
  latitude: number;
  longitude: number;
  error: any;

  constructor(private afService: AF, private router: Router, route: ActivatedRoute) {}

  signin(email, password) {
    this.afService.signin(email, password).then((user) => {
      this.router.navigate(['/home'])
    })
      .catch((error: any) => {
        if (error) {
          this.error = "This User doesn't exist, Please Sign Up";
        }
      });
  }

  signup() {
    this.user = {
      name: this.name,
      image: "",
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
