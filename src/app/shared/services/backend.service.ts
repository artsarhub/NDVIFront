import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {API_URL, GET_FOLDER_LIST} from '../constants/api-url-list';

@Injectable({providedIn: 'root'})
export class BackendService {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  folderList: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient) {
  }

  loadFolderList(): void {
    this.isLoading.next(true);
    const sub = this.http.get<string[]>(`${API_URL}${GET_FOLDER_LIST}`)
      .subscribe(folderList => {
        this.folderList.next(folderList);
        this.isLoading.next(false);
        sub.unsubscribe();
      });
  }
}
