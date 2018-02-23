import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipes'
})
export class PipesPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    //console.log(value, args);
    let type = typeof(value);
    let number = Number(value);
    console.log(value);
    if(number != NaN){
      return value;
    } else {
      value = '';
      return value;
    }
  }

}
