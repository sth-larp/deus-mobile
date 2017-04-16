import { Component } from '@angular/core';
import { DbConnectionService } from "../services/db-connection.service";

@Component({
  selector: 'page-technical-info',
  templateUrl: 'technical-info.html'
})
export class TechnicalInfoPage {
  public logEntries = new Array<any>();
  constructor(private _dbConnectionService: DbConnectionService) { }

  // tslint:disable-next-line:no-unused-variable
  private ionViewWillEnter() {
    this._dbConnectionService.loggingDb
      .query('mobile/latest', { include_docs: true, limit: 20, descending: true })
      .then(res => {
        this.logEntries = [];
        for(let row of res.rows)
          this.logEntries.push(this._rowToLogEntry(row));
      })
      .catch(err => console.log(JSON.stringify(err)));
  }

  private _rowToLogEntry(row: any): any {
    return {
      subtext: row.doc.level,
      text: row.doc.msg,
    }
  }
}
