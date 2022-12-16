import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-roles-model',
  templateUrl: './roles-model.component.html',
  styleUrls: ['./roles-model.component.css']
})
export class RolesModelComponent implements OnInit {

  title = "";
  list: any;
  closeBtnName = "";

  constructor(public bsModalRef:BsModalRef) { }

  ngOnInit(): void {
  }

}
