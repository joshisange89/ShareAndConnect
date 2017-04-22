/**
 * Created by Aparna on 3/16/17.
 */

export class PostItem {
  constructor(
    public itemImage?: string,
    public name?: string,
    public description?: string,
    public careInst?: string,
    public availableDate?: string,
    public sharedWith?: string,
    public addedByUser?: string
  ){}
}
