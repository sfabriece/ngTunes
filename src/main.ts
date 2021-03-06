import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode, provide } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { provideStore } from '@ngrx/store';
import { EyeTunesAppComponent, environment } from './app/';

import {
  WindowService,
  APP_PROVIDERS,
  spotifyReducer,
  snapshotReducer,
  audiographReducer,
  twitterReducer
} from './app/shared/index';

declare var window: any;

if (environment.production) {
  enableProdMode();
}

bootstrap(EyeTunesAppComponent, [
  HTTP_PROVIDERS,
  provide(WindowService, { useValue: window }),
  provide('screenshot', { useValue: window.Canvas2Image }),
  // provide('screenshot', { useValue: window.html2canvas }),
  // provide('fullpage', { useValue: window.document.body }),
  provide('fullpage', { useValue: window.document.getElementById('canvas') }),
  provide('pusherInstance', {
    useFactory: () => {
      return new (<any>window).Pusher('130b662bea2d14b75a32');
    }
  }),
  APP_PROVIDERS,
  provideStore({
    spotify: spotifyReducer,
    snapshot: snapshotReducer,
    audiograph: audiographReducer,
    twitter: twitterReducer
  })
]);
