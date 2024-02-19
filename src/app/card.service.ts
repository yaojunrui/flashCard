import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFlash } from './card/card.component';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = '/flashcard/sql.php'; // 根据实际API调整URL

  constructor(private http: HttpClient) { }

  // 获取所有卡片
  getAllCards(): Observable<IFlash[]> {
    const data = { func: "selectAllCards", data: "" }
    return this.http.post<any[]>(this.apiUrl, data);
  }

  createCard(tableData: any): Observable<any> {
    const data = { func: "insert", data: { tableName: "flash_card", tableData: tableData } }
    return this.http.post<any>(this.apiUrl, data)
  }

  deleteCard(cardId: any): Observable<any> {
    const data = { func: "del", data: { tableName: "flash_card", id: cardId } }
    return this.http.post<any>(this.apiUrl, data)
  }

  editCard(cardData: any, cardId: number): Observable<any> {
    const data = { func: "update", data: { tableName: "flash_card", tableData: cardData, id: cardId } }
    return this.http.post<any>(this.apiUrl, data)
  }
}
