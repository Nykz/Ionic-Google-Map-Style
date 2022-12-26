import { GmapService } from './../../services/gmap.service';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

  @ViewChild('map', {static: true}) mapElementRef: ElementRef;
  googleMaps: any;
  source: any = { lat: 28.651798, lng: 77.183022 };
  dest: any = { lat: 28.5167287, lng: 77.3187642 };
  directionsService: any;
  directionsDisplay: any;

  constructor(
    private maps: GmapService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.loadMap();
  }

  async loadMap() {
    try {
      console.log('map');
      let googleMaps: any = await this.maps.loadGoogleMaps();
      const mapEl = this.mapElementRef.nativeElement;
      const map = new googleMaps.Map(mapEl, {
        center: { lat: this.source.lat, lng: this.source.lng },
        disableDefaultUI: true,
        zoom: 18,
        styles: this.maps.mapStyleCustom
      });
      this.directionsService = new googleMaps.DirectionsService;
      this.directionsDisplay = new googleMaps.DirectionsRenderer;
      this.directionsDisplay = new googleMaps.DirectionsRenderer();

      // const sourceIconUrl = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000';
      // const destinationIconUrl = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=D|FF0000|000000';
      
      const sourceIconUrl = 'assets/imgs/location.png';
      const destinationIconUrl = 'assets/imgs/location.png';
      
      const source_position = new googleMaps.LatLng(this.source.lat, this.source.lng);
      const destination_position = new googleMaps.LatLng(this.dest.lat, this.dest.lng);

      const source_icon = {
        url: sourceIconUrl,
        scaledSize: new googleMaps.Size(30, 30), // scaled size
        origin: new googleMaps.Point(0, 0), // origin
        anchor: new googleMaps.Point(0, 0) // anchor
      };
      const destination_icon = {
        url: destinationIconUrl,
        scaledSize: new googleMaps.Size(30, 30), // scaled size
        origin: new googleMaps.Point(0, 0), // origin
        anchor: new googleMaps.Point(0, 0) // anchor
      };
      const source_marker = new googleMaps.Marker({
        map: map,
        position: source_position,
        animation: googleMaps.Animation.DROP,
        icon: source_icon,
      });

      const destination_marker = new googleMaps.Marker({
        map: map,
        position: destination_position,
        animation: googleMaps.Animation.DROP,
        icon: destination_icon
      });

      source_marker.setMap(map);
      destination_marker.setMap(map);

      this.directionsDisplay.setMap(map);
      this.directionsDisplay.setOptions({
        polylineOptions: {
          strokeWeight: 4,
          strokeOpacity: 1,
          strokeColor: 'black'
        },
        suppressMarkers: true
      });

      await this.drawPolyline();

      map.setCenter(source_position);
      this.renderer.addClass(mapEl, 'visible');
    } catch(e) {
      console.log(e);
    }
  }

  drawPolyline() {
    this.directionsService.route({
      origin: this.source,
      destination: this.dest,
      travelMode: 'DRIVING',
      provideRouteAlternatives: true
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
        console.log('response: ', response);
        const directionsData = response.routes[0].legs[0];
        const duration = directionsData.duration.text;
        console.log(duration);
      } else {
        console.log(status);
      }
    });
  }



}
