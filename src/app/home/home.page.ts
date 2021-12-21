import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Tienda } from '../tienda';
import { Router } from '@angular/router';

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
  
  tiendaEditando: Tienda;
  constructor(private firestoreService: FirestoreService, private router: Router) {
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

  segundaPantalla (){
    this.router.navigate(['detalle/:id'])
  }

  idHerramientaSelec: string;

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
  
}
