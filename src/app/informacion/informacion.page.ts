import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import * as L from 'leaflet';
@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})

export class InformacionPage implements OnInit {

  // VARIABLE PARA EL MAPA
  map: L.Map;

  // VARIABLES USADAS PARA INICIAR SESION
  userEmail: String = "";
  userUID: String = "";
  isLogged: boolean;

  constructor(
    private callNumber:CallNumber,
    private authService: AuthService, 
    public afAuth: AngularFireAuth,
    private router: Router
  ) { }

  // MÉTODO PARA REALIZAR LA LLAMADA
  llamada(){
    this.callNumber.callNumber('4556541648',true)
    .then(()=> console.log("llamada exitosa"))
    .catch(() => console.log("error"))
  }

  // MÉTODO QUE VERIFICA EL INICIO DE SESIÓN
  ionViewDidEnter(){
    this.loadMap();
    this.isLogged = false;
    this.afAuth.user.subscribe(user =>{
      if(user){
        this.userEmail = user.email;
        this.userUID = user.uid;
        this.isLogged = true;
      } 
    })
  }

  // MÉTODO QUE CARGA EL MAPA
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

  // MÉTODO QUE DESPLAZA A LA PAG LOGIN
  login() {
    this.router.navigate(["/login"]);
  }

  // MÉTODO PARA CERRAR SESIÓN
  logout(){
    this.authService.doLogout()
    .then(res => {
      this.userEmail = "";
      this.userUID = "";
      this.isLogged = false;
      console.log(this.userEmail);
    }, err => console.log(err));
  }

  ngOnInit() {
  }

}
