import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  model: any = {};
  // @Input() Users: User[] = [];
  @Output() cancelRegister = new EventEmitter();

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  register() {
    this.accountService.register(this.model).subscribe({
      next: (response) => {
        // console.log(response); this reponse contains the user
        this.toastr.success(
          response.userName + ' has been registered!',
          'Registered!'
        );
        this.cancel();
      },
      error: (err) => this.toastr.error(err.error),
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
