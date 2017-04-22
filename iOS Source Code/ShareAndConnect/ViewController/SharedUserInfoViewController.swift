//
//  SharedUserInfoViewController.swift
//  ShareAndConnect
//
//  Created by Santa on 2/10/17.
//  Copyright © 2017 santa. All rights reserved.
//

import UIKit
import Firebase

class SharedUserInfoViewController: UITableViewController {

	@IBOutlet weak var userNameLabel: UILabel!
	@IBOutlet weak var userEmailLabel: UILabel!
	@IBOutlet weak var userMobileNumberLabel: UILabel!
	@IBOutlet weak var userAddressLabel: UILabel!
	
	var userInfo : User?

    override func viewDidLoad() {
        super.viewDidLoad()
	}
	
	override func viewWillAppear(_ animated: Bool) {
		super.viewWillAppear(animated)
		showUserInfo()
	}
	
	private func showUserInfo(){
		self.userNameLabel.text = userInfo?.username
		self.userEmailLabel.text = userInfo?.email
		self.userMobileNumberLabel.text = "\(String(describing: userInfo?.mobileNumber))"
		self.userAddressLabel.text = userInfo?.address
	}

}
