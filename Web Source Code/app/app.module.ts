import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { RouterModule, Routes } from "@angular/router";
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

import { AppComponent } from './app.component';
import { AF } from "./providers/af";
import { HomePageComponent } from './components/home-page/home-page.component';
import { LandingComponent } from './components/landing/landing.component';
import { PostItemComponent } from './components/post-item/post-item.component';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ItemdescComponent } from './components/itemdesc/itemdesc.component';
import { SignupComponent } from './components/signup/signup.component';
import { ShareModalComponent } from './components/share-modal/share-modal.component';

// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyDyDOGC2aN12e6D8B52i-pM0gTyFzbqN6U",
  authDomain: "share-and-connect.firebaseapp.com",
  databaseURL: "https://share-and-connect.firebaseio.com",
  storageBucket: "share-and-connect.appspot.com",
  messagingSenderId: "182047120297"
};

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'items/:uid/:itemid/:dist', component: ItemdescComponent},
  { path: 'postItem', component: PostItemComponent },
  { path: 'wishlist', component: WishListComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'itemdesc', component: ItemdescComponent},
  { path: 'itemdesc', component: ItemdescComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LandingComponent,
    PostItemComponent,
    WishListComponent,
    ProfileComponent,
    ItemdescComponent,
    SignupComponent,
    ShareModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    RouterModule.forRoot(routes),
    ModalModule.forRoot(),
    BootstrapModalModule
  ],
  providers: [AF],
  bootstrap: [AppComponent],
  entryComponents: [ShareModalComponent]
})

export class AppModule { }
