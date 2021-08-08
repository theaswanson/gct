import { Component } from '@angular/core';
import { File } from './File';
import { GctService } from './gct.service';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  gameId: string;
  code: string;

  constructor(private gctService: GctService, private notificationService: NotificationService) {
    this.gameId = "";
    this.code = "";
  }

  generate(): void {
    let gct: number[];

    try {
      gct = this.gctService.generate(this.code);
    } catch (error) {
      this.notificationService.open((error as Error).message);
      return;
    }

    this.downloadGCT(gct);
    this.notificationService.open('Downloading...');
  }

  private downloadGCT(gct: number[]): void {
    let file = {
      file: new Uint8Array(gct),
      name: `${this.gameId}.gct`,
      type: 'application/octet-stream'
    } as File;
    this.download(file);
  }

  private download(file: File): void {
    let a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([file.file], { type: file.type }));
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
