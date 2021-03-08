import {Injectable} from '@angular/core';
import 'leaflet-draw/dist/leaflet.draw.js';
import {Subject} from 'rxjs';

import {ResultData} from '../interfaces/api-interfaces';
import {FILE_SERVER_URL} from '../constants/api-url-list';

declare var L;

@Injectable({providedIn: 'root'})
export class LeafletService {
  mymap;
  polygons = new L.FeatureGroup();
  coordsChanges: Subject<string> = new Subject<string>();

  initMap(): void {
    this.mymap = L.map('map').setView([46.1979, 40.9899], 8);
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
    this.polygons.clearLayers();
  }

  drawGeom(elementId = 'polygon_coords', geomType = L.Draw.Polygon, drawnLayer = this.polygons): void {
    // отрубаем режим рисования (для повторных нажатий)
    this.mymap.off(L.Draw.Event.CREATED);

    // получаем элемент, в который будем писать WKT строчку
    // const inputElement = document.getElementById(elementId);

    // вводим тип отрисовываемой геометрии
    const geom = new geomType(this.mymap);

    // включаем рисовалку
    geom.enable();

    // когд нарисовали
    this.mymap.on('draw:created', (event) => {
      // получаем нарисованный слой
      const layer = event.layer;

      // очищаем старые нарисованные объекты
      drawnLayer.clearLayers();

      // показываем на карте
      drawnLayer.addLayer(layer);
      drawnLayer.addTo(this.mymap);

      // формируем строчку WKT
      const wkt = this.toWKT(layer);

      // и передаем в инпут
      // $(inputElement).val(wkt);
      this.coordsChanges.next(wkt);

    });
  }

  private toWKT(layer): string {
    let lng, lat, coords = [];

    if (layer instanceof L.LayerGroup) {
      layer = layer.getLayers()[0];
    }

    if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
      const latlngs = layer.getLatLngs()[0];
      for (let i = 0; i < latlngs.length; i++) {

        coords.push(latlngs[i].lng + ' ' + latlngs[i].lat);
        if (i === 0) {
          lng = latlngs[i].lng;
          lat = latlngs[i].lat;
        }
      }
      if (layer instanceof L.Polygon) {
        return 'POLYGON((' + coords.join(',') + ',' + lng + ' ' + lat + '))';
      } else if (layer instanceof L.Polyline) {
        return 'LINESTRING(' + coords.join(',') + ')';
      }
    } else if (layer instanceof L.Marker) {
      return 'POINT(' + layer.getLatLng().lng + ' ' + layer.getLatLng().lat + ')';
    }
  }
}
