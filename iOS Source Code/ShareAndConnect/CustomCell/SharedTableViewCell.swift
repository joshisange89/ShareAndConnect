//
//  SharedTableViewCell.swift
//  ShareAndConnect
//
//  Created by Santa on 2/10/17.
//  Copyright © 2017 santa. All rights reserved.
//

import UIKit

class SharedTableViewCell: UITableViewCell {
	@IBOutlet weak var itemName: UILabel!
	@IBOutlet weak var itemImage: UIImageView!
	@IBOutlet weak var itemAvailableDate: UILabel!
	//@IBOutlet weak var itemPostedBy: UILabel!
	//@IBOutlet weak var sharedWithLabel: UILabel!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
