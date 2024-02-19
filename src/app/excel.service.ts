import { Injectable } from '@angular/core';
import { Observable, fromEvent, map } from 'rxjs';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  getExcelData(file: File): Observable<any[]> {
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    return fromEvent(fileReader, 'load').pipe(
      map((event) => {
        const binary: string = (<any>event.target).result;
        const workbook = XLSX.read(binary, { type: 'binary' });
        const wsname: string = workbook.SheetNames[0];
        const ws: XLSX.WorkSheet = workbook.Sheets[wsname];
        return XLSX.utils.sheet_to_json(ws, {
          raw: false,
          defval: null,
          blankrows: false,
        });
      })
    );
  }
}
