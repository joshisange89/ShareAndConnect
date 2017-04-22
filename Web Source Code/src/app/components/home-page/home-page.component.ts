import { Component, OnInit } from '@angular/core';
import { AF } from '../../providers/af';
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { DisplayPostedItem } from '../../displayposteditem';
import * as firebase from "firebase/app";
import { isUndefined } from "util";
import { PostItem } from '../../postitem';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
import { UserDist } from '../../userdist';
import { FirebaseApp } from "angularfire2";
import { Inject, NgZone } from "@angular/core";

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import {AppComponent} from "../../app.component";

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})

export class HomePageComponent  {
  private firebase: any;
  private sinUser: any;
  private sinUserDetail: any = null;
  private nearbyUsers: UserDist[] = [];
  private sortedNearByUsers: any[] = [];
  private displayPostedItem?: any;
  private displayPostedItems: any[] = [];
  private displayPostedItemsBk: any[] = [];
  private users: FirebaseListObservable<any[]>;
  private profileImage: any;
  private searchItems: Observable<PostItem[]>;
  private searchTerms = new Subject<string>();
  private notifications: any;
  private showContent: any = false;

  constructor(private af: AngularFire, private afService: AF, appComp: AppComponent,
              @Inject(FirebaseApp) private firebaseApp: firebase.app.App, zone: NgZone) {
    this.profileImage = "../../../assets/avatar.png";

    setTimeout(()=>this.showContent=true, 3000);

    af.auth.subscribe((user) => {
      this.sinUser = user;
        af.database.object(`Users/${user.uid}/contactInfo`)
          .subscribe((userDetail) => {
            console.log("Logged In User Details");
            this.sinUserDetail = userDetail;
            console.log(this.sinUserDetail);
            var profileImage = this.sinUserDetail.image;
            this.sinUserDetail.image = new Image();
            this.sinUserDetail.image.setAttribute('src', "data:image/png;base64," + profileImage);
          });

          this.afService.getAllNotifications(this.sinUser.uid).subscribe((notifications) => {
            appComp.notifications = [];
            notifications.forEach((notification) => {
                this.afService.getNotificationDetail(notification.$key).subscribe((note) => {
                  appComp.notifications.push(note);
                });
            });
          });

          afService.getAllData().subscribe((users) => {
            console.log("All Users: ");
            console.log(users);
            this.displayPostedItems = [];
            users.forEach((user) => {
              console.log("Each User: ")
              console.log(user);
              if (this.sinUserDetail.email != user.contactInfo.email) {
                let distance = this.calcDistance(
                  this.sinUserDetail.latitude,
                  this.sinUserDetail.longitude,
                  user.contactInfo.latitude,
                  user.contactInfo.longitude);
                console.log("Distance: ", distance);
                if (distance < 100) {
                  let selectUser = {
                    "user": user,
                    "distance": distance
                  };
                  this.nearbyUsers.push(selectUser);
                  console.log("Near by Users: ");
                  console.log(this.nearbyUsers);
                }
              }
            });

            // Sort by distance and create array
            this.sortedNearByUsers = this.sortNearByUsers(this.nearbyUsers);
            afService.setSortedNearByUsers(this.sortedNearByUsers);

            // Retrieve required values from Array sorted by distance
            this.sortedNearByUsers.forEach((sortedUser) => {
              this.displayPostedItems = [];
              console.log(sortedUser.user.postedItems);
              if (!isUndefined(sortedUser.user.postedItems)) {
                for (var key in sortedUser.user.postedItems) {
                  if (isUndefined(sortedUser.user.postedItems[key].sharedWith) ||
                    sortedUser.user.postedItems[key].sharedWith == "") {
                    this.displayPostedItem = {
                      postitemkey: key,
                      postitem: sortedUser.user.postedItems[key],
                      distance: sortedUser.distance,
                      userkey: sortedUser.user.$key
                    };
                    var itemImg = this.displayPostedItem.postitem.itemImage;
                    this.displayPostedItem.postitem.itemImage  = new Image();
                    this.displayPostedItem.postitem.itemImage.setAttribute('src', "data:image/png;base64," + itemImg);
                    this.displayPostedItems.push(this.displayPostedItem);
                  }
                }
              }
            });
            console.log("Near by Posted Items");
            console.log(this.displayPostedItems);
          });
        });
  }

  sortNearByUsers(array) {
    return array.sort((a, b) => a.distance - b.distance);
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

  ngOnInit(): void {

    this.searchItems = this.searchTerms
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(term => term ? this.filterBySearch(term)
      : Observable.of<PostItem[]>([]))
      .catch(error => {
        console.log(error);
        return Observable.of<PostItem[]>([]);
      });
  }

  search(term: string) {
    let searchResultsObs: DisplayPostedItem[] = [];
    this.displayPostedItemsBk = this.displayPostedItems;

    if (term) {
      this.displayPostedItems.forEach((item) => {
        var regex = new RegExp(term, "gi");
        if (regex.test(item.postitem.name)) {
          searchResultsObs.push(item);
        }
      });
      this.displayPostedItems = searchResultsObs;
      console.log(this.displayPostedItems);
    } else {
      console.log("Term is empty");
      this.displayPostedItems = this.displayPostedItemsBk;
    }
  }

  filterBySearch(term: string): Observable<PostItem[]> {
    let searchResultsObs: Observable<Array<PostItem>>;

    this.displayPostedItems.forEach((item) => {
      var regex = new RegExp(term, "gi");
      if (regex.test(item.postitem.name)) {
        searchResultsObs = new Observable(observer => {
          observer.next(item.postitem.name);
        });
      }
    });
    return searchResultsObs;
  }
}
