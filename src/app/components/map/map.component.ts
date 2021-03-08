import {AfterViewInit, Component, OnInit} from '@angular/core';

import {LeafletService} from '../../shared/services/leaflet.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  constructor(private leafletService: LeafletService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.leafletService.initMap();
  }

}
