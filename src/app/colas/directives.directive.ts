import { Directive, HostListener, ElementRef, OnInit } from '@angular/core';
@Directive({
  selector: '[appDirectives]'
})
export class DirectivesDirective {

  constructor() { }

}

@Directive({
  selector: '[cedula]'
})
export class CedulaDirective implements OnInit {
  private el: HTMLInputElement;
  constructor(
    private elementRef: ElementRef
  ) { 
    this.el = this.elementRef.nativeElement;
    console.log(this.el.value);
  }
  ngOnInit() {
    //console.log(this.el.nodeValue);
  }

}
