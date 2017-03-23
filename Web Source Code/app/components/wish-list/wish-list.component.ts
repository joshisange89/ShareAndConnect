import { Component } from '@angular/core';
import { AF } from '../../providers/af';
import { Router } from '@angular/router';
import { WishList } from '../../wishlist';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})

export class WishListComponent {
  name: string;
  comments: string;
  requiredDate: string;
  wishList: WishList;
  sinUser: any;

  constructor(private afService: AF, private router: Router) {
    afService.getLoggedInUser().subscribe((user) => {
      this.sinUser = user;
    });
  }

  addToWishList(){
    this.wishList = {
      name: this.name,
      comments: this.comments,
      requiredDate: this.requiredDate
    };

    this.afService.saveWishListInfo(this.wishList, this.sinUser.uid).then(()=> {
      this.router.navigate(['home']);
    });
  }
}
