import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Tienda } from '../tienda';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  arrayColeccionTienda: any =[{
    id:"",
    data:{} as Tienda
  }]
  filtro: string='';

  // VARIABLES USADAS PARA INICIAR SESION
  userEmail: String = "";
  userUID: String = "";
  isLogged: boolean;

  tiendaEditando: Tienda;

  constructor(
    private firestoreService: FirestoreService, 
    private router: Router,  
    public loadingCtrl: LoadingController,
    private authService: AuthService, 
    public afAuth: AngularFireAuth) {
    // Crear una herramienta vacía al empezar
    this.tiendaEditando = {} as Tienda;
    this.obtenerListaHerramientas();
    
  }
  obtenerListaHerramientas(){
    this.firestoreService.consultar("herramientas").subscribe((resultadoConsultaHerramientas) =>
    {
      this.arrayColeccionTienda =[];
      resultadoConsultaHerramientas.forEach((datosTienda: any) => {
        this.arrayColeccionTienda.push({
          id: datosTienda.payload.doc.id,
          data: datosTienda.payload.doc.data()
        });
      })
    });
  }

  // MÉTODO QUE NOS DESPLAZA A LA PAG DETALLE
  segundaPantalla (){
    this.router.navigate(['detalle/:id'])
  }

  idHerramientaSelec: string;

  // MÉTODO QUE ALMACENA LOS DATOS DE LAS HERRAMIENTAS
  selecHerramienta(herramientaSelec){
    console.log("Herramienta seleccionada:");
    console.log(herramientaSelec);
    this.idHerramientaSelec = herramientaSelec.id;
    this.tiendaEditando.titulo = herramientaSelec.data.titulo;
    this.tiendaEditando.precio = herramientaSelec.data.precio;
    this.tiendaEditando.descripcion = herramientaSelec.data.descripcion;
    this.tiendaEditando.imagen = herramientaSelec.data.imagen;
    this.router.navigate(['/detalle', this.idHerramientaSelec]);
  }

  // MÉTODO QUE VERIFICA EL INICIO DE SESIÓN
  ionViewDidEnter(){
    this.isLogged = false;
    this.afAuth.user.subscribe(user =>{
      if(user){
        this.userEmail = user.email;
        this.userUID = user.uid;
        this.isLogged = true;
      } 
    })
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
}
