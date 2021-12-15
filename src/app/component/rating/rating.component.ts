import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

enum COLOR{
  GREY= "#e0e0e0",
  GREEN= "#76ff03",
  YELLOW= "#ffca28",
  RED= "#dd2c00"
}

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {

  @Input() rating: number ;

  @Output() ratingChange: EventEmitter<number> = new EventEmitter();;

  constructor() { }

  ngOnInit() {}

  rate(index: number){
    this.rating = index;
    this.ratingChange.emit(this.rating)
  }

  getColor(index: number){
    if(this.isAboveRating(index)){
      return COLOR.GREY
    }

    switch(this.rating){
      case 1:
      case 2:
        return COLOR.RED
      case 3:
        return COLOR.YELLOW
      case 4:
      case 5:
        return COLOR.GREEN
      default:
        return COLOR.GREY
    }
  }

  isAboveRating(index: Number) : boolean{
    return index > this.rating;
  }


}
