//
//  SharedViewController.swift
//  ShareAndConnect
//
//  Created by Santa on 2/10/17.
//  Copyright © 2017 santa. All rights reserved.
//

import UIKit
import Firebase

class SharedViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
	let ref = FIRDatabase.database().reference(withPath: "postedItems")
	var items: [ShareItem] = []
	var user: FIRUser!
	var ref1 = FIRDatabase.database().reference()
	private var databaseHandle: FIRDatabaseHandle!
	
	@IBOutlet weak var tableView: UITableView!
	
	override func viewDidLoad() {
		super.viewDidLoad()
		// Do any additional setup after loading the view, typically from a nib.
		user = FIRAuth.auth()?.currentUser
		
		ref1 = ref1.child("Users/\(self.user.uid)/postedItems")
		
		updateTableData()

	}
	
	deinit {
		ref1.removeAllObservers()
	}
	
	
	private func updateTableData(){
		
	  // 1
//	  ref.observe(.value, with: { snapshot in
	  // 2
	
	ref1.queryOrdered(byChild: "name").observe(.value, with: { snapshot in
	  var newItems: [ShareItem] = []

	  // 3
	  for item in snapshot.children {
	  // 4
	  let sharedItem = ShareItem(snapshot: item as! FIRDataSnapshot)
	  newItems.append(sharedItem)
	  }

	  // 5
	  self.items = newItems
	  self.tableView.reloadData()
	  })
/*
		
		databaseHandle = ref1.child("Users/\(self.user.uid)/posted-items").observe(.value, with: { (snapshot) in
		 var newItems: [ShareItem] = []
		// 3
		for item in snapshot.children {
	  // 4
	  let sharedItem = ShareItem(snapshot: item as! FIRDataSnapshot)
	  newItems.append(sharedItem)
		}
		// 5
		self.items = newItems
		self.tableView.reloadData()
	})
*/
	}
	
	
	override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
		if segue.identifier == "postedItemDetailSegue"{
			if let itemDetailViewController = segue.destination as? PostedItemDetailViewController {
				if let indexPath = self.tableView.indexPathForSelectedRow{
					// do the work here
					itemDetailViewController.itemInfo = self.items[indexPath.row]
				}
			}
		}
	}
	
	func numberOfSections(in tableView: UITableView) -> Int {
		return 1
	}
	
	func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
		return items.count
	}
	
	func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
		let cellIdentifier = "sharedTableCellIdentifier"
		let cell = tableView.dequeueReusableCell(withIdentifier: cellIdentifier,for: indexPath) as! SharedTableViewCell
		
		let sharedItem = items[indexPath.row]
		cell.itemName.text = sharedItem.name
		cell.itemAvailableDate.text = sharedItem.availableDate
		if let imageName = sharedItem.itemImageBase64{
		  let profilePic = self.getImageFromBase64String(base64String: imageName)
		cell.itemImage.image = profilePic
		}
		//cell.sharedWithLabel.text = sharedItem.addedByUser
		return cell
	}
	
	 func getImageFromBase64String(base64String: String) -> UIImage?{
		var image : UIImage? = #imageLiteral(resourceName: "profile1")
		if base64String.characters.count > 0 {
			let decodedData = Data(base64Encoded: base64String, options:.ignoreUnknownCharacters)
			image = UIImage(data: decodedData!)!
		}
		return image
	}

	func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
		return 70
	}
	
	func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
		if editingStyle == .delete {
			let shareItem = items[indexPath.row]
			shareItem.ref?.removeValue()
		}
	}
}

