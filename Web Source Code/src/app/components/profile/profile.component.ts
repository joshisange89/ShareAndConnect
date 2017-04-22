import { Component, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseListObservable, AngularFire } from 'angularfire2';
import { AF } from '../../providers/af';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { ShareModalContext, ShareModalComponent } from '../share-modal/share-modal.component';
import * as firebase from "firebase/app";
import {isUndefined} from "util";
import { UserDist } from '../../userdist';
import { Observable } from 'rxjs/Observable';
import {ChangeDetectorRef} from '@angular/core'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {
  items: FirebaseListObservable<any>;
  wishitems: FirebaseListObservable<any>;
  sinUser: any;
  sinUserDetail: any = null;
  profileImage: any;
  sinUserPostedItems: any;
  sinUserWishList: any;
  wishList: any[] = [];
  postedItems: any[] = [];
  sortedNearByUsers: UserDist[] = [];
  mobileRead: boolean = true;
  addressRead: boolean = true;
  profileImageName: string;
  profileImageDefault: string;
  isShared: boolean = false;
  isNoWishList: boolean = false;

  constructor(private af: AngularFire, private afService: AF, private router: Router,
              overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) {
    overlay.defaultViewContainer = vcRef;
    this.profileImageDefault = "../../../assets/avatar.png";
    this.items = af.database.list('/items');
    this.wishitems = af.database.list('/wishitems');

    afService.getLoggedInUser().subscribe((user) => {
      this.sinUser = user;
      af.database.object(`Users/${user.uid}/contactInfo`)
        .subscribe((userDetail) => {
          this.sinUserDetail = userDetail;
          console.log("Signed In User");
          console.log(this.sinUserDetail);
          var profileImage = this.sinUserDetail.image;
          this.sinUserDetail.image = new Image();
          this.sinUserDetail.image.setAttribute('src', "data:image/png;base64," + profileImage);
        });

      this.sortedNearByUsers = this.afService.getNearbyUsers();
      this.sinUserPostedItems = af.database.object(`Users/${this.sinUser.uid}/postedItems`);
      this.sinUserPostedItems.subscribe(items => {
        this.postedItems = [];
        this.sinUserPostedItems = items;

        console.log("Posted Items by logged in User");
        console.log(this.sinUserPostedItems);
        if (isUndefined(this.sinUserPostedItems.$value)) {
          for (var key in this.sinUserPostedItems) {
            var postItem: any = {};
            postItem.key = key;
            postItem.name = this.sinUserPostedItems[key].name;
            postItem.itemImage = new Image();
            postItem.itemImage.setAttribute('src', "data:image/png;base64," + this.sinUserPostedItems[key].itemImage);
            postItem.availableDate = this.sinUserPostedItems[key].availableDate;

            if (this.sinUserPostedItems[key].sharedWith != "") {
              this.sortedNearByUsers.forEach((userDist) => {
                if (userDist.user.contactInfo.email == this.sinUserPostedItems[key].sharedWith) {
                  postItem.sharedWith = userDist.user.contactInfo.name;
                  postItem.sharedWithEmail = this.sinUserPostedItems[key].sharedWith;
                  postItem.shared = true;
                }
              });
            }
            this.postedItems.push(postItem);
          }
        }
      });

      console.log(this.sinUser.uid);
      this.sinUserWishList = af.database.list(`Users/${this.sinUser.uid}/wishList`);
      this.sinUserWishList.subscribe(items => {
        this.sinUserWishList = items;
      });
      console.log(this.sinUserWishList);
      /*
      if (this.sinUserWishList.$value != null) {
        for (var key in this.sinUserWishList) {
          var wish: any = {};
          wish.key = key;
          wish.name = this.sinUserWishList[key].name;
          wish.requiredDate = this.sinUserWishList[key].requiredDate;
          this.wishList.push(wish);
        }
      } else {
        this.isNoWishList = true;
      }
      console.log(this.wishList);
      */
    });
  }

  fileChangeEvent(fileInput: any) {
    this.profileImage = <Array<File>> fileInput.target.files;
    this.profileImageName = this.profileImage[0].name;
    this.profileImageDefault = this.profileImage[0].name; //Initialization

    var reader = new FileReader();
    reader.readAsDataURL(this.profileImage[0]);

    reader.onload = (event: any) => {
      this.profileImageDefault = event.target.result;
    };

    var imageRef = firebase.storage().ref()
      .child(`/users/${this.sinUser.uid}/${this.profileImage[0].name}`);

      imageRef.put(this.profileImage[0]).then( (location) => {
        this.afService.saveProfileImageInfo(location.downloadURL);
        console.log('Uploaded Image File');
      });
  }

  editName(){
    this.afService.saveUserName(this.sinUserDetail.name);
  }

  editAddress(){
    this.afService.saveUserAddress(this.sinUserDetail.address);
  }

  editMobileno(){
    this.afService.saveUserMobileNo(this.sinUserDetail.mobileno);
  }

  shareItem(itemkey) {
    return this.modal.open(ShareModalComponent, overlayConfigFactory(
      {itemkey: itemkey, owner: this.sinUser.uid},
      BSModalContext));
  }

  unShare(itemkey) {
    this.afService.unshareItem(itemkey);
  }

  changeStatus(event, itemkey) {
    console.log(event.target.checked);

    if (event.target.checked) {
      this.shareItem(itemkey);
    } else {
      this.unShare(itemkey);
    }
  }

  updateItem(key: string, newText: string) {
    this.items.update(key, { text: newText} );
  }

  deleteItem(key: string) {
    this.afService.deleteItem(key);
    location.reload();
  }

  updateWishItem(key: string, newText: string) {
    this.wishitems.update(key, { text: newText} );
  }

  deleteWishItem(key: string) {
    console.log(key);
    this.afService.deleteWishItem(key);
  }

  deleteAllWishItems() {
    this.wishitems.remove();
  }
}
