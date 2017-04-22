//
//  ItemDetailViewController.swift
//  ShareAndConnect
//
//  Created by Santa on 2/10/17.
//  Copyright © 2017 santa. All rights reserved.
//

import UIKit
import Firebase

class ItemDetailViewController: UITableViewController {

	@IBOutlet weak var itemNameLabel: UILabel!
	@IBOutlet weak var availableFromLabel: UILabel!
	@IBOutlet weak var descriptionLabel: UILabel!
	@IBOutlet weak var careInstructionLabel: UILabel!
	@IBOutlet weak var ownerNameLabel: UILabel!
	@IBOutlet weak var ownerEmailLabel: UILabel!
	@IBOutlet weak var ownerMobileNumberLabel: UILabel!
	@IBOutlet weak var ownerAddressLabel: UILabel!
	@IBOutlet weak var itemImageView: UIImageView!
	
	var itemInfo : ShareItem!
	var userInfo : User!
	
    override func viewDidLoad() {
        super.viewDidLoad()
	}
	
	override func viewWillAppear(_ animated: Bool) {
		super.viewWillAppear(animated)
		showItemDescription()
		showOwnerInfo()
	}

	private func showItemDescription(){
		self.itemNameLabel.text = itemInfo.name
		self.availableFromLabel.text = itemInfo.availableDate
		self.descriptionLabel.text = itemInfo.description
		self.careInstructionLabel.text = itemInfo.careInst
		self.itemImageView.image = getImageFromBase64String(base64String: itemInfo.itemImageBase64!)

	}
	
	private func showOwnerInfo(){
		let addedByUser = itemInfo.addedByUser
		var ref = FIRDatabase.database().reference()
		ref = ref.child("Users/\(addedByUser)/contactInfo")
		ref.observe(.value, with: { snapshot in
			if snapshot.exists(){
				let ownerInfo = User(snapshot:snapshot )
				self.ownerNameLabel.text = ownerInfo.username
				self.ownerEmailLabel.text = ownerInfo.email
				self.ownerMobileNumberLabel.text = "\(ownerInfo.mobileNumber)"
				self.ownerAddressLabel.text = ownerInfo.address
			}
		})
	}
	
	private func getImageFromBase64String(base64String: String) -> UIImage{
		let decodedData = Data(base64Encoded: base64String, options:.ignoreUnknownCharacters)
		let image = UIImage(data: decodedData!)!
		return image
	}
}
