import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { randomInt } from 'crypto';
import { CardService } from '../card.service';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2'
import { MessageService } from '../message.service';

export interface IFlash {
  question: string;
  answer: string;
  show?: number;
  id?: number;
  remember?: number;
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})

export class CardComponent {

  constructor(private cardservice: CardService, private messageservice: MessageService) { }
  private _data: IFlash = { question: "Question1", answer: "Answer1", show: 0, id: 1 };
  public get data(): IFlash {
    return this._data;
  }
  @Input()
  public set data(value: IFlash) {
    this._data = value;

    this.setColor(value.remember)
  }

  private setColor(remember: any) {
    if (remember == 1) {
      this.questionColor = "green"
      this.textColor = "white"
    }
    else if (remember == 0) {
      this.questionColor = "red"
      this.textColor = "white"
    }
    else
      this.questionColor = "white"
    this.textColor = "black"
  }
  @Output() rightEmit = new EventEmitter();
  @Output() deleteEmit = new EventEmitter();
  questionColor: string = "white";
  textColor: string = "black";

  onRight() {
    this.cardservice.editCard({ remember: 1 }, this.data.id)
      .subscribe(res => {
        this.questionColor = "green", this.textColor = "white"
      })

  }

  onWrong() {
    this.cardservice.editCard({ remember: 0 }, this.data.id)
      .subscribe(res => {
        this.questionColor = "red", this.textColor = "white"
      })
  }
  onEdit() {
    //this.editEmit.emit(this.data)

    this.messageservice.isEditCard(this.data)
  }
  onDelete() {
    Swal.fire({
      title: "Do you want to delete the changes?",
      showCancelButton: true,
      confirmButtonText: "delete",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.deleteEmit.emit(this.data.id)
      }
    });
  }

  onShow() {
    this.data.show == 0 ? this.data.show = 1 : this.data.show = 0
  }




}

