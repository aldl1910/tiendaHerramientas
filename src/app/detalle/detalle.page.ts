import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tienda } from '../tienda';
import { FirestoreService } from '../firestore.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  id: string = "";
  //titulo: string ="";
  //precio: string ="";
  // descripcion: string ="";
  document: any = {
    id: "",
    data: {} as Tienda
  };
  arrayColeccionTienda: any =[{
    id:"",
    data:{} as Tienda
  }]
  tiendaEditando: Tienda;
  constructor(
    private activatedRoute: ActivatedRoute, 
    private firestoreService: FirestoreService, 
    public alertController: AlertController) {  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.firestoreService.consultarPorId("herramientas", this.id).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        // Como ejemplo, mostrar el título de la tarea en consola
        console.log(this.document.data.titulo);
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Tienda;
      } 
    });
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

  idHerramientaSelec: string;
  clicBotonInsertar(){
    return this.firestoreService.insertar("herramientas", this.document.data).then(
      ()=> {
        console.log("Herramienta creada correctamente");
        // Limpiar el contenido de la herramienta que se estaba editando
        this.tiendaEditando = {} as Tienda;
      }, (error) => {
        console.error(error);
      }
    );
  }
  clicBotonBorrar(){
    this.alertController.create({
      header: 'Confirm Alert',
      subHeader: 'Beware lets confirm',
      message: 'Are you sure? you want to leave without safty mask?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Lo necesito!');
          }
        },
        {
          text: 'Sí!',
          handler: () => {
            console.log('Qué más dá');
            this.firestoreService.borrar("herramientas", this.document.id).then(() => {
              this.obtenerListaHerramientas();
              this.tiendaEditando = {} as Tienda;
            })
          }
        }
      ]
    }).then(res => {
      res.present();
    });
    
  }

  clicBotonModificar(){
    this.firestoreService.actualizar("herramientas", this.document.id, this.document.data).then(() => {
      this.obtenerListaHerramientas();
      this.tiendaEditando = {} as Tienda;
    });
  }
  
  showConfirm() {
    this.alertController.create({
      header: 'Confirm Alert',
      subHeader: 'Beware lets confirm',
      message: 'Are you sure? you want to leave without safty mask?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Lo necesito!');
          }
        },
        {
          text: 'Sí!',
          handler: () => {
            console.log('Qué más dá');
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }
}
