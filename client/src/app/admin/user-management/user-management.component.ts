import { User } from 'src/app/_models/User';
import { AdminService } from './../../_services/admin.service';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModelComponent } from 'src/app/modals/roles-model/roles-model.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  bsModelRef: BsModalRef<RolesModelComponent> = new BsModalRef<RolesModelComponent>();

  constructor(private adminService: AdminService, private modelService: BsModalService) { }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles(){
    this.adminService.getUsersWithRoles().subscribe({
      next : (users) => this.users = users
    })
  }

  // in order to show the roles model component
  openRolesModel(){
    const initialState: ModalOptions = {
      initialState: {
        list: [
          'Do thing',
          'thing',
          'Do thing',
          'Do thing'
        ],
        title: "test modal"
      }
    }
    this.bsModelRef = this.modelService.show(RolesModelComponent, initialState);
    this.bsModelRef.content!.closeBtnName = "Close";
  }

}
