/**
 * Created by makarandpuranik on 3/6/17.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
export var AF = (function () {
    function AF(af) {
        var _this = this;
        this.af = af;
        this.allUserDetails = [];
        this.sinUser = this.af.auth.subscribe(function (user) {
            _this.sinUser = user;
        });
        this.allData = this.af.database.list('Users');
        this.allData.subscribe(function (users) {
            users.forEach(function (user) {
                var userDetail = {
                    key: user.$key,
                    name: user.contactInfo.name,
                    email: user.contactInfo.email
                };
                _this.allUserDetails.push(userDetail);
            });
        });
    }
    AF.prototype.getLoggedInUser = function () {
        return this.af.auth;
    };
    AF.prototype.signUp = function (email, password) {
        return this.af.auth.createUser({
            email: email,
            password: password
        });
    };
    AF.prototype.saveUserInfo = function (uid, user) {
        return this.af.database.object("Users/" + uid + "/contactInfo").set({
            name: user.name,
            email: user.email,
            zipcode: user.zipcode,
            address: user.address,
            mobileno: user.mobileno,
            latitude: user.latitude,
            longitude: user.longitude
        });
    };
    AF.prototype.signin = function (email, password) {
        return this.af.auth.login({
            email: email,
            password: password,
        }, {
            provider: AuthProviders.Password,
            method: AuthMethods.Password,
        });
    };
    AF.prototype.signout = function () {
        return this.af.auth.logout();
    };
    AF.prototype.getAllUsers = function () {
        return this.allUserDetails;
    };
    AF.prototype.saveProfileImageInfo = function (uid, downloadUrl) {
        return this.af.database.object("Users/" + uid + "/contactInfo/").update({
            image: downloadUrl
        });
    };
    AF.prototype.saveItemInfo = function (item, uid) {
        return this.af.database.list("Users/" + uid + "/postedItems").push({
            image: item.image,
            name: item.name,
            description: item.description,
            careInst: item.careInst,
            availableDate: item.availableDate
        });
    };
    AF.prototype.saveItemImageInfo = function (itemkey, uid, downloadUrl) {
        return this.af.database.object("Users/" + uid + "/postedItems/" + itemkey).update({
            image: downloadUrl
        });
    };
    AF.prototype.saveWishListInfo = function (item, uid) {
        return this.af.database.list("Users/" + uid + "/wishList").push({
            name: item.name,
            comments: item.comments,
            requiredDate: item.requiredDate
        });
    };
    AF.prototype.saveUserName = function (uid, userName) {
        return this.af.database.list("Users/" + uid + "/contactInfo").push({
            name: userName
        });
    };
    AF.prototype.saveUserAddress = function (uid, userAddress) {
        return this.af.database.list("Users/" + uid + "/contactInfo").push({
            address: userAddress
        });
    };
    AF.prototype.saveUserMobileNo = function (uid, userMobileno) {
        return this.af.database.list("Users/" + uid + "/contactInfo").push({
            mobileno: userMobileno
        });
    };
    AF.prototype.shareItem = function (key, uid, sharedWith) {
        return this.af.database.object("Users/" + uid + "/postedItems/" + key).update({
            sharedWith: sharedWith
        });
    };
    AF.prototype.unshareItem = function (itemkey) {
        return this.af.database.object("Users/" + this.sinUser.uid + "/postedItems/" + itemkey).update({
            sharedWith: ""
        });
    };
    AF.prototype.deleteItem = function (key, uid) {
        this.af.database.object("Users/" + uid + "/postedItems/" + key).remove().then(function () {
            console.log("Deleted");
        });
    };
    AF = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [AngularFire])
    ], AF);
    return AF;
}());
//# sourceMappingURL=/Users/makarandpuranik/IdeaProjects/Capstone/src/app/providers/af.js.map