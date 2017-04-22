//
//  SignUpTableViewController.swift
//  ShareAndConnect
//
//  Created by Santa on 3/7/17.
//  Copyright © 2017 santa. All rights reserved.
//

import UIKit
import Firebase
import CoreLocation

class SignUpTableViewController: UITableViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate {

	@IBOutlet weak var userNameTextField: UITextField!
	@IBOutlet weak var passwordTextField: UITextField!
	@IBOutlet weak var confirmPasswordTextField: UITextField!
	@IBOutlet weak var emailTextField: UITextField!
	@IBOutlet weak var mobileNumberTextField: UITextField!
	@IBOutlet weak var zipCodeTextField: UITextField!
	@IBOutlet weak var addressTextField: UITextField!
	var locationManager = CLLocationManager()
	let ref = FIRDatabase.database().reference()
	let imagePicker = UIImagePickerController()
	var base64String : NSString!
	
	@IBOutlet weak var profileImageView: UIImageView!
	
    override func viewDidLoad() {
        super.viewDidLoad()
		self.navigationItem.hidesBackButton = true
		imagePicker.delegate = self
		getUserLocation()
		//lat: 37.3422574, long: -121.8970925
    }

	private func getUserLocation(){
//		let locationManager = CLLocationManager.
		if CLLocationManager.authorizationStatus() == .notDetermined{
			self.locationManager.requestWhenInUseAuthorization()
			//self.locationManager.delegate = self
		}
		
		if CLLocationManager.locationServicesEnabled(){
			//let locaiself.locationManager.location
		}
	}
	
	@IBAction func cancelViewController(_ sender: Any) {
		self.navigationController?.popViewController(animated: true)
//		dismiss(animated: true, completion: nil)
	}
	
	@IBAction func onTap(_ sender: Any) {
		self.view.endEditing(true)
	}

	@IBAction func signUpButtonPressed(_ sender: Any) {
		//get the input values
		guard let userName = userNameTextField.text, let password = passwordTextField.text, let emailId = emailTextField.text, let zipCode = zipCodeTextField.text, let mobileNo = mobileNumberTextField.text, let address = addressTextField.text else {
			print("Please enter the input values")
			return
		}
		
		
		var coordinate = CLLocationCoordinate2D()
		CLGeocoder().geocodeAddressString(address) {(placemarks, error) in
			if let error = error {
				print(error)
				return
			}
			if let placemarks = placemarks {
				if placemarks.count > 0 {
					let placemark = placemarks[0]
					if let location = placemark.location{
						coordinate = location.coordinate
						print("\nlat: \(coordinate.latitude), long: \(coordinate.longitude)")
						
						
						
						
						FIRAuth.auth()?.createUser(withEmail: emailId, password: password, completion:{ (user, error) in
							if let error = error{
								print(error)
								return
							} else {
								let userId: String = (user?.uid)!
								var data: Data = Data()
								if let itemImage = self.profileImageView.image{
									data = UIImageJPEGRepresentation(itemImage, 0.1)!
								}
								let base64String = data.base64EncodedString(options: .lineLength64Characters)
								
								self.ref.child("Users").child(userId).child("contactInfo").setValue(["name": userName, "latitude": coordinate.latitude, "longitude":coordinate.longitude ,"email": emailId, "zipcode": zipCode, "mobileno": Int(mobileNo),"address": address, "uid": userId, "image":base64String ])
								self.navigationController?.dismiss(animated: true, completion: nil)
							}
						})

						
						
						
						
					}
				}
			}
		}

		
		/*
		
		let coordinate = self.forwardGeocoding(address: address)
		FIRAuth.auth()?.createUser(withEmail: emailId, password: password, completion:{ (user, error) in
			if let error = error{
				print(error)
				return
			} else {
				let userId: String = (user?.uid)!
				var data: Data = Data()
				if let itemImage = self.profileImageView.image{
					data = UIImageJPEGRepresentation(itemImage, 0.1)!
				}
				let base64String = data.base64EncodedString(options: .lineLength64Characters)
				
				self.ref.child("Users").child(userId).child("contactInfo").setValue(["name": userName, "latitude": String(coordinate.latitude), "longitude":String(coordinate.longitude) ,"email": emailId, "zipcode": zipCode, "mobileno": mobileNo,"address": address, "uid": userId, "image":base64String ])
				self.navigationController?.dismiss(animated: true, completion: nil)
			}
		})
*/
	}
		
	func forwardGeocoding(address: String) -> CLLocationCoordinate2D {
		var coordinate = CLLocationCoordinate2D()
		CLGeocoder().geocodeAddressString(address) {(placemarks, error) in
			if let error = error {
				print(error)
				return
			}
			if let placemarks = placemarks {
				if placemarks.count > 0 {
					let placemark = placemarks[0]
					if let location = placemark.location{
						coordinate = location.coordinate
						print("\nlat: \(coordinate.latitude), long: \(coordinate.longitude)")
					}
				}
			}
		}
		return coordinate
	}
	
	
	@IBAction func chooseProfilePhoto(_ sender: Any) {
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
 			profileImageView.contentMode = .scaleAspectFit
			profileImageView.image = pickedImage
		}
		dismiss(animated: true, completion: nil)
	}
	
	func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
		picker.dismiss(animated: true, completion: nil)
	}
}
