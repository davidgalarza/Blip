import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartmPage } from './cartm';

@NgModule({
  declarations: [
    CartmPage,
  ],
  imports: [
    IonicPageModule.forChild(CartmPage),
  ],
})
export class CartmPageModule {}
