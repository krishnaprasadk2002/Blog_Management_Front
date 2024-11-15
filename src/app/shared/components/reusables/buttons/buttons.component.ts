import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.css'
})
export class ButtonsComponent {
  @Input() item: any;
  @Input() showEdit: boolean = false;
  @Input() showDelete: boolean = false;

  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  editEvent() {
    this.onEdit.emit(this.item);
  }

  deleteEvent() {
    this.onDelete.emit(this.item);
  }
}
