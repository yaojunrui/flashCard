import { ChangeDetectorRef, Component, ViewChild, input } from '@angular/core';
import { RouterOutlet } from '@angular/router'
import { CardComponent, IFlash } from './card/card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardService } from './card.service';
import { concatMap, from, map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MessageService } from './message.service';
import * as toastr from 'toastr';
import { read, writeFileXLSX } from "xlsx";
import { ExcelService } from './excel.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, CardComponent, CommonModule, FormsModule, MatButtonModule]
})
export class AppComponent {

  title = 'flashCard';

  input_question: string = "";
  input_answer: string = "";

  button_name1: string = "Submit"
  button_name2: string = "Clear"

  private current_id: any = 0

  constructor(private cardservice: CardService, private messageservice: MessageService,
    private excelservice: ExcelService, private cdr: ChangeDetectorRef) { }
  flashCards: IFlash[] = [];

  @ViewChild("input") new_question

  ngOnInit() {
    this.refreshCards();

    this.messageservice.isEditCard$.subscribe(res => {
      this.onEdit(res)
    })

    this.messageservice.isCorrect$.subscribe(res => {
      this.refreshCards()
    })
  }

  refreshCards() {
    this.cardservice.getAllCards().subscribe(res => {
      this.flashCards = res
    })
  }

  onSubmit() {
    if (this.button_name1 === "Submit") {
      const data = {
        question: this.checkStr(this.input_question),
        answer: this.checkStr(this.input_answer)
      }
      console.log(data.question)
      this.cardservice.createCard(data).subscribe(res => {
        console.log(res[0])
        return this.flashCards.push(res[0])
      })
    }
    else if (this.button_name1 === "Update") {

      const index = this.flashCards.findIndex(v => v.id === this.current_id)
      this.flashCards[index].question = this.checkStr(this.input_question)
      this.flashCards[index].answer = this.checkStr(this.input_answer)
      this.button_name1 = "Submit"
      this.button_name2 = "Clear"

      const newCard: IFlash = {
        question: this.checkStr(this.input_question),
        answer: this.checkStr(this.input_answer)
      }
      this.cardservice.editCard(newCard, this.current_id).subscribe(res => {
        res.question = this.checkStr(res.question)
        res.answer = this.checkStr(res.answer)
        return this.flashCards[index].question = res.question,
          this.flashCards[index].answer = res.answer
      })
    }
  }

  onClear() {
    if (this.button_name2 === "Clear") {
      this.input_question = ""
      this.input_answer = ""
    }
    else if (this.button_name2 === "Cancel") {
      this.input_question = ""
      this.input_answer = ""
      this.button_name1 = "Submit"
      this.button_name2 = "Clear"
    }

  }

  onDelete(id: number) {
    const index = this.flashCards.findIndex(v => v.id === id)
    this.cardservice.deleteCard(id).subscribe(res => {
      this.flashCards.splice(index, 1);
      toastr.info('You successfully deleted a card')
    })
  }

  onEdit(data: IFlash) {
    this.button_name1 = "Update"
    this.button_name2 = "Cancel"
    this.input_question = data.question
    this.input_answer = data.answer
    this.current_id = data.id
  }
  onFileChange(event) {
    const file = event.target.files[0]
    this.excelservice.getExcelData(file).subscribe(res => {
      from(res).pipe(
        concatMap(item => {
          item.question = this.checkStr(item.question);
          item.answer = this.checkStr(item.answer);
          return this.cardservice.createCard(item)
        })
      ).subscribe({
        next: (re) => {
          if (re && re.length > 0) this.flashCards.unshift(re[0]);
          console.log(re[0]); // This will add each card to the beginning of the array as they are created
        },
        complete: () => {
          toastr.info('You successfully uploaded a file!');
          console.log('All cards have been created successfully');
        },
        error: (error) => {
          console.error('Error creating cards', error);
        }
      });
    });
  }

  checkStr(str: string) {
    if (str.indexOf("'") > -1) {
      return str.replaceAll("'", "\\'")
    }
    else if (str.indexOf('"') > -1) {
      return str.replaceAll('"', '\\"')
    }
    else
      return str
  }

  onClearAll() {
    Swal.fire({
      title: "Do you want to clear all cards?",
      showCancelButton: true,
      confirmButtonText: "Yes! Clear All",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        toastr.info('You cleared all cards!');
        this.cardservice.clearCards().subscribe(res => {
          this.flashCards = [];
        })
      }
    });

  }

  getCorrectCards() {
    let i = 0
    this.flashCards.forEach(v => {
      if (v.remember == 1)
        i++
    })
    return i
  }

  getWrongCards() {
    let i = 0
    this.flashCards.forEach(v => {
      if (v.remember == 0)
        i++
    })
    console.log(this.flashCards)
    return i

  }
}


