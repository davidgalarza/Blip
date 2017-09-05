import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrakingPage } from './traking';

@NgModule({
  declarations: [
    TrakingPage,
  ],
  imports: [
    IonicPageModule.forChild(TrakingPage),
  ],
})
export class TrakingPageModule {}
