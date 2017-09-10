import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrakingPage } from './traking';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    TrakingPage,
  ],
  imports: [
    IonicPageModule.forChild(TrakingPage),
    Ionic2RatingModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
],
})
export class TrakingPageModule {}
