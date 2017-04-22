import {PostItem} from "./postitem";

export class DisplayPostedItem {
  constructor(
    public postitemkey?: string,
    public postitem?: PostItem,
    public distance?: number,
    public userkey?: string
  ){}
}
