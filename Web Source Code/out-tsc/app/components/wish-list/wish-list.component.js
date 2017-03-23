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
import { Router } from '@angular/router';
export var WishListComponent = (function () {
    function WishListComponent(afService, router) {
        var _this = this;
        this.afService = afService;
        this.router = router;
        afService.getLoggedInUser().subscribe(function (user) {
            _this.sinUser = user;
        });
    }
    WishListComponent.prototype.addToWishList = function () {
        var _this = this;
        this.wishList = {
            name: this.name,
            comments: this.comments,
            requiredDate: this.requiredDate
        };
        this.afService.saveWishListInfo(this.wishList, this.sinUser.uid).then(function () {
            _this.router.navigate(['home']);
        });
    };
    WishListComponent = __decorate([
        Component({
            selector: 'app-wish-list',
            templateUrl: './wish-list.component.html',
            styleUrls: ['./wish-list.component.css']
        }), 
        __metadata('design:paramtypes', [AF, Router])
    ], WishListComponent);
    return WishListComponent;
}());
//# sourceMappingURL=/Users/makarandpuranik/IdeaProjects/Capstone/src/app/components/wish-list/wish-list.component.js.map