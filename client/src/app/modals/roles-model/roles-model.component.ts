import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-roles-model',
  templateUrl: './roles-model.component.html',
  styleUrls: ['./roles-model.component.css']
})
export class RolesModelComponent implements OnInit {

  username = "";
  availableRoles: any[] = [];
  selectedRoles: any[] = [];

  constructor(public bsModalRef:BsModalRef) { }

  ngOnInit(): void {
  }

  // used to update the values whether a checkbox is checked or not checked
  updateChecked(checkedValue: string){
    const index = this.selectedRoles.indexOf(checkedValue);
    index !== -1 ? this.selectedRoles.splice(index, 1) : this.selectedRoles.push(checkedValue);
  }

}
