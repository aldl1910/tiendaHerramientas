import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import * as L from 'leaflet';
@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})

export class InformacionPage implements OnInit {

  map: L.Map;
  constructor(private callNumber:CallNumber) { }

  llamada(){
    this.callNumber.callNumber('4556541648',true)
    .then(()=> console.log("llamada exitosa"))
    .catch(() => console.log("error"))
  }

  ionViewDidEnter(){
    this.loadMap();
  }
  
  

  loadMap() {
    var greenIcon = L.icon({
      iconUrl: 'https://leafletjs.com/SlavaUkraini/examples/custom-icons/leaf-green.png',
      shadowUrl: 'https://leafletjs.com/SlavaUkraini/examples/custom-icons/leaf-shadow.png',
    
      iconSize:     [38, 95], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    let latitud = 69.034716;
    let longitud = 93.994002;
    let zoom = 7.18;
    this.map = L.map("mapId").setView([latitud, longitud], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(this.map);
    var marker = L.marker([latitud, longitud], {icon: greenIcon}).addTo(this.map);
    marker.bindPopup("<b>Bienvenidos al <br>parque nacional <br> Putorana</b>").openPopup();
    var circle = L.circle([51.196612, 34.683744], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(this.map);
    circle.bindPopup("You wouldn't like to be here");
  }

  ngOnInit() {
  }

}
