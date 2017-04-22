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
	let mobileNumber: Int
	let zipCode: String
	let address: String
	let latitude: Double
	let longitude: Double
	let profilePic: String?
	let ref: FIRDatabaseReference?

	
	init(snapshot: FIRDataSnapshot) {
		key = snapshot.key
		let snapshotValue = snapshot.value as! [String: AnyObject]
		address = snapshotValue["address"] as! String
		email = snapshotValue["email"] as! String
		mobileNumber = snapshotValue["mobileno"] as! Int
		username = snapshotValue["name"] as! String
		zipCode = snapshotValue["zipcode"] as! String
		latitude = snapshotValue["latitude"] as! Double
		longitude = snapshotValue["longitude"] as! Double
		profilePic = snapshotValue["image"] as? String
		uid = snapshotValue["uid"] as! String
		ref = snapshot.ref
		
	}
	
	init(key: String, uid: String, email: String, username: String, mobileNumber: Int, zipCode: String, address: String, latitude:Double, longitude: Double, profilePic: String) {
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
