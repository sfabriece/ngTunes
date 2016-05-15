import {Injectable, Inject} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Store, Reducer, Action} from '@ngrx/store';

import {LogService} from './log.service';
import {WindowService} from './window.service';

// analytics
const CATEGORY: string = 'Snapshot';

/**
 * ngrx setup start --
 */
export interface ISnapshotState {
  image?: any;
  element?: any;
}

const initialState: ISnapshotState = {
};

interface ISNAPSHOT_ACTIONS {
  SNAPSHOT_NOW: string;
  SNAPSHOT_READY: string;
  SNAPSHOT_CLEAR: string;
}

export const SNAPSHOT_ACTIONS: ISNAPSHOT_ACTIONS = {
  SNAPSHOT_NOW: `[${CATEGORY}] SNAPSHOT_NOW`,
  SNAPSHOT_READY: `[${CATEGORY}] SNAPSHOT_READY`,
  SNAPSHOT_CLEAR: `[${CATEGORY}] SNAPSHOT_CLEAR`
};

export const snapshotReducer: Reducer<ISnapshotState> = (state: ISnapshotState = initialState, action: Action) => {
  let changeState = () => {
    return Object.assign({}, state, action.payload);
  };
  switch (action.type) {
    case SNAPSHOT_ACTIONS.SNAPSHOT_NOW:
      action.payload.image = undefined;
      return changeState();
    case SNAPSHOT_ACTIONS.SNAPSHOT_READY:
      action.payload.element = undefined;
      return changeState();
    case SNAPSHOT_ACTIONS.SNAPSHOT_CLEAR:
      action.payload = {
        element: undefined,
        image: undefined
      };
      return changeState();
    default:
      return state;
  }
};
/**
 * ngrx end --
 */

@Injectable()
export class SnapshotService {

  constructor(private logger: LogService, private win: WindowService, private store: Store<any>, @Inject('screenshot') private screenshot) {
    store.select('snapshot').subscribe((state: ISnapshotState) => {
      if (state.element || state.image) {
        if (state.element) {
          this.snap(state.element);
        } else if (state.image) {
          this.win.open(state.image);
        }
        this.store.dispatch({ type: SNAPSHOT_ACTIONS.SNAPSHOT_CLEAR });
      }
    });
  }

  public snap(el: any) {
    let width = this.win.innerWidth;
    let height = this.win.innerHeight;
      // var context = canvas.getContext('experimental-webgl', {preserveDrawingBuffer: true});
    this.store.dispatch({ type: SNAPSHOT_ACTIONS.SNAPSHOT_READY, payload: { image: this.screenshot.convertToPNG(el, width, height).src } });
  }
}
