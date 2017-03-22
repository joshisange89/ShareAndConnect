//
//  WishListItem.swift
//  ShareAndConnect
//
//  Created by Santa on 3/3/17.
//  Copyright © 2017 santa. All rights reserved.
//

import Foundation
import Firebase

struct WishListItem {
	
	let key: String
	let name: String
	let addedByUser: String
	let comments: String
	let requiredDate: String
	let ref: FIRDatabaseReference?
	
	init(name: String, addedByUser: String, comments: String,  requiredDate: String, key: String = "") {
		self.key = key
		self.name = name
		self.addedByUser = addedByUser
		self.comments = comments
		self.requiredDate = requiredDate
		self.ref = nil
	}
	
	init(snapshot: FIRDataSnapshot) {
		key = snapshot.key
		let snapshotValue = snapshot.value as! [String: AnyObject]
		name = snapshotValue["name"] as! String
		comments = snapshotValue["comments"] as! String
		requiredDate = snapshotValue["requiredDate"] as! String
		addedByUser = snapshotValue["addedByUser"] as! String
		ref = snapshot.ref
	} 
	
	func toAnyObject() -> Any {
		return [
			"name": name,
			"addedByUser": addedByUser,
			"comments": comments,
			"requiredDate": requiredDate
		]
	}
	
}
