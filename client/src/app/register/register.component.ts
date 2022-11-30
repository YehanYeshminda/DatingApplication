import { Router } from '@angular/router';
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
    private fb: FormBuilder,
    private router: Router
  ) {}

  @Output() cancelRegister = new EventEmitter();

  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  validationErrors: String[] | undefined;

  ngOnInit() {
    this.intializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18); // passing into the date time picker only if the user is 18 years old
  }

  // this method is used for the validation
  intializeForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      gender: ['male'],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(8)],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });

    // everytime the value changes we subscribe and then check the validity
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () =>
        this.registerForm.controls['confirmPassword'].updateValueAndValidity(),
    });
  }

  register() {
    const dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value)
    const values = {...this.registerForm.value, dateOfBirth: dob}

    this.accountService.register(values).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigateByUrl("/members"); // in order to hide the register
      },
      error: (err) => {
        // this.toastr.error(err.error) // using the toastr services
        this.validationErrors = err
      },
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo).value
        ? null
        : { notMatching: true };
    };
  }

  // getting the date from the date object converting from time zone time to 10-10-2022
  private getDateOnly(dob: string | undefined) {
    if (!dob) return null;

    let theDob = new Date(dob);

    return new Date(
      theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset())
    )
      .toISOString()
      .slice(0, 10);
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
