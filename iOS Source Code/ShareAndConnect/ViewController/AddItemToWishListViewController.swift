//
//  AddItemToWishListViewController.swift
//  ShareAndConnect
//
//  Created by Santa on 3/9/17.
//  Copyright © 2017 santa. All rights reserved.
//

import UIKit
import Firebase

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
		ref = ref.child("Users/\(self.user.uid)/wish-list")
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
		}
	}

}
