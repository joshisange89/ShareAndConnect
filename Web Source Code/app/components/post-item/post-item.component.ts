import { Component, Inject } from '@angular/core';
import { AF } from '../../providers/af';
import { Router } from '@angular/router';
import { PostItem } from '../../postitem';
import {FirebaseApp, AngularFire} from 'angularfire2';
import * as firebase from "firebase/app";

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})

export class PostItemComponent {
  sinUser: any;
  item: PostItem;
  itemKey: any;
  itemImage: Array<File>;
  itemImageName: string;
  itemName: string;
  itemDesc: string;
  itemCare: string;
  itemDate: string;
  firebase: any;
  itemImageDefault: string;
  sharedWith: string = "";

  constructor(private af: AngularFire, private afService: AF,
              private router: Router, @Inject(FirebaseApp) firebaseApp: any) {
    this.firebase = firebase;
    this.itemImageDefault = "../../../assets/placeholder.jpg";
    afService.getLoggedInUser().subscribe((user) => {
      this.sinUser = user;
    });
  }

  fileChangeEvent(fileInput: any) {
    this.itemImage = <Array<File>> fileInput.target.files;
    this.itemImageName = this.itemImage[0].name;
    this.itemImageDefault = this.itemImage[0].name; //Initialization

    var reader = new FileReader();
    reader.readAsDataURL(this.itemImage[0]);

    reader.onload = (event: any) => {
      this.itemImageDefault = event.target.result;
    };
  }

  addItem() {
    this.item = {
      image: this.itemImageName,
      name : this.itemName,
      description: this.itemDesc,
      careInst: this.itemCare,
      availableDate: this.itemDate,
      sharedWith: this.sharedWith
    };

    this.afService.saveItemInfo(this.item, this.sinUser.uid).then((item) => {
       var imageRef = firebase.storage().ref()
         .child(`/users/${this.sinUser.uid}/postitems/${item.key}/${this.itemImage[0].name}`);

       imageRef.put(this.itemImage[0]).then( (location) => {
         this.afService.saveItemImageInfo(item.key, this.sinUser.uid, location.downloadURL);
         console.log('Uploaded Image File');
       });
      this.router.navigate(['home']);
    });
  }
}
