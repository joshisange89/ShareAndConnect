var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { AF } from '../../providers/af';
import { Router, ActivatedRoute } from "@angular/router";
export var SignupComponent = (function () {
    function SignupComponent(afService, router, route) {
        this.afService = afService;
        this.router = router;
    }
    SignupComponent.prototype.signup = function () {
        var _this = this;
        this.user = {
            name: this.name,
            password: this.password,
            email: this.email,
            zipcode: this.zipcode,
            address: this.address,
            mobileno: this.mobileno,
            latitude: this.latitude,
            longitude: this.longitude
        };
        this.getLatitudeLongitude(this.setLatLong, this.address + " " + this.zipcode, this.user);
        this.afService.signUp(this.email, this.password).then(function (newUser) {
            _this.afService.saveUserInfo(newUser.uid, _this.user).then(function () {
                _this.router.navigate(['']);
                //location.reload();
            })
                .catch(function (error) {
                _this.error = error;
            });
        })
            .catch(function (error) {
            _this.error = error;
            console.log(_this.error);
        });
    };
    SignupComponent.prototype.getLatitudeLongitude = function (callback, address, user) {
        var geocoder = new google.maps.Geocoder();
        if (geocoder) {
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    return callback(results[0], user);
                }
            });
        }
    };
    SignupComponent.prototype.setLatLong = function (result, user) {
        user.latitude = result.geometry.location.lat();
        console.log(user.latitude);
        user.longitude = result.geometry.location.lng();
        console.log(user.longitude);
    };
    SignupComponent = __decorate([
        Component({
            selector: 'app-signup',
            templateUrl: './signup.component.html',
            styleUrls: ['./signup.component.css']
        }), 
        __metadata('design:paramtypes', [AF, Router, ActivatedRoute])
    ], SignupComponent);
    return SignupComponent;
}());
//# sourceMappingURL=/Users/makarandpuranik/IdeaProjects/Capstone/src/app/components/signup/signup.component.js.map