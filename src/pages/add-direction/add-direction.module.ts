import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddDirectionPage } from './add-direction';

@NgModule({
  declarations: [
    AddDirectionPage,
  ],
  imports: [
    IonicPageModule.forChild(AddDirectionPage),
  ],
})
export class AddDirectionPageModule {}
