import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectionsManagerPage } from './directions-manager';

@NgModule({
  declarations: [
    DirectionsManagerPage,
  ],
  imports: [
    IonicPageModule.forChild(DirectionsManagerPage),
  ],
})
export class DirectionsManagerPageModule {}
