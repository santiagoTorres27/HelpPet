import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  constructor() {}

  kindFilter: string = '';
  sortByFilter: string = '';

  @Output() onKindEmitted: EventEmitter<string> = new EventEmitter();

  @Output() onSortByEmitted: EventEmitter<string> = new EventEmitter();

  ngOnInit(): void {}

  onKind() {
    this.onKindEmitted.emit(this.kindFilter);
  }

  onSort() {
    this.onSortByEmitted.emit(this.sortByFilter);
  }
}
