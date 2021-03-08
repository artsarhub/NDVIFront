import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, EMPTY} from 'rxjs';
import {delay, expand, last, switchMap, tap} from 'rxjs/operators';

import {API_URL, CALC_NDVI, GET_FOLDER_LIST, GET_PROGRESS} from '../constants/api-url-list';
import {Progress} from '../interfaces/api-interfaces';

@Injectable({providedIn: 'root'})
export class BackendService {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  folderList: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  progress: BehaviorSubject<Progress> = new BehaviorSubject<Progress>({
    error: 0,
    message: '',
    total_progress: 0,
    cur_progress: 0,
  });

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

  startCalcNDVI(polygonCoords: string, date: string): void {
    this.isLoading.next(true);
    const sub = this.http.post<string>(`${API_URL}${CALC_NDVI}`, {polygon: polygonCoords, date})
      .pipe(
        switchMap(procUuid => {
          const request = this.http.get<Progress>(`${API_URL}${GET_PROGRESS}`, {params: {proc_uuid: procUuid}});
          return request.pipe(
            expand(res => {
              this.progress.next(res);
              return res.total_progress === 100 ? EMPTY : request.pipe(delay(1000));
            }),
            last()
          );
        })
      )
      .subscribe(res => {
        console.log(res);
        this.isLoading.next(false);
        sub.unsubscribe();
      });
  }
}
