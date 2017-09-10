import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OptsPage } from './opts';

@NgModule({
  declarations: [
    OptsPage,
  ],
  imports: [
    IonicPageModule.forChild(OptsPage),
  ],
})
export class OptsPageModule {}
