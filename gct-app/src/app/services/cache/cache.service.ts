import { Injectable } from '@angular/core';
import { GCT } from 'src/app/models/GCT';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  cacheName: string;

  constructor() {
    this.cacheName = 'gct-cache';
  }

  save(gcts: GCT[]): void {
    localStorage.setItem(this.cacheName, JSON.stringify(gcts));
  }

  load(): GCT[] {
    const cache = localStorage.getItem(this.cacheName);
    return cache ? JSON.parse(cache) : [new GCT()];
  }

  clear(): void {
    localStorage.clear();
  }

  download(): void {
    const cache = this.load();
    const cacheJson = JSON.stringify(cache);
    let blob = new Blob([cacheJson], { type: 'text/json' });
    this.downloadBlob(blob, 'GCT.json');
  }

  private downloadBlob(blob: Blob, fileName: string): void {
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }
}
