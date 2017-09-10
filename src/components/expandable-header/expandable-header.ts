import { Component, Input, ElementRef, Renderer } from '@angular/core';

@Component({
  selector: 'expandable-header',
  templateUrl: 'expandable-header.html'
})
export class ExpandableHeader {

  @Input('scrollArea') scrollArea: any;
  @Input('headerHeight') headerHeight: number;
  newHeaderHeight: any;
  constructor(public element: ElementRef, public renderer: Renderer) {
    console.log('Hello ExpandableHeaderComponent Component');
    this.renderer.setElementStyle(this.element.nativeElement,'height', this.headerHeight + 'px');
  }

  ngOnInit(){
    console.log(this.scrollArea);
    this.scrollArea.ionScroll.subscribe((ev) => {
      this.resizeHeader(ev);
    });
  }

  resizeHeader(ev){
    this.newHeaderHeight = this.headerHeight - ev.scrollTop;

    if(this.newHeaderHeight < 0){
      this.newHeaderHeight = 0;
    }   

    this.renderer.setElementStyle(this.element.nativeElement,'height', this.newHeaderHeight + 'px');

      
  }

}
