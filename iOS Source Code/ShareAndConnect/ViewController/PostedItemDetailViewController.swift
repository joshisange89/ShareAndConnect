//
//  PostedItemDetailViewController.swift
//  ShareAndConnect
//
//  Created by Santa on 2/10/17.
//  Copyright © 2017 santa. All rights reserved.
//

import UIKit
import Firebase

class PostedItemDetailViewController: UITableViewController, UITextFieldDelegate {

	@IBOutlet weak var itemNameLabel: UILabel!
	@IBOutlet weak var availableFromLabel: UILabel!
	@IBOutlet weak var descriptionLabel: UILabel!
	@IBOutlet weak var careInstructionLabel: UILabel!
	@IBOutlet weak var itemImageView: UIImageView!
	@IBOutlet weak var sharedWithTextField: UITextField!
	@IBOutlet weak var sharedWithCell: UITableViewCell!
	@IBOutlet weak var isSharedSwitch: UISwitch!
	
	var itemInfo : ShareItem!
	var userInfo : User!
	var sharedUser : User!
	let showUserInfo = 2
	
    override func viewDidLoad() {
        super.viewDidLoad()
	}
	
	override func viewWillAppear(_ animated: Bool) {
		super.viewWillAppear(animated)
		showItemDescription()
	}

	private func showItemDescription(){
		self.itemNameLabel.text = itemInfo.name
		self.availableFromLabel.text = itemInfo.availableDate
		self.descriptionLabel.text = itemInfo.description
		self.careInstructionLabel.text = itemInfo.careInst
		self.itemImageView.image = getImageFromBase64String(base64String: itemInfo.itemImageBase64!)
		
		let shared = itemInfo.shared
		if shared.isEmpty{
			//disable the switch
			isSharedSwitch.isOn = false
		} else {
			//enable the switch
			isSharedSwitch.isOn = true
			sharedWithCell.isHidden = false
			//get the shared user info and display the email in the shared with field
			let userId = itemInfo.shared
			getUserInfo(userId: userId)
		}

	}
	
	private func getUserInfo(userId: String){
		var ref = FIRDatabase.database().reference()
		ref = ref.child("Users/\(userId)/contactInfo")
		ref.observe(.value, with: { snapshot in
			if snapshot.exists(){
				self.sharedUser = User(snapshot:snapshot )
				self.sharedWithTextField.text = self.sharedUser.email
			}
		})
	}

	private func getImageFromBase64String(base64String: String) -> UIImage{
		let decodedData = Data(base64Encoded: base64String, options:.ignoreUnknownCharacters)
		let image = UIImage(data: decodedData!)!
		return image
	}
	
	@IBAction func toggleValueChanged(_ sender: UISwitch) {
		if sender.isOn{
			sharedWithCell.isHidden = false
		} else {
			sharedWithCell.isHidden = true
			sharedWithTextField.text = nil
			let ref = FIRDatabase.database().reference(withPath: "Users")
			guard let user = FIRAuth.auth()?.currentUser else {
				return
			}
			ref.child("\(user.uid)/postedItems/\(self.itemInfo.key)/shared").setValue("")
		}
	}
	
	func textFieldShouldReturn(_ textField: UITextField) -> Bool {
		//associate the user
		guard let user = FIRAuth.auth()?.currentUser else {
			return false
		}
		let ref = FIRDatabase.database().reference(withPath: "Users")

		
		ref.observe(.value, with: { snapshot in
			for child in snapshot.children {
				if (child as! FIRDataSnapshot).key != user.uid{
					let childContactKeyPath = (child as! FIRDataSnapshot).key + "/contactInfo"
					let childSnapshot = snapshot.childSnapshot(forPath: childContactKeyPath)
					let userItem = User(snapshot: childSnapshot)
					if userItem.email == textField.text{
						ref.child("\(user.uid)/postedItems/\(self.itemInfo.key)/shared").setValue(userItem.uid)
						self.sharedUser = userItem
						return
					}
				  }
			  }
		})
		
		self.view.endEditing(true)
		print("Done pressed")
		return true
	}
	
//	override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
//		tableView.deselectRow(at: indexPath, animated: true)
//		
//		switch (indexPath.section, indexPath.row)
//		{
//		case (showUserInfo,1): 
//	
//		default:
//			break;
//		}
//	}
	
	
	override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
		if segue.identifier == "showUserInfo"{
			if let sharedUserInfoViewController = segue.destination as? SharedUserInfoViewController {
					sharedUserInfoViewController.userInfo = sharedUser
				}
			}
		}
}
