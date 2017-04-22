//
//  AddItemToWishListViewController.swift
//  ShareAndConnect
//
//  Created by Santa on 3/9/17.
//  Copyright © 2017 santa. All rights reserved.
//

import UIKit
import Firebase
import CoreLocation

class AddItemToWishListViewController: UITableViewController {
//	let ref = FIRDatabase.database().reference(withPath: "wish-list")
	var ref : FIRDatabaseReference!
	let pickDate = 0
	let addToWishList = 1
	var user: FIRUser!
	var isItemDetailView : Bool = false
	var wishListItem : WishListItem!
	var nuberOfSection = 2

	@IBOutlet weak var itemNameTextField: UITextField!
	@IBOutlet weak var requiredDateTextField: UITextField!
	@IBOutlet weak var commentsTextView: UITextView!
	
	
    override func viewDidLoad() {
        super.viewDidLoad()
		user = FIRAuth.auth()?.currentUser
		ref = FIRDatabase.database().reference()
		ref = ref.child("Users/\(self.user.uid)/wishList")
		setUpUI()
		
    }
	private func setUpUI(){
		if isItemDetailView{
			self.itemNameTextField.isEnabled = false
			self.requiredDateTextField.isEnabled = false
			self.commentsTextView.isEditable = false
			self.itemNameTextField.text = wishListItem.name
			self.requiredDateTextField.text = wishListItem.requiredDate
			self.commentsTextView.text = wishListItem.comments
			nuberOfSection = 1
		}
	}
	
	
	@IBAction func selectDateEditingBegin(_ sender: UITextField) {
		let datePickerView:UIDatePicker = UIDatePicker()
		
		datePickerView.datePickerMode = UIDatePickerMode.dateAndTime
		
		sender.inputView = datePickerView
		
		datePickerView.addTarget(self, action: #selector(self.datePickerValueChanged), for:.valueChanged)
		
	}

//	
//	@IBAction func onTap(_ sender: Any) {
//		self.view.endEditing(true)
//	}
	override func numberOfSections(in tableView: UITableView) -> Int {
		return nuberOfSection
	}
	
	override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
		tableView.deselectRow(at: indexPath, animated: true)
		
		switch (indexPath.section, indexPath.row)
		{
		case (pickDate,1):
			chooseDate()
		case (addToWishList,0):
			addItemToWishList()
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
		requiredDateTextField.text = selectedDate
		
	}
	
	private func addItemToWishList(){
		print(addItemToWishList)
		if let itemName = itemNameTextField.text{
			// 2
			let wishListItem = WishListItem(name: itemName, addedByUser: self.user.uid, comments: commentsTextView.text, requiredDate: requiredDateTextField.text!)
			
			// 3
			let wishItemRef = self.ref.childByAutoId()
			
			// 4
			wishItemRef.setValue(wishListItem.toAnyObject())
			self.navigationController?.popViewController(animated: true)
			
			
			//add notification object
			let notificationRef = FIRDatabase.database().reference().child("Notifications")
			let notiItemRef = notificationRef.childByAutoId()
			notiItemRef.setValue(wishListItem.toAnyObject())
			
			
			//add notification for all near by users
			
			FIRDatabase.database().reference(withPath: "Users").observe(.value, with: { snapshot in
				var nearUsers:[User] = []
				for child in snapshot.children {
					if (child as! FIRDataSnapshot).key != self.user.uid{
						let childContactKeyPath = (child as! FIRDataSnapshot).key + "/contactInfo"
						let childSnapshot = snapshot.childSnapshot(forPath: childContactKeyPath)
						let userItem = User(snapshot: childSnapshot)
						nearUsers.append(userItem)
					}
				}
//				let loggedUserLocation = getLocation(lat: self.user.latitude, long: self.user.longitude)
//				var allNearUsers : [NearByUser] = []
//				for user in nearUsers{
//					let lat = user.latitude
//					let long = user.longitude
//					let location = getLocation(lat: lat, long: long)
//					let distance = loggedUserLocation.distance(from: location)
//					print(distance)
//					if distance < 15000 {
//						let neighbour = NearByUser(distance: distance, user: user)
//						allNearUsers.append(neighbour)
//					}
//				}
//				
//				for user in allNearUsers{
//					
//					let ref =
//					
//				}
			})

			
			
			
			
			//pop to wishlist view
			self.navigationController?.popViewController(animated: true)
		}
	}
	
	private func getLocation(lat: String, long: String) -> CLLocation{
		var location = CLLocation()
		if let lat = Double(lat) , let long = Double(long){
			location = CLLocation(latitude: lat, longitude: long)
		}
		return location
	}
	
	//addnotification object
	
	

}
