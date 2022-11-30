import { ToastrService } from 'ngx-toastr';
import { AccountService } from './../_services/account.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
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
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  @Output() cancelRegister = new EventEmitter();

  model: any = {};
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();

  ngOnInit() {
    this.intializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18) // passing into the date time picker only if the user is 18 years old
  }

  // this method is used for the validation
  intializeForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      gender: ['male',],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });

    // everytime the value changes we subscribe and then check the validity
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () =>
        this.registerForm.controls['confirmPassword'].updateValueAndValidity(),
    });
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
