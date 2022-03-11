import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformacionPageRoutingModule } from './informacion-routing.module';

import { InformacionPage } from './informacion.page';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformacionPageRoutingModule
  ],
  declarations: [InformacionPage]
})
export class InformacionPageModule {}
