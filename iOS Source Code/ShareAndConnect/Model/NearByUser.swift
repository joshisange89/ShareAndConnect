//
//  NearByUser.swift
//  ShareAndConnect
//
//  Created by Santa on 3/3/17.
//  Copyright © 2017 santa. All rights reserved.
//

import Foundation
import Firebase

struct NearByUser {
	let distance: Double
	let user: User
	
	init(distance: Double, user: User) {
		self.distance = distance
		self.user = user
	}
	
}
