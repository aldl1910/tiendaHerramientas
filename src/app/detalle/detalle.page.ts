import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tienda } from '../tienda';
import { FirestoreService } from '../firestore.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

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
  userEmail: String = "";
  userUID: String = "";
  isLogged: boolean;
  imageURL: String;
  
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
    public alertController: AlertController,
    private loadingController: LoadingController,
    private toastConstroller: ToastController,
    private imagePicker: ImagePicker,
    private socialSharing: SocialSharing,
    private authService: AuthService, 
    public afAuth: AngularFireAuth,
    public loadingCtrl: LoadingController,
    private router: Router
    ) {  }

  

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
            this.borrarImagen();
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
  
  

  async uploadImagePicker(){
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    const toast = await this.toastConstroller.create({
      message: 'Image was updated successfully',
      duration: 3000
    });
    this.imagePicker.hasReadPermission().then(
      (result) => {
        if(result == false){
          this.imagePicker.requestReadPermission();
        }
        else{
          this.imagePicker.getPictures({
            maximumImagesCount: 1,
            outputType: 1
          }).then(
            (results) => {
              let imagenes = "imagenes";
              for (var i = 0; i < results.length; i++) {
                loading.present();
                let herramienta = `${new Date().getTime()}`;
                this.firestoreService.uploadImage(imagenes, herramienta, results[i])
                .then(snapshot=> {
                  snapshot.ref.getDownloadURL()
                  .then(downloadURL => {
                    console.log("downloadURL:" + downloadURL);
                    this.document.data.imagen= downloadURL;
                    this.imageURL=this.document.data.imagen;
                    toast.present();
                    loading.dismiss();
                  })
                })
              }
            },
            (err) => {
              console.log(err)
            }
          );
        }
      }, (err) => {
        console.log(err);
      });
  }
  private borrarImagen(){
    this.deleteFile(this.document.data.imagen);
    this.document.data.imagen = null;
  }
  async deleteFile(fileURL) {
    const toast = await this.toastConstroller.create({
      message: 'File was deleted successfully',
      duration: 3000
    });
    this.firestoreService.deleteFileFromURL(fileURL)
    .then(() => {
      this.document.data.imagen="";
      toast.present();
    }, (err) => {
      console.log(err);
    });
  }
  
  ShareGeneric(){
    //const url = this.link
    //const text = parameter+'\n'
    this.socialSharing.share(this.document.data.titulo, 'MEDIUM', null, this.document.data.imagen);
  }
  ShareWhatsapp(){
    this.socialSharing.shareViaWhatsApp(this.document.data.titulo, this.document.data.imagen, null)
  }

  ShareFacebook(){
    this.socialSharing.shareViaFacebookWithPasteMessageHint(this.document.data.titulo, this.document.data.imagen, null /* url */, 'Copia Pega!')
  }

  SendEmail(){
    this.socialSharing.shareViaEmail('text', 'subject', ['email@address.com'])
  }

  SendTwitter(){
    this.socialSharing.shareViaTwitter(this.document.data.titulo, this.document.data.imagen, null)
  }

  SendInstagram(){
    this.socialSharing.shareViaInstagram(this.document.data.titulo, this.document.data.imagen)
  }
  ionViewDidEnter(){
    this.isLogged = false;
    this.afAuth.user.subscribe(user =>{
      if(user){
        this.userEmail = user.email;
        this.userUID = user.uid;
        this.isLogged = true;
      } else {
        this.router.navigate(["/home"])
      }
    })
  }
}
