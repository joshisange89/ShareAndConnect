import { Component, OnInit } from '@angular/core';
import { AF } from '../../providers/af';
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { DisplayPostedItem } from '../../displayposteditem';
import * as firebase from "firebase/app";
import { isUndefined } from "util";
import { PostItem } from '../../postitem';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {
  private firebase: any;
  private sinUser: any;
  private sinUserDetail: any;
  private nearbyUsers: any[] = [];
  private sortedNearByUsers: any[] = [];
  private displayPostedItem?: DisplayPostedItem;
  private displayPostedItems: DisplayPostedItem[] = [];
  private displayPostedItemsBk: DisplayPostedItem[] = [];
  private users: FirebaseListObservable<any[]>;
  private userProfileImage: any;
  searchItems: Observable<PostItem[]>;
  private searchTerms = new Subject<string>();

  constructor(private af: AngularFire, private afService: AF)  {
    console.log("Constructor called");
    this.userProfileImage = "../../../assets/avatar.png";
    this.firebase = firebase;

    afService.getLoggedInUser().subscribe((user) => {
      this.sinUser = user;
    });

    this.sinUserDetail = af.database.object(`Users/${this.sinUser.uid}/contactInfo`);
    this.sinUserDetail.subscribe(user => {
      this.sinUserDetail = user;
    });

    // Get all other users
    this.users = af.database.list('Users');

    this.users.subscribe((users) => {
      users.forEach((user) => {
        if (this.sinUserDetail.email != user.contactInfo.email) {
          let distance = this.calcDistance(
            this.sinUserDetail.latitude,
            this.sinUserDetail.longitude,
            user.contactInfo.latitude,
            user.contactInfo.longitude);
          if (distance < 10) {
            let selectUser = {
              "user": user,
              "distance": distance
            };
            this.nearbyUsers.push(selectUser);
          }
        }
      });
    });

    this.sortedNearByUsers = this.sortNearByUsers(this.nearbyUsers);

    this.sortedNearByUsers.forEach((sortedUser) => {
      if (!isUndefined(sortedUser.user.postedItems)) {
        for (var key in sortedUser.user.postedItems) {
          if (isUndefined(sortedUser.user.postedItems[key].sharedWith) || sortedUser.user.postedItems[key].sharedWith == "") {
            this.displayPostedItem = {
              postitemkey: key,
              postitem: sortedUser.user.postedItems[key],
              distance: sortedUser.distance,
              userkey: sortedUser.user.$key
            };
            this.displayPostedItems.push(this.displayPostedItem);
          }
        }
      }
    });
    this.displayPostedItemsBk = this.displayPostedItems;
    console.log(this.displayPostedItems);
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
    console.log("Init called");
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
    //this.searchTerms.next(term);
    let searchResultsObs: DisplayPostedItem[] = [];

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
    console.log("Filter by Search");
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
