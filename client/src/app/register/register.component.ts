import { ToastrService } from 'ngx-toastr';
import { AccountService } from './../_services/account.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private accountService: AccountService,
    private toastr: ToastrService
  ) {}

  @Output() cancelRegister = new EventEmitter();

  model: any = {};

  registerForm: FormGroup = new FormGroup({});

  ngOnInit() {
    this.intializeForm();
  }

  // this method is used for the validation
  intializeForm() {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        this.matchValues('password'), // we match to the password
      ]),
    });

    // everytime the value changes we subscribe and then check the validity
    this.registerForm.controls['password'].valueChanges.subscribe({
      next : () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo).value
        ? null
        : { notMatching: true };
    };
  }

  register() {
    console.log(this.registerForm.value);

    // this.accountService.register(this.model).subscribe({
    //   next: (res) => {
    //     console.log(res);
    //     this.cancel(); // in order to hide the register
    //   },
    //   error: (err) => {
    //     // this.toastr.error(err.error) // using the toastr services
    //     console.log(err)
    //   },
    // });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
