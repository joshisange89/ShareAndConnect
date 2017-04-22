/**
 * Created by Aparna on 3/6/17.
 */

import { Injectable } from "@angular/core";
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState} from 'angularfire2';
import {Observable} from "rxjs";
import {PostItem} from "../postitem";
import {isUndefined} from "util";
import { UserDist } from '../userdist';

@Injectable()
export class AF {
  private allData: any;
  private sinUserUid: any;
  private nearbyUsers: UserDist[] = [];
  private sortedNearByUsers: any[] = [];

  constructor(public af: AngularFire) {
  }

  calcDistance(lat1, long1, lat2, long2) {
    var R = 6371; // km (change this constant to get miles)
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (long2 - long1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    if (d > 1) return Math.round(d * 0.62);
    else if (d <= 1) return Math.round(d * 1000 * 0.0006);
    return d;
  }

  getLoggedInUser() {
    return this.af.auth;
  }

  getLoggedInUserDetail(uid) {
    this.sinUserUid = uid;
    return this.af.database.object(`Users/${uid}/contactInfo`);
  }

  getAllData() {
    return this.af.database.list('Users');
  }

  setSortedNearByUsers(sortedNearByUsers) {
    this.sortedNearByUsers = sortedNearByUsers;
  }

  getNearbyUsers() {
    return this.sortedNearByUsers;
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
      longitude: user.longitude,
      uid: uid
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

  saveProfileImageInfo(downloadUrl) {
    return this.af.database.object(`Users/${this.sinUserUid}/contactInfo/`).update({
      image: downloadUrl
    })
  }

  saveItemInfo(item) {
    console.log(item);
    return this.af.database.list(`Users/${this.sinUserUid}/postedItems`).push({
      addedByUser: this.sinUserUid,
      itemImage: item.itemImage,
      name: item.name,
      description: item.description,
      careInst: item.careInst,
      availableDate: item.availableDate,
      shared: "",
    });
  }

  saveItemImageInfo(itemkey, downloadUrl) {
    return this.af.database.object(`Users/${this.sinUserUid}/postedItems/${itemkey}/`).update({
      image: downloadUrl
    })
  }

  saveWishListInfo(item) {
    return this.af.database.list(`Users/${this.sinUserUid}/wishList`).push({
      addedByUser: this.sinUserUid,
      name: item.name,
      comments: item.comments,
      requiredDate: item.requiredDate
    });
  }

  saveUserName(name) {
    return this.af.database.object(`Users/${this.sinUserUid}/contactInfo/`).update({
      name: name
    });
  }

  saveUserAddress(userAddress) {
    return this.af.database.object(`Users/${this.sinUserUid}/contactInfo/`).update({
      address: userAddress
    });
  }

  saveUserMobileNo(userMobileno) {
    return this.af.database.object(`Users/${this.sinUserUid}/contactInfo/`).update({
      mobileno: userMobileno
    });
  }

  shareItem(key, sharedWith) {
    return this.af.database.object(`Users/${this.sinUserUid}/postedItems/${key}/`).update({
      sharedWith: sharedWith
    });
  }

  unshareItem(itemkey) {
    var date = new Date();
    return this.af.database.object(`Users/${this.sinUserUid}/postedItems/${itemkey}/`).update({
      availableDate: date,
      sharedWith: ""
    });
  }

  deleteItem(key) {
    return this.af.database.object(`Users/${this.sinUserUid}/postedItems/${key}`).remove().then(() => {
      console.log("Deleted");
    });
  }

  deleteWishItem(key) {
    return this.af.database.object(`Users/${this.sinUserUid}/wishList/${key}`).remove().then(() => {
      console.log("Deleted");
    })
  }

  saveNotification(notification) {
    return this.af.database.list(`Notifications`).push({
      item: notification.item,
      postedBy: notification.postedBy,
      latitude: notification.latitude,
      longitude: notification.longitude
    });
  }

  updateNearByUsersWithNotification(notiId) {
    this.sortedNearByUsers.map((userDist) => {
      this.af.database.object(`Users/${userDist.user.$key}/notifications/${notiId}`).set({
        isRead: false
      });
    });
  }

  getAllNotifications(uid) {
    this.sinUserUid = uid;
    return this.af.database.list(`Users/${uid}/notifications/`, {
      query: {
        isRead: false
      }
    });
  }

  getNotificationDetail(key) {
    return this.af.database.object(`Notifications/${key}`);
  }

  notificationRead() {
    console.log("Logged in user");
    console.log(this.sinUserUid);
    return this.af.database.list(`Users/${this.sinUserUid}/notifications/`)
      .subscribe((notifications) => {
        notifications.forEach((notification) => {
          this.af.database.object(`Users/${this.sinUserUid}/notifications/${notification.$key}`).update({
              isRead: true
          });
        });
      })
  }
}


