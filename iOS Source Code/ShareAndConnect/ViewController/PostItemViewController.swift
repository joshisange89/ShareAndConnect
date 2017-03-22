//
//  PostItemViewController.swift
//  ShareAndConnect
//
//  Created by Santa on 2/10/17.
//  Copyright © 2017 santa. All rights reserved.
//

import UIKit
import Firebase

class PostItemViewController: UITableViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
	
//	let ref = FIRDatabase.database().reference(withPath: "posted-items")
	var ref1 : FIRDatabaseReference!
	@IBOutlet weak var itemImageView: UIImageView!
	@IBOutlet weak var itemNameTextField: UITextField!
	@IBOutlet weak var descriptionTextField: UITextField!
	@IBOutlet weak var careInstTextField: UITextField!
	@IBOutlet weak var availableTextField: UITextField!
	var user: FIRUser!
	let chooseItemImage = 0
	let pickDate = 1
	let postItem = 2
	let imagePicker = UIImagePickerController()
	var base64String : NSString!
	
	
    override func viewDidLoad() {
        super.viewDidLoad()
		self.title = "Post Item"
		user = FIRAuth.auth()?.currentUser
        // Do any additional setup after loading the view.
		ref1 = FIRDatabase.database().reference()
		ref1 = ref1.child("Users/\(self.user.uid)/posted-items")
		imagePicker.delegate = self
    }

	private func postItemClicked(){
		
		if let itemName = itemNameTextField.text{
			let description = descriptionTextField.text
			let careInst = careInstTextField.text
			let availabledate = availableTextField.text
			
			//image
//			var image = UIImage(named: "item")
			var data: Data = Data()
			if let itemImage = itemImageView.image{
				data = UIImageJPEGRepresentation(itemImage, 0.1)!
			}
			let base64String = data.base64EncodedString(options: .lineLength64Characters)
		// 2
			let shareItem = ShareItem(name: itemName, addedByUser: self.user.uid, description: description!, careInst: careInst!, availableDate: availabledate!, base64Image: base64String, shared: "")
		// 3
		let shareItemRef = self.ref1.childByAutoId()
		
		// 4
		shareItemRef.setValue(shareItem.toAnyObject())
		self.navigationController?.popViewController(animated: true)
		}
	}

	@IBAction func selectDateEditingBegin(_ sender: UITextField) {
		let datePickerView:UIDatePicker = UIDatePicker()
		
		datePickerView.datePickerMode = UIDatePickerMode.dateAndTime
		
		sender.inputView = datePickerView
		
		datePickerView.addTarget(self, action: #selector(self.datePickerValueChanged), for:.valueChanged)
		
	}
	
	override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
		tableView.deselectRow(at: indexPath, animated: true)
		
		switch (indexPath.section, indexPath.row)
		{
		case (chooseItemImage,0):
			chooseProfilePicture()
		case (pickDate,3):
			chooseDate()
		case (postItem,0):
			postItemClicked()
		default:
			break;
		}
	}
	
	private func chooseDate(){
		self.view.endEditing(true)
	}
	
	func datePickerValueChanged(sender:UIDatePicker) {
		let dateFormatter: DateFormatter = DateFormatter()
		
		// Set date format
		dateFormatter.dateFormat = "MM/dd/yyyy hh:mm a"
		
		// Apply date format
		let date = sender.date
		let selectedDate: String = dateFormatter.string(from: date)
		availableTextField.text = selectedDate
	}
	
	private func chooseProfilePicture(){
		let alertController = UIAlertController(title: "Choose an option to select a photo", message: nil, preferredStyle: .actionSheet)
//		let takePhotoButton = UIAlertAction(title: "Take Photo", style: .default) { (action) in
//			print("Take photo button pressed")
//		}
		
		let chooseFromLibraryButton = UIAlertAction(title: "Choose From Library", style: .default) { (action) in
			print("Choose from library button pressed")
			self.imagePicker.allowsEditing = false
			self.imagePicker.sourceType = .photoLibrary
			self.present(self.imagePicker, animated: true, completion: nil)
		}
		let cancelButton = UIAlertAction(title: "Cancel", style: .cancel) { (action) in
			print("Cancel Pressed")
		}
		
//		alertController.addAction(takePhotoButton)
		alertController.addAction(chooseFromLibraryButton)
		alertController.addAction(cancelButton)
		
		self.navigationController?.present(alertController, animated: true, completion: nil)
	}
	
	// MARK: - UIImagePickerControllerDelegate Methods
	
	func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
		if let pickedImage = info[UIImagePickerControllerOriginalImage] as? UIImage{
			
			itemImageView.contentMode = .scaleAspectFit
			itemImageView.image = pickedImage
		}
		dismiss(animated: true, completion: nil)
	}
	
	func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
		  picker.dismiss(animated: true, completion: nil)
	}
	
}
