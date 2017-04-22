/**
 * Created by Aparna on 3/9/17.
 */

import { ContactInfo } from './contactinfo';
import { PostItem } from './postitem';
import { WishList } from './wishlist';

export class User {
  constructor(
    public contactInfo: ContactInfo,
    public postedItems: PostItem,
    public wishList: WishList
  ){}
}
