import { Component, Inject } from '@angular/core';
import { AF } from '../../providers/af';
import { Router } from '@angular/router';
import { PostItem } from '../../postitem';
import {FirebaseApp, AngularFire} from 'angularfire2';
import * as firebase from "firebase/app";
import {isUndefined} from "util";

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})

export class PostItemComponent {
  sinUser: any;
  item: PostItem;
  itemKey: any;
  imageArray: Array<File>;
  itemImage: string;
  name: string;
  description: string;
  careInst: string;
  availableDate: string;
  addedByUser: string;
  firebase: any;
  imageDefault: string;
  sharedWith: string = "";

  constructor(private af: AngularFire, private afService: AF,
              private router: Router, @Inject(FirebaseApp) firebaseApp: any) {
    this.firebase = firebase;
    this.imageDefault = "../../../assets/placeholder.jpg";
    afService.getLoggedInUser().subscribe((user) => {
      console.log("Logged In User");
      this.sinUser = user;
      console.log(this.sinUser);
    });
  }

  fileChangeEvent(fileInput: any) {
    this.imageArray = <Array<File>> fileInput.target.files;
    this.itemImage = this.imageArray[0].name;
    this.imageDefault = this.imageArray[0].name; //Initialization

    var reader = new FileReader();
    reader.readAsDataURL(this.imageArray[0]);

    reader.onload = (event: any) => {
      this.imageDefault = event.target.result;
    };
  }

  addItem() {
    this.item = {
      addedByUser: this.sinUser.uid,
      itemImage: this.imageDefault.replace("data:image/png;base64,", ""),
      name : this.name,
      description: this.description,
      careInst: this.careInst,
      availableDate: this.availableDate,
      sharedWith: this.sharedWith
    };

    this.afService.saveItemInfo(this.item).then((item) => {
       var imageRef = firebase.storage().ref()
         .child(`/users/${this.sinUser.uid}/postitems/${item.key}/${this.itemImage[0]}`);

       /*
       imageRef.put(this.imageArray[0]).then( (location) => {
         this.afService.saveItemImageInfo(item.key, location.downloadURL);
         console.log('Uploaded Image File');
       });
      */

      this.afService.getNearbyUsers().forEach((userObj) => {
        if(!isUndefined(userObj.user.wishList)){
          console.log("Near by user Wish List: ");
          console.log(userObj.user.wishList);
          for (let key in userObj.user.wishList ){
              let term = userObj.user.wishList[key].name.replace(/\ /g, "[a-z\\ ]*");
              let regex = new RegExp(term, "gi");
              if (regex.test(item.postitem.name)) {
                console.log(userObj.user.contactInfo.email);

                console.log("Please do a pre configuration of gmail as per doc");
            }
          }
        }
      });
      this.router.navigate(['home']);
    });
  }
}
