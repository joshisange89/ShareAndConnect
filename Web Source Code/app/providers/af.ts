/**
 * Created by makarandpuranik on 3/6/17.
 */

import { Injectable } from "@angular/core";
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState} from 'angularfire2';
import {Observable} from "rxjs";
import {PostItem} from "../postitem";
import {isUndefined} from "util";

@Injectable()
export class AF {
  allData: any;
  allUserDetails: any[] = [];
  sinUser: any;

  constructor(public af: AngularFire) {
    this.sinUser = this.af.auth.subscribe((user) => {
      this.sinUser = user;
    });

    this.allData = this.af.database.list('Users');
    this.allData.subscribe( (users) => {
      users.forEach((user) => {
        let userDetail = {
          key: user.$key,
          name: user.contactInfo.name,
          email: user.contactInfo.email
        };
        this.allUserDetails.push(userDetail);
      });
    });
  }

  getLoggedInUser(){
    return this.af.auth;
  }

  signUp(email, password) {
    return this.af.auth.createUser({
      email: email,
      password: password
    });
  }

  saveUserInfo(uid, user) {
    return this.af.database.object(`Users/${uid}/contactInfo`).set({
      name: user.name,
      email: user.email,
      zipcode: user.zipcode,
      address: user.address,
      mobileno: user.mobileno,
      latitude: user.latitude,
      longitude: user.longitude
    });
  }

  signin(email, password) {
    return this.af.auth.login({
      email: email,
      password: password,
    },
      {
        provider: AuthProviders.Password,
        method: AuthMethods.Password,
    });
  }

  signout() {
    return this.af.auth.logout();
  }

  getAllUsers() {
    return this.allUserDetails;
  }

  saveProfileImageInfo(uid, downloadUrl) {
    return this.af.database.object(`Users/${uid}/contactInfo/`).update({
      image: downloadUrl
    })
  }

  saveItemInfo(item, uid) {
    return this.af.database.list(`Users/${uid}/postedItems`).push({
      image: item.image,
      name: item.name,
      description: item.description,
      careInst: item.careInst,
      availableDate: item.availableDate
    });
  }

  saveItemImageInfo(itemkey, uid, downloadUrl) {
    return this.af.database.object(`Users/${uid}/postedItems/${itemkey}`).update({
      image: downloadUrl
    })
  }

  saveWishListInfo(item, uid) {
    return this.af.database.list(`Users/${uid}/wishList`).push({
      name: item.name,
      comments: item.comments,
      requiredDate: item.requiredDate
    });
  }

  saveUserName(uid, userName){
      return this.af.database.list(`Users/${uid}/contactInfo`).push({
        name: userName
      });
  }

  saveUserAddress(uid, userAddress){
    return this.af.database.list(`Users/${uid}/contactInfo`).push({
      address: userAddress
    });
  }

  saveUserMobileNo(uid, userMobileno){
    return this.af.database.list(`Users/${uid}/contactInfo`).push({
      mobileno: userMobileno
    });
  }

  shareItem(key, uid, sharedWith) {
    return this.af.database.object(`Users/${uid}/postedItems/${key}`).update({
      sharedWith: sharedWith
    });
  }

  unshareItem(itemkey) {
    return this.af.database.object(`Users/${this.sinUser.uid}/postedItems/${itemkey}`).update({
      sharedWith: ""
    })
  }

  deleteItem(key, uid) {
    this.af.database.object(`Users/${uid}/postedItems/${key}`).remove().then(() => {
      console.log("Deleted");
    });
  }
}
