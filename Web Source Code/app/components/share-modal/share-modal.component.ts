import { Component } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { AF } from '../../providers/af';

export class ShareModalContext extends BSModalContext {
  public itemkey: string;
  public owner: string;
}

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.css']
})

export class ShareModalComponent implements CloseGuard, ModalComponent<ShareModalContext> {
  context: ShareModalContext;

  constructor(public dialog: DialogRef<ShareModalContext>, private afService: AF) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  shareItem(borrowEmail){
    this.afService.shareItem(this.context.itemkey, this.context.owner, borrowEmail);
    this.dialog.close();
  }

  beforeDismiss(): boolean {
    return true;
  }
}
