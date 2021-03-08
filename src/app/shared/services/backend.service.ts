import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, EMPTY} from 'rxjs';
import {delay, expand, last, switchMap} from 'rxjs/operators';

import {API_URL, CALC_NDVI, GET_FOLDER_LIST, GET_PROGRESS, GET_RESULT} from '../constants/api-url-list';
import {Progress, ResultData} from '../interfaces/api-interfaces';
import {LeafletService} from './leaflet.service';

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
  resultString: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private result: ResultData;

  constructor(private http: HttpClient,
              private leafletService: LeafletService) {
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
    let curProcUuid: string;
    this.isLoading.next(true);
    const sub = this.http.post<string>(`${API_URL}${CALC_NDVI}`, {polygon: polygonCoords, date})
      .pipe(
        switchMap(procUuid => {
          curProcUuid = procUuid;
          const request = this.http.get<Progress>(`${API_URL}${GET_PROGRESS}`, {params: {proc_uuid: procUuid}});
          return request.pipe(
            expand(res => {
              this.progress.next(res);
              return res.total_progress === 100 ? EMPTY : request.pipe(delay(1000));
            }),
            last()
          );
        }),
        switchMap(() => this.http.get<ResultData>(`${API_URL}${GET_RESULT}`, {params: {proc_uuid: curProcUuid}}))
      )
      .subscribe(res => {
        // console.log(res);
        this.result = res;
        this.leafletService.drawResult(res);
        this.resultString.next(`Минимальное: ${res.min}\nМаксимальное: ${res.max}\nСреднее: ${res.mean}\nМедианное: ${res.median}`);
        this.isLoading.next(false);
        sub.unsubscribe();
      });
  }
}
