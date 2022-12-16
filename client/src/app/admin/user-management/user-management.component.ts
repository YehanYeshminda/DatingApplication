import { User } from 'src/app/_models/User';
import { AdminService } from './../../_services/admin.service';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModelComponent } from 'src/app/modals/roles-model/roles-model.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  bsModelRef: BsModalRef<RolesModelComponent> =
    new BsModalRef<RolesModelComponent>();
  availableRoles = ['Admin', 'Moderator', 'Member'];

  constructor(
    private adminService: AdminService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe({
      next: (users) => (this.users = users),
    });
  }

  openRolesModal(user: User) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        username: user.username,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles]
      }
    }

    this.bsModelRef = this.modalService.show(RolesModelComponent, config);
    this.bsModelRef.onHide?.subscribe({
      next: () => {
        const selectedRoles = this.bsModelRef.content?.selectedRoles;
        if (!this.arrayEqaul(selectedRoles, user.roles)) {
          this.adminService.updateUserRoles(user.username, selectedRoles).subscribe({
            next: (roles) => user.roles = roles
          })
        }
      }
    })
  }

  private arrayEqaul(arr1: any[], arr2: any[]) {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }
}
