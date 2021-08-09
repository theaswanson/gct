import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CacheService } from '../cache.service';
import { ClearCacheDialogComponent } from '../clear-cache-dialog/clear-cache-dialog.component';
import { GCT } from '../GCT';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-cache-controls',
  templateUrl: './cache-controls.component.html',
  styleUrls: ['./cache-controls.component.scss']
})
export class CacheControlsComponent implements OnInit {

  @Input() gcts: GCT[];
  @Output() gctsChange: EventEmitter<GCT[]>;

  constructor(
    private cacheService: CacheService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    this.gcts = [];
    this.gctsChange = new EventEmitter<GCT[]>();
  }

  ngOnInit(): void {
  }

  save(): void {
    this.cacheService.save(this.gcts);
    this.notificationService.open('Saved.');
  }

  load(): void {
    this.gctsChange.emit(this.cacheService.load());
    this.notificationService.open('Loaded.');
  }

  clear(): void {
    const confirmationDialog = this.dialog.open(ClearCacheDialogComponent);
    confirmationDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.clearSaveData();
      }
    });
  }

  private clearSaveData() {
    this.gcts = [];
    this.cacheService.clear();
    this.notificationService.open('Cleared save data.');
  }

  download(): void {
    this.cacheService.download();
  }

}
