var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { AF } from '../../providers/af';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { ShareModalComponent } from '../share-modal/share-modal.component';
import * as firebase from "firebase/app";
import { isUndefined } from "util";
export var ProfileComponent = (function () {
    function ProfileComponent(af, afService, router, overlay, vcRef, modal) {
        var _this = this;
        this.af = af;
        this.afService = afService;
        this.router = router;
        this.modal = modal;
        this.wishList = [];
        this.postedItems = [];
        this.nameRead = true;
        this.addressRead = true;
        overlay.defaultViewContainer = vcRef;
        this.profileImage = "../../../assets/avatar.png";
        this.items = af.database.list('/items');
        this.wishitems = af.database.list('/wishitems');
        this.allUsers = this.afService.getAllUsers();
        afService.getLoggedInUser().subscribe(function (user) {
            _this.sinUser = user;
        });
        console.log(this.sinUser);
        this.sinUserDetail = af.database.object("Users/" + this.sinUser.uid + "/contactInfo");
        this.sinUserDetail.subscribe(function (user) {
            _this.sinUserDetail = user;
        });
        this.sinUserPostedItems = af.database.object("Users/" + this.sinUser.uid + "/postedItems");
        this.sinUserPostedItems.subscribe(function (items) {
            _this.sinUserPostedItems = items;
        });
        if (isUndefined(this.sinUserPostedItems.$value)) {
            for (var key in this.sinUserPostedItems) {
                var postItem = {};
                postItem.key = key;
                postItem.name = this.sinUserPostedItems[key].name;
                console.log(this.sinUserPostedItems[key].name);
                postItem.image = this.sinUserPostedItems[key].image;
                postItem.availableDate = this.sinUserPostedItems[key].availableDate;
                if (this.sinUserPostedItems[key].sharedWith != "") {
                    this.allUsers.forEach(function (user) {
                        if (user.email == _this.sinUserPostedItems[key].sharedWith) {
                            postItem.sharedWith = user.name;
                            postItem.sharedWithEmail = _this.sinUserPostedItems[key].sharedWith;
                            postItem.shared = true;
                        }
                    });
                }
                this.postedItems.push(postItem);
            }
        }
        this.sinUserWishList = af.database.object("Users/" + this.sinUser.uid + "/wishList");
        this.sinUserWishList.subscribe(function (items) {
            _this.sinUserWishList = items;
        });
        console.log(this.sinUserWishList);
        for (var key in this.sinUserWishList) {
            var wish = {};
            wish.key = key;
            wish.name = this.sinUserWishList[key].name;
            wish.requiredDate = this.sinUserWishList[key].requiredDate;
            this.wishList.push(wish);
        }
        console.log(this.wishList);
    }
    ProfileComponent.prototype.fileChangeEvent = function (fileInput) {
        var _this = this;
        this.profileImage = fileInput.target.files;
        this.profileImageName = this.profileImage[0].name;
        this.profileImageDefault = this.profileImage[0].name; //Initialization
        var reader = new FileReader();
        reader.readAsDataURL(this.profileImage[0]);
        reader.onload = function (event) {
            _this.profileImageDefault = event.target.result;
        };
        var imageRef = firebase.storage().ref()
            .child("/users/" + this.sinUser.uid + "/" + this.profileImage[0].name);
        imageRef.put(this.profileImage[0]).then(function (location) {
            _this.afService.saveProfileImageInfo(_this.sinUser.uid, location.downloadURL);
            console.log('Uploaded Image File');
        });
    };
    ProfileComponent.prototype.editName = function () {
        //this.afService.saveUserName(this.sinUser.uid, this.sinUserDetail.name);
    };
    ProfileComponent.prototype.editAddress = function () {
        this.afService.saveUserName(this.sinUser.uid, this.sinUserDetail.address);
    };
    ProfileComponent.prototype.editMobileno = function () {
        this.afService.saveUserName(this.sinUser.uid, this.sinUserDetail.mobileno);
    };
    ProfileComponent.prototype.shareItem = function (itemkey) {
        return this.modal.open(ShareModalComponent, overlayConfigFactory({ itemkey: itemkey, owner: this.sinUser.uid }, BSModalContext));
    };
    ProfileComponent.prototype.UnShare = function (itemkey) {
        this.afService.unshareItem(itemkey);
    };
    ProfileComponent.prototype.changeStatus = function (event, itemkey) {
        if (event) {
            this.shareItem(itemkey);
        }
        else {
            this.UnShare(itemkey);
        }
    };
    ProfileComponent.prototype.updateItem = function (key, newText) {
        this.items.update(key, { text: newText });
    };
    ProfileComponent.prototype.deleteItem = function (key) {
        this.afService.deleteItem(key, this.sinUser.uid);
        location.reload();
    };
    ProfileComponent.prototype.updateWishItem = function (key, newText) {
        this.wishitems.update(key, { text: newText });
    };
    ProfileComponent.prototype.deleteWishItem = function (key) {
        this.wishitems.remove(key);
    };
    ProfileComponent.prototype.deleteAllWishItems = function () {
        this.wishitems.remove();
    };
    ProfileComponent = __decorate([
        Component({
            selector: 'app-profile',
            templateUrl: './profile.component.html',
            styleUrls: ['./profile.component.css']
        }), 
        __metadata('design:paramtypes', [AngularFire, AF, Router, Overlay, ViewContainerRef, Modal])
    ], ProfileComponent);
    return ProfileComponent;
}());
//# sourceMappingURL=/Users/makarandpuranik/IdeaProjects/Capstone/src/app/components/profile/profile.component.js.map