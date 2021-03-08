import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

import {BackendService} from './shared/services/backend.service';
import {Progress} from './shared/interfaces/api-interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoading$: Observable<boolean> = this.backendService.isLoading;
  folderList$: Observable<string[]> = this.backendService.folderList;
  progress$: Observable<Progress> = this.backendService.progress;

  selectedDate = '';
  polygonCoords = '';

  constructor(private backendService: BackendService) {
  }

  ngOnInit(): void {
    this.backendService.loadFolderList();
  }

  calcNDVI(): void {
    if (this.selectedDate !== '' && this.polygonCoords !== '') {
      this.backendService.startCalcNDVI(this.polygonCoords, this.selectedDate);
    }
  }
}
