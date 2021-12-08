import { Component, AfterViewInit } from '@angular/core';
import { MapLoaderService } from './map.loader';
declare var google: any;

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  map: any;
  drawingManager: any;
  bermudaTriangle: any;
  poistionList: any = [
    { custId: 1, latLng: { lat: -34.397, lng: 150.644 }, valid: false },
    { custId: 1, latLng: { lat: -84.397, lng: 150.644 }, valid: false },
  ];
  constructor() {}

  ngAfterViewInit() {
    MapLoaderService.load().then(() => {
      this.drawPolygon();
    });
  }

  drawPolygon() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(-35.774, 150.19),
      map: this.map,
    });
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(-84.397, 150.644),
      map: this.map,
    });
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon'],
      },
    });

    this.drawingManager.setMap(this.map);
    google.maps.event.addListener(
      this.drawingManager,
      'overlaycomplete',
      (event) => {
        // Polygon drawn
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          //this is the coordinate, you can assign it to a variable or pass into another function.
          /* alert(event.overlay.getPath().getArray()); */
          this.bermudaTriangle = new google.maps.Polygon({
            paths: event.overlay.getPath().getArray(),
          });
          alert(this.bermudaTriangle);
          for (let pos of this.poistionList) {
            var bpos = google.maps.geometry.poly.containsLocation(
              pos.latLng,
              this.bermudaTriangle
            )
              ? true
              : false;
            console.log(bpos);
          }
        }
      }
    );
    /* google.maps.event.addListener(this.map, 'click', (e) => {
      console.log('e.latLng');
      console.log(e.latLng);
      const resultColor = google.maps.geometry.poly.containsLocation(
        e.latLng,
        this.bermudaTriangle
      )
        ? 'blue'
        : 'red';

      const resultPath = google.maps.geometry.poly.containsLocation(
        e.latLng,
        this.bermudaTriangle
      )
        ? // A triangle.
          'm 0 -1 l 1 2 -2 0 z'
        : google.maps.SymbolPath.CIRCLE;

      new google.maps.Marker({
        position: e.latLng,
        map: this.map,
        icon: {
          path: resultPath,
          fillColor: resultColor,
          fillOpacity: 0.2,
          strokeColor: 'white',
          strokeWeight: 0.5,
          scale: 10,
        },
      });
    }); */
  }
}
