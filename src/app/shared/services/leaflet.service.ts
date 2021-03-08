import {Injectable} from '@angular/core';

import {ResultData} from '../interfaces/api-interfaces';
import {FILE_SERVER_URL} from '../constants/api-url-list';

declare var L;

@Injectable({providedIn: 'root'})
export class LeafletService {
  mymap;

  initMap(): void {
    this.mymap = L.map('map').setView([55.75, 37.61], 8);
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    });
    tiles.addTo(this.mymap);
  }

  drawResult(result: ResultData): void {
    const plottyRenderer = L.LeafletGeotiff.plotty({
      displayMin: 0,
      displayMax: 255,
      clampLow: true,
      clampHigh: true,
    });

    const renderer1 = L.LeafletGeotiff.rgb();

    const options = {
      // Optional, band index to use as R-band
      rBand: 0,
      // Optional, band index to use as G-band
      gBand: 1,
      // Optional, band index to use as B-band
      bBand: 2,
      // band index to use as alpha-band
      // NOTE: this can also be used in combination with transpValue, then referring to a
      // color band specifying a fixed value to be interpreted as transparent
      alphaBand: 3,
      // for all values equal to transpValue in the band alphaBand, the newly created alpha
      // channel will be set to 0 (transparent), all other pixel values will result in alpha 255 (opaque)
      transpValue: 0,
      renderer: renderer1,
    };

    const windSpeedLayer = L.leafletGeotiff(`${FILE_SERVER_URL}/${result.tif_name}`, options).addTo(this.mymap);
  }
}
