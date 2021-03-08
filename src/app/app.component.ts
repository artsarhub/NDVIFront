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
  polygonCoords = 'POLYGON((39.2376 47.3518,39.2514 47.2470,39.2156 47.2302,39.2349 47.04439,39.3214 47.0442, 39.3145 46.9483,39.4831 46.9851,39.5356 47.0640,39.74921 47.0819,39.7705 47.0078,40.0286 46.9727, 39.9461 47.3648,39.2376 47.3518))';

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
