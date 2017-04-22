//
//  ProfileTableViewController.swift
//  ShareAndConnect
//
//  Created by Santa on 3/9/17.
//  Copyright © 2017 santa. All rights reserved.
//

import UIKit
import Firebase

class ProfileTableViewController: UITableViewController {
	let logout = 3
	let profilePic = 0
	//let ref = FIRDatabase.database().reference(withPath: "Users")
	var ref : FIRDatabaseReference!
	var user: FIRUser!
	@IBOutlet weak var userNameLabel: UILabel!
	@IBOutlet weak var mobileNumberLabel: UILabel!
	@IBOutlet weak var emailIDLabel: UILabel!
	@IBOutlet weak var zipCodeLabel: UILabel!
	@IBOutlet weak var addressLabel: UILabel!
	@IBOutlet weak var profilePicImageView: UIImageView!
	
    override func viewDidLoad() {
        super.viewDidLoad()
		user = FIRAuth.auth()?.currentUser
		ref = FIRDatabase.database().reference()
		ref = ref.child("Users/\(self.user.uid)/contactInfo")
		showUserProfileInfo()
    }
	
	
	private func showUserProfileInfo(){
//		ref.queryOrdered(byChild: "contact-info").observe(.value, with: { snapshot in
			ref.observe(.value, with: { snapshot in
		
//	  var newItems: [User] = []
				if snapshot.exists(){
	  // 3
//	  for item in snapshot.children {
		// 4
					let userInfo = User(snapshot:snapshot )
		self.userNameLabel.text = userInfo.username
		self.emailIDLabel.text = userInfo.email
		self.mobileNumberLabel.text = "\(userInfo.mobileNumber)"
		self.zipCodeLabel.text = userInfo.zipCode
		self.addressLabel.text = userInfo.address
					if let imageName = userInfo.profilePic{
					let profilePic = self.getImageFromBase64String(base64String: imageName)
						self.profilePicImageView.image = profilePic
						}
					}
		//}
	  // 5
	  })
	}

	
	private func getImageFromBase64String(base64String: String) -> UIImage?{
		var image : UIImage? = #imageLiteral(resourceName: "profile1")
		if base64String.characters.count > 0 {
		let decodedData = Data(base64Encoded: base64String, options:.ignoreUnknownCharacters)
			image = UIImage(data: decodedData!)!
		}
		return image
	}

	override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
		tableView.deselectRow(at: indexPath, animated: true)
		
		switch (indexPath.section, indexPath.row)
		{
//		case (profilePic,0):
//			chooseProfilePicture()
		case (logout,0):
			logoutUser()
		default:
			break;
		}
	}
	
	private func logoutUser(){
		let firebaseAuth = FIRAuth.auth()
		do {
			try firebaseAuth?.signOut()//{
			let loginViewController = self.storyboard!.instantiateViewController(withIdentifier: "Login")
			let nav = UINavigationController(rootViewController: loginViewController)
			let color = UIColor(red: 57/255, green: 22/255, blue: 217/255, alpha: 1)
			nav.navigationBar.barTintColor = color
			UIApplication.shared.keyWindow?.rootViewController = nav
			//			}
		}
		catch let signOutError as NSError {
			print ("Error signing out: %@", signOutError)
		}
	}
	
	private func chooseProfilePicture(){
		let alertController = UIAlertController(title: "Choose an option to select a photo", message: nil, preferredStyle: .actionSheet)
		let takePhotoButton = UIAlertAction(title: "Take Photo", style: .default) { (action) in
			print("Take photo button pressed")
		}
		let chooseFromLibraryButton = UIAlertAction(title: "Choose From Library", style: .default) { (action) in
			print("Choose from library button pressed")
		}
		let cancelButton = UIAlertAction(title: "Cancel", style: .cancel) { (action) in
			print("Cancel Pressed")
		}
		
		alertController.addAction(takePhotoButton)
		alertController.addAction(chooseFromLibraryButton)
		alertController.addAction(cancelButton)
		
		self.navigationController?.present(alertController, animated: true, completion: nil)
	}
}
