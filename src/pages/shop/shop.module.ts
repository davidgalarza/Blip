import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpandableHeader } from '../../components/expandable-header/expandable-header'
import { ShopPage } from './shop';

@NgModule({
  declarations: [
    ShopPage,
    ExpandableHeader
  ],
  imports: [
    IonicPageModule.forChild(ShopPage),
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  exports: [
    ExpandableHeader, // UPDATE: exporting the component is not necessary
    ShopPage
  ]
})
export class ShopPageModule {}
