import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  private _isEditCard = new Subject<any>();
  isEditCard$ = this._isEditCard.asObservable();
  isEditCard(isShow: any) {
    this._isEditCard.next(isShow);
  }
}
