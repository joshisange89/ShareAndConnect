//
//  ShareItem.swift
//  ShareAndConnect
//
//  Created by Santa on 3/3/17.
//  Copyright © 2017 santa. All rights reserved.
//

import Foundation
import Firebase

struct ShareItem {
	
	let key: String
	let name: String
	let addedByUser: String
	let description: String
	let careInst: String
	let availableDate: String
	let itemImageBase64 : String?
	let shared: String
	let ref: FIRDatabaseReference?
	
	init(name: String, addedByUser: String,description: String, careInst: String, availableDate: String, key: String = "", base64Image: String, shared:String) {
		self.key = key
		self.name = name
		self.addedByUser = addedByUser
		self.description = description
		self.careInst = careInst
		self.availableDate = availableDate
		self.ref = nil
		self.shared = shared
		self.itemImageBase64 = base64Image
	}
	
	init(snapshot: FIRDataSnapshot) {
		key = snapshot.key
		let snapshotValue = snapshot.value as! [String: AnyObject]
		name = snapshotValue["name"] as! String
		description = snapshotValue["description"] as! String
		careInst = snapshotValue["careInst"] as! String
		availableDate = snapshotValue["availableDate"] as! String
		addedByUser = snapshotValue["addedByUser"] as! String
		itemImageBase64 = snapshotValue["itemImage"] as? String
		shared = snapshotValue["shared"] as! String
		ref = snapshot.ref
	} 
	
	func toAnyObject() -> Any {
		return [
			"name": name,
			"addedByUser": addedByUser,
			"description": description,
			"careInst": careInst,
			"availableDate": availableDate,
			"itemImage" : itemImageBase64,
			"shared" : shared
		]
	}
	
}
