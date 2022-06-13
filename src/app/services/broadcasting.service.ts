import { filter, map } from 'rxjs/operators'
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

interface BroadcastEvent {
  key: any;
  data?: any;
}
@Injectable()

export class BroadcastingService {

  public _eventBus: Subject<BroadcastEvent> = new Subject<BroadcastEvent>();

  public broadcast(key: any, data?: any) {
    this._eventBus.next({key, data});
  }

  public on<T>(key: any): Observable<T> {
    return this._eventBus.asObservable()
      .pipe(filter(event => event.key === key), map(event => <T>event.data))
  }
}
