//
//  NotificationsViewController.swift
//  ShareAndConnect
//
//  Created by Santa on 4/21/17.
//  Copyright © 2017 santa. All rights reserved.
//

import UIKit
import Firebase

class NotificationsViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
	//	let ref = FIRDatabase.database().reference(withPath: "wish-list")
	var ref : FIRDatabaseReference!
	var user: FIRUser!
	var items : [WishListItem] = []
	
	@IBOutlet weak var tableView: UITableView!
	override func viewDidLoad() {
		super.viewDidLoad()
		user = FIRAuth.auth()?.currentUser
		// Do any additional setup after loading the view.
		ref = FIRDatabase.database().reference()
		ref = ref.child("Notifications")
	}
	
	override func viewWillAppear(_ animated: Bool) {
		super.viewWillAppear(animated)
		updateTableData()
	}
	private func updateTableData(){
		
		ref.queryOrdered(byChild: "name").observe(.value, with: { snapshot in
	  var newItems: [WishListItem] = []
			
	  // 3
	  for item in snapshot.children {
		// 4
		let wishItem = WishListItem(snapshot: item as! FIRDataSnapshot)
		newItems.append(wishItem)
	  }
			
	  // 5
	  self.items = newItems
	  self.tableView.reloadData()
		})
	}
	func numberOfSections(in tableView: UITableView) -> Int {
		return 1
	}
	
	func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
		return items.count
	}
	
	func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
		let cellIdentifier = "notificationTableCellIdentifier"
		let cell = tableView.dequeueReusableCell(withIdentifier: cellIdentifier,for: indexPath) as UITableViewCell
		let wishItem = items[indexPath.row]
		cell.textLabel?.text = wishItem.name
		cell.detailTextLabel?.text = wishItem.requiredDate
		
		return cell
	}
	
	func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
		if editingStyle == .delete {
			let wishItem = items[indexPath.row]
			wishItem.ref?.removeValue()
		}
	}
	
	override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
		if segue.identifier == "showWishListItemInfo"{
			if let itemDetailViewController = segue.destination as? AddItemToWishListViewController {
				if let indexPath = self.tableView.indexPathForSelectedRow{
					// do the work here
					itemDetailViewController.isItemDetailView = true
					itemDetailViewController.title = "Item Detail"
					itemDetailViewController.wishListItem = self.items[indexPath.row]
					
				}
			}
		}
	}
	
	
}
