import { Component } from '@angular/core';
import { AF } from '../../providers/af';
import { Router } from '@angular/router';
import { WishList } from '../../wishlist';
import { Http, Headers } from '@angular/http'

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})

export class WishListComponent {
  addedByUser: string;
  name: string;
  comments: string;
  requiredDate: string;
  wishList: WishList;
  sinUser: any;
  sinUserDetail: any;

  constructor(private afService: AF, private router: Router, private http: Http) {
    afService.getLoggedInUser().subscribe((user) => {
      console.log(user);
      this.sinUser = user;
    });

    this.afService.getLoggedInUserDetail(this.sinUser.uid).subscribe((user) => {
      console.log(user);
      this.sinUserDetail = user;
    })
  }

  addToWishList(){
    this.wishList = {
      addedByUser: this.sinUser.uid,
      name: this.name,
      comments: this.comments,
      requiredDate: this.requiredDate
    };

    this.afService.saveWishListInfo(this.wishList).then(()=> {
      let notification = {
        "item": this.name,
        "postedBy": this.sinUserDetail.name,
        "postedByUid": this.sinUser.uid,
        "latitude": this.sinUserDetail.latitude,
        "longitude": this.sinUserDetail.longitude
      };
      this.afService.saveNotification(notification).then((note) => {
        console.log("Notification Saved", note);
        //this.router.navigate(['home']);
        this.afService.updateNearByUsersWithNotification(note.key);
      });
    });
  }
}
