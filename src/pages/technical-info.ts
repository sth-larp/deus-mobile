import { Component } from '@angular/core';
import { DbConnectionService } from "../services/db-connection.service";
import { Refresher, InfiniteScroll } from "ionic-angular";

class LogEntry {
  public text: string;
  public level: number; // 0 - debug, 1 - info, 2 - warning, 3 - error
}

@Component({
  selector: 'page-technical-info',
  templateUrl: 'technical-info.html'
})
export class TechnicalInfoPage {
  public logEntries = new Array<LogEntry>();
  public level: string = "info";
  private _numEntries = 20;

  constructor(private _dbConnectionService: DbConnectionService) { }

  // tslint:disable-next-line:no-unused-variable
  private ionViewWillEnter() {
    this._numEntries = 20;
    this._queryLogs();
  }

  private _queryLogs(): Promise<void> {
    return this._dbConnectionService.getLoggingDb()
      .query(`mobile/${this.level}`, { include_docs: true, limit: this._numEntries, descending: true })
      .then(res => {
        this.logEntries = [];
        for(let row of res.rows)
          this.logEntries.push(this._rowToLogEntry(row));
      })
      .catch(err => console.log(JSON.stringify(err)));
  }

  private _rowToLogEntry(row: any): LogEntry {
    return {
      text: row.doc.msg,
      level: row.doc.level
    }
  }

  public onLevelSelect(level: string) {
    this.level = level;
    this._queryLogs();
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
