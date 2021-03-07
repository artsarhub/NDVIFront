import {Component, OnInit} from '@angular/core';
import {BackendService} from './shared/services/backend.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'NDVIFront';
  isLoading$: Observable<boolean> = this.backendService.isLoading;
  folderList: Observable<string[]> = this.backendService.folderList;

  constructor(private backendService: BackendService) {
  }

  ngOnInit(): void {
    this.backendService.loadFolderList();
  }
}
