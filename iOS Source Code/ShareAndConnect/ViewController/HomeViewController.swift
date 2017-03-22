//
//  HomeViewController.swift
//  ShareAndConnect
//
//  Created by Santa on 2/10/17.
//  Copyright © 2017 santa. All rights reserved.
//

import UIKit
import Firebase
import CoreLocation

class HomeViewController: UIViewController, UITableViewDataSource, UITableViewDelegate, UISearchBarDelegate {
	let ref = FIRDatabase.database().reference(withPath: "Users")
	var nearByItems: [ShareItem] = []
	var filteredItems: [ShareItem] = []
	var user: FIRUser!
	var allUsers : [User] = []
	var nearByUsers : [NearByUser] = []
	var loggedUser: User!
	
	@IBOutlet weak var tableView: UITableView!
	@IBOutlet weak var searchBar: UISearchBar!
	
	override func viewDidLoad() {
		super.viewDidLoad()
		user = FIRAuth.auth()?.currentUser
		//updateTableData()
		loggedInUserInfo()
		getData()
		self.tableView.reloadData()
	}
	
	override func viewWillAppear(_ animated: Bool) {
		super.viewWillAppear(animated)
		self.tableView.reloadData()
	}
	
	private func loggedInUserInfo(){
		let userId = user.uid
		var ref = FIRDatabase.database().reference()
		ref = ref.child("Users/\(userId)/contact-info")
		ref.observe(.value, with: { snapshot in
			if snapshot.exists(){
				let sharedItem = User(snapshot:snapshot )
				self.loggedUser = sharedItem
			}
		})
	}
	
	private func getData(){
	  ref.observe(.value, with: { snapshot in
			var nearUsers:[User] = []
			for child in snapshot.children {
				if (child as! FIRDataSnapshot).key != self.user.uid{
			  let childContactKeyPath = (child as! FIRDataSnapshot).key + "/contact-info"
			  let childSnapshot = snapshot.childSnapshot(forPath: childContactKeyPath)
			  let userItem = User(snapshot: childSnapshot)
			  nearUsers.append(userItem)
				}
			}
		  self.allUsers = nearUsers
		  self.findDistance()
		self.getNearByPostedItems()

		})
//		perform(#selector(getNearByPostedItems), with: nil, afterDelay: 20.0)
	}
	
	
	private func findDistance(){
		let loggedUserLocation = getLocation(lat: loggedUser.latitude, long: loggedUser.longitude)
		var allNearUsers : [NearByUser] = []
		for user in allUsers{
			let lat = user.latitude
			let long = user.longitude
			let location = getLocation(lat: lat, long: long)
			let distance = loggedUserLocation.distance(from: location)
			print(distance)
			if distance < 15000 {
				let neighbour = NearByUser(distance: distance, user: user)
				allNearUsers.append(neighbour)
			}
		}
		self.nearByUsers = allNearUsers
		sortUsersByDistance()
	}
	
	private func sortUsersByDistance(){
		//sort the neighbour Users by distance
		self.nearByUsers.sort{$0.distance < $1.distance}
	}
	
	private func getLocation(lat: String, long: String) -> CLLocation{
		var location = CLLocation()
		if let lat = Double(lat) , let long = Double(long){
			location = CLLocation(latitude: lat, longitude: long)
		}
		return location
	}

	@objc private func getNearByPostedItems(){
		self.nearByItems.removeAll()
		for selectedUser in nearByUsers{
			let selectedUserId = selectedUser.user.uid
			let ref1 = ref.child("\(selectedUserId)/posted-items")
			
			ref1.queryOrdered(byChild: "availableDate").observe(.value, with: { snapshot in
				for item in snapshot.children {
					let sharedItem = ShareItem(snapshot: item as! FIRDataSnapshot)
					if (sharedItem.shared.isEmpty){
					  self.nearByItems.append(sharedItem)
					  self.filteredItems = self.nearByItems
					}
				}
				self.tableView.reloadData()
			})
		}
	}
	
	private func updateTableData(){
		
		// 1
			  ref.observe(.value, with: { snapshot in
		// 2
		
//		ref.queryOrdered(byChild: "addedByUser").queryEqual(toValue: user.uid).observe(.value, with: { snapshot in
//	  var newItems: [ShareItem] = []
				var nearUsers:[User] = []
	  // 3
	  for item in snapshot.children {
		// 4
		let sharedItem = User(snapshot: item as! FIRDataSnapshot)
		if sharedItem.uid != self.user.uid{
		  nearUsers.append(sharedItem)
		}
	  }
			
	  // 5
	  self.allUsers = nearUsers
	  self.tableView.reloadData()
		})

	}

	override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
		if segue.identifier == "itemDetailSegue"{
			if let itemDetailViewController = segue.destination as? ItemDetailViewController {
				if let indexPath = self.tableView.indexPathForSelectedRow{
					// do the work here
					itemDetailViewController.itemInfo = self.filteredItems[indexPath.row]
					
				}
			}
		}
	}
	
	
	func numberOfSections(in tableView: UITableView) -> Int {
		return 1
	}
	
	func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
		return filteredItems.count
	}
	
	func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
		let cellIdentifier = "HomeTableCellIdentifier"
		let cell = tableView.dequeueReusableCell(withIdentifier: cellIdentifier,for: indexPath) as! HomeTableViewCell

		let sharedItem = filteredItems[indexPath.row]
		
		cell.itemName.text = sharedItem.name
		cell.itemAvailableDate.text = sharedItem.availableDate
		cell.itemImage.image = getImageFromBase64String(base64String: sharedItem.itemImageBase64!)
		return cell
	}
	
	func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
		return 70
	}
	
	private func getImageFromBase64String(base64String: String) -> UIImage{
		let decodedData = Data(base64Encoded: base64String, options:.ignoreUnknownCharacters)
		let image = UIImage(data: decodedData!)!
		return image
	}
	
	//MARK: - Search bar delegate

	
	func searchBarTextDidEndEditing(_ searchBar: UISearchBar) {
		searchBar.showsCancelButton = false;
	}
	
	func searchBarTextDidBeginEditing(_ searchBar: UISearchBar) {
		searchBar.showsCancelButton = true;
	}
	
	func searchBarCancelButtonClicked(_ searchBar: UISearchBar) {
		self.view.endEditing(true)
	}
	
	func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String) {
		filteredItems = searchText.isEmpty ? nearByItems : nearByItems.filter{(item: ShareItem) -> Bool in
			// If dataItem matches the searchText, return true to include it
			//return item.range(of: searchText, options: .caseInsensitive) != nil
			return (item.name.contains(searchText))
//			return Bool(item.name == searchText)
		}
		
		tableView.reloadData()
	  }
}

