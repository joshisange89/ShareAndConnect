//
//  LoginViewController.swift
//  ShareAndConnect
//
//  Created by Santa on 2/10/17.
//  Copyright © 2017 santa. All rights reserved.
//

import UIKit
import Firebase

class LoginViewController: UIViewController {
	
	@IBOutlet weak var emailTextField: UITextField!
	@IBOutlet weak var passwordTextField: UITextField!
	
	var activityIndicator = UIActivityIndicatorView(activityIndicatorStyle: .gray)
	override func viewDidLoad() {
		super.viewDidLoad()
		
		activityIndicator.hidesWhenStopped = true
		activityIndicator.activityIndicatorViewStyle = .gray
		activityIndicator.center = view.center
		// Do any additional setup after loading the view.
		// 1
//		FIRAuth.auth()!.addStateDidChangeListener() { auth, user in
//			// 2
//			if user != nil {
//				// 3
//		  self.performSegue(withIdentifier: "loginToHome", sender: nil)
//			}
//		}
	}
	
	@IBAction func onTap(_ sender: Any) {
		self.view.endEditing(true)
	}
	
	
	@IBAction func loginButtonPressed(_ sender: UIButton) {
		activityIndicator.startAnimating()
		FIRAuth.auth()?.signIn(withEmail: emailTextField.text!, password: passwordTextField.text!, completion: { (user, error) in
			self.activityIndicator .stopAnimating()
			
			if let error = error {
				print(error)
			}
			if let user = user {
				print(user)
				self.performSegue(withIdentifier: "loginToHome", sender: nil)
			}
			if (error != nil){
				print("show error alert")
			}
		})
	}
	
}
