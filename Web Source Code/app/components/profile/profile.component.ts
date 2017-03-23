import { Component, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseListObservable, AngularFire } from 'angularfire2';
import { AF } from '../../providers/af';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { ShareModalContext, ShareModalComponent } from '../share-modal/share-modal.component';
import * as firebase from "firebase/app";
import {isUndefined} from "util";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {
  items: FirebaseListObservable<any>;
  wishitems: FirebaseListObservable<any>;
  sinUser: any;
  sinUserDetail: any;
  profileImage: any;
  sinUserPostedItems: any;
  sinUserWishList: any;
  wishList: any[] = [];
  postedItems: any[] = [];
  allUsers: any[];
  nameRead: boolean = true;
  addressRead: boolean = true;
  profileImageName: string;
  profileImageDefault: string;

  constructor(private af: AngularFire, private afService: AF, private router: Router,
              overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) {
    overlay.defaultViewContainer = vcRef;
    this.profileImage = "../../../assets/avatar.png";
    this.items = af.database.list('/items');
    this.wishitems = af.database.list('/wishitems');
    this.allUsers = this.afService.getAllUsers();

    afService.getLoggedInUser().subscribe((user) => {
      this.sinUser = user;
    });

    console.log(this.sinUser);
    this.sinUserDetail = af.database.object(`Users/${this.sinUser.uid}/contactInfo`);
    this.sinUserDetail.subscribe(user => {
      this.sinUserDetail = user;
    });

    this.sinUserPostedItems = af.database.object(`Users/${this.sinUser.uid}/postedItems`);
    this.sinUserPostedItems.subscribe(items => {
      this.sinUserPostedItems = items;
    });

    if (isUndefined(this.sinUserPostedItems.$value)) {
      for (var key in this.sinUserPostedItems) {
        var postItem: any = {};
        postItem.key = key;
        postItem.name = this.sinUserPostedItems[key].name;
        console.log(this.sinUserPostedItems[key].name);
        postItem.image = this.sinUserPostedItems[key].image;
        postItem.availableDate = this.sinUserPostedItems[key].availableDate;

        if (this.sinUserPostedItems[key].sharedWith != "") {
          this.allUsers.forEach((user) => {
            if (user.email == this.sinUserPostedItems[key].sharedWith) {
              postItem.sharedWith = user.name;
              postItem.sharedWithEmail = this.sinUserPostedItems[key].sharedWith;
              postItem.shared = true;
            }
          });
        }
        this.postedItems.push(postItem);
      }
    }

    this.sinUserWishList = af.database.object(`Users/${this.sinUser.uid}/wishList`);
    this.sinUserWishList.subscribe(items => {
      this.sinUserWishList = items;
    });

    console.log(this.sinUserWishList);

    for (var key in this.sinUserWishList) {
      var wish: any = {};
      wish.key = key;
      wish.name = this.sinUserWishList[key].name;
      wish.requiredDate = this.sinUserWishList[key].requiredDate;
      this.wishList.push(wish);
    }

    console.log(this.wishList);
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
        this.afService.saveProfileImageInfo(this.sinUser.uid, location.downloadURL);
        console.log('Uploaded Image File');
      });
  }

  editName(){
    //this.afService.saveUserName(this.sinUser.uid, this.sinUserDetail.name);
  }

  editAddress(){
    this.afService.saveUserName(this.sinUser.uid, this.sinUserDetail.address);
  }

  editMobileno(){
    this.afService.saveUserName(this.sinUser.uid, this.sinUserDetail.mobileno);
  }

  shareItem(itemkey) {
    return this.modal.open(ShareModalComponent, overlayConfigFactory(
      {itemkey: itemkey, owner: this.sinUser.uid},
      BSModalContext));
  }

  UnShare(itemkey) {
    this.afService.unshareItem(itemkey);
  }

  changeStatus(event, itemkey) {
    if (event) {
      this.shareItem(itemkey);
    } else {
      this.UnShare(itemkey);
    }
  }

  updateItem(key: string, newText: string) {
    this.items.update(key, { text: newText} );
  }

  deleteItem(key: string) {
    this.afService.deleteItem(key, this.sinUser.uid);
    location.reload();
  }

  updateWishItem(key: string, newText: string) {
    this.wishitems.update(key, { text: newText} );
  }

  deleteWishItem(key: string) {
    this.wishitems.remove(key);
  }

  deleteAllWishItems() {
    this.wishitems.remove();
  }
}
