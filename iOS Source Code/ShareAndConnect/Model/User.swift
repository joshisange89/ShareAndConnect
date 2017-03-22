//
//  User.swift
//  ShareAndConnect
//
//  Created by Santa on 3/3/17.
//  Copyright © 2017 santa. All rights reserved.
//

import Foundation
import Firebase

struct User {
	let key: String
	let uid: String
	let email: String
	let username: String
	let mobileNumber: String
	let zipCode: String
	let address: String
	let latitude: String
	let longitude: String
	let profilePic: String
	let ref: FIRDatabaseReference?

	
	init(snapshot: FIRDataSnapshot) {
		key = snapshot.key
		let snapshotValue = snapshot.value as! [String: AnyObject]
		address = snapshotValue["Address"] as! String
		email = snapshotValue["Email"] as! String
		mobileNumber = snapshotValue["MobileNo"] as! String
		username = snapshotValue["Username"] as! String
		zipCode = snapshotValue["Zipcode"] as! String
		latitude = snapshotValue["latitude"] as! String
		longitude = snapshotValue["longitude"] as! String
		profilePic = snapshotValue["profilePic"] as! String
		uid = snapshotValue["uid"] as! String
		ref = snapshot.ref
		
	}
	
	init(key: String, uid: String, email: String, username: String, mobileNumber: String, zipCode: String, address: String, latitude:String, longitude: String, profilePic: String) {
		self.key = key
		self.uid = uid
		self.email = email
		self.username = username
		self.mobileNumber = mobileNumber
		self.zipCode = zipCode
		self.address = address
		self.latitude = latitude
		self.longitude = longitude
		self.profilePic = profilePic
		self.ref = nil
	}
	
}
