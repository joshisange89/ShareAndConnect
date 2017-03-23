import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFire, FirebaseObjectObservable} from "angularfire2";
import { AF } from '../../providers/af';
import { User } from '../../user';

@Component({
  selector: 'app-itemdesc',
  templateUrl: './itemdesc.component.html',
  styleUrls: ['./itemdesc.component.css']
})

export class ItemdescComponent {

  item: FirebaseObjectObservable<any>;
  itemId: string;
  sinUser: any;
  itemUid: string;
  user: User;
  distance: number;

  constructor(af: AngularFire, route: ActivatedRoute, afService: AF){
    afService.getLoggedInUser().subscribe((user) => {
        this.sinUser = user;
    });
    this.itemId = route.snapshot.params['itemid'];
    this.itemUid = route.snapshot.params['uid'];
    this.distance = route.snapshot.params['dist'];

    this.item = af.database.object(`Users/${this.itemUid}/contactInfo`);
    this.item.subscribe( user => {
      this.user = user;
    });

    this.item = af.database.object(`Users/${this.itemUid}/postedItems/${this.itemId}`);
    this.item.subscribe(item => {
      this.item = item;
    });
  }
}
