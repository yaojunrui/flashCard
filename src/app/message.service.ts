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

  private _isCorrect = new Subject<any>();
  isCorrect$ = this._isCorrect.asObservable();
  isCorrect() {
    this._isCorrect.next(null);
  }

}
