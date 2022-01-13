import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GCT } from 'src/app/models/GCT';
import { CacheService } from 'src/app/services/cache/cache.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ClearCacheDialogComponent } from '../clear-cache-dialog/clear-cache-dialog.component';

@Component({
  selector: 'app-cache-controls',
  templateUrl: './cache-controls.component.html',
  styleUrls: ['./cache-controls.component.scss']
})
export class CacheControlsComponent {

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
