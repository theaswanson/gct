import { Component } from '@angular/core';
import { CacheService } from './cache.service';
import { Code } from './Code';
import { File } from './File';
import { GCT } from './GCT';
import { GctService } from './gct.service';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  gcts: GCT[];
  selectedGCT: GCT;
  selectedCode: Code;

  constructor(
    private cacheService: CacheService,
    private gctService: GctService,
    private notificationService: NotificationService
  ) {
    this.gcts = this.cacheService.load();
    this.selectedGCT = this.gcts[0];
    this.selectedCode = this.selectedGCT.codes[0];
  }

  generate(gctIndex: number): void {
    let gct: number[];

    try {
      gct = this.gctService.generate(this.gcts[gctIndex].codes);
    } catch (error) {
      this.notificationService.open((error as Error).message);
      return;
    }

    this.downloadGCT(gct, this.gcts[gctIndex].gameId);
    this.notificationService.open('Downloading...');
  }

  selectCode(codeIndex: number): void {
    this.selectedCode = this.selectedGCT.codes[codeIndex];
  }

  deleteCode(codeIndex: number): void {
    this.selectedGCT.codes.splice(codeIndex, 1);
  }

  newCode(gctIndex: number): void {
    this.gcts[gctIndex].codes.push({ name: 'New Code' } as Code);
  }

  private downloadGCT(gct: number[], gameId: string): void {
    let file = {
      file: new Uint8Array(gct),
      name: `${gameId}.gct`,
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
