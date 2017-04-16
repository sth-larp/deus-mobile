import { Component } from '@angular/core';
import { DbConnectionService } from "../services/db-connection.service";
import { Refresher, InfiniteScroll } from "ionic-angular";

@Component({
  selector: 'page-technical-info',
  templateUrl: 'technical-info.html'
})
export class TechnicalInfoPage {
  public logEntries = new Array<any>();

  private _numEntries = 20;

  constructor(private _dbConnectionService: DbConnectionService) { }

  // tslint:disable-next-line:no-unused-variable
  private ionViewWillEnter() {
    this._numEntries = 20;
    this._queryLogs();
  }

  private _queryLogs(): Promise<void> {
    return this._dbConnectionService.loggingDb
      .query('mobile/latest', { include_docs: true, limit: this._numEntries, descending: true })
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

  public doRefresh(refresher: Refresher) {
    this._queryLogs()
    .then(() => refresher.complete())
    .catch(() => refresher.complete());
  }

  public doInfinite(infiniteScroll: InfiniteScroll) {
    this._numEntries += 20;
    infiniteScroll.waitFor(this._queryLogs());
  }
}
