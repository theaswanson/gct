import { Component } from '@angular/core';
import { File } from './File';
import { GctService } from './gct.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  gameId: string;
  code: string;

  constructor(private gctService: GctService) {
    this.gameId = "";
    this.code = "";
  }

  generate(): void {
    let gct: number[];

    try {
      gct = this.gctService.generate(this.code);
    } catch (error) {
      console.error((error as Error).message);
      return;
    }

    let file = {
      file: new Uint8Array(gct),
      name: `${this.gameId}.gct`,
      type: 'application/octet-stream'
    } as File;
    this.downloadFile(file);
  }
  
  private downloadFile(file: File): void {
    let a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([file.file], { type: file.type }));
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
