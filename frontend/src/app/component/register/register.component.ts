import {Component, OnInit} from '@angular/core';
import {User} from '../../moduls/user';
import {UserService} from '../../service/user/user.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AsyncValidatorFn, FormControl, FormGroup, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, first, map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup = new FormGroup({

    firstName: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Zа-яА-Я\']{2,40}$')
    ]),

    lastName: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Zа-яА-Я\']{2,40}$')
    ]),

    email: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z0-9_]+@[a-zA-Z_]+?\.[a-zA-Z]{2,4}'
      )], [
      this.emailValidator()
      ]),

    login: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Zа-яА-Я\'_0-9]{4,40}$'
      )], [
      this.loginValidator()
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Zа-яА-Я\'_0-9]{4,40}$')
    ]),

    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Zа-яА-Я\'_0-9]{4,40}$'),
    ])
  });


  constructor(private userService: UserService,
              private router: Router) {}

  public subscriptions: Subscription[] = [];

  public user: User = new User();

  ngOnInit(): void {

    this.confirmPass();
  }

  register() {
    const user = new User();
    user.login = this.form.controls.login.value;
    user.firstName = this.form.controls.firstName.value;
    user.lastName = this.form.controls.lastName.value;
    user.password = this.form.controls.password.value;
    user.email = this.form.controls.email.value;

    console.log('register');

    this.saveUser(user);
  }

  public saveUser(user: User): void{
    this.subscriptions.push(this.userService.saveUser(user).subscribe(response => {this.user = response; console.log(response); }));
    console.log(user);
  }

  private loginValidator(): AsyncValidatorFn {
    return control => control.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((val: string) => this.userService.getUserByLogin(val)),
        map((res: User) => (res != null ? {loginExist: true} : null)),
        first()
      );
    console.log(this.user);
  }

  // private loginValidator(): AsyncValidatorFn {
  //   return control => control.valueChanges
  //     .pipe(
  //       debounceTime(500),
  //       distinctUntilChanged(),
  //       switchMap((val: string) => this.userService.existUser(val)),
  //       map((res: User) => (res != null ? {loginExist: true} : null)),
  //       first()
  //     );
  //   console.log(this.user);
  // }

  private emailValidator(): AsyncValidatorFn {
    return control => control.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((val: string) => this.userService.getUserByEmail(val)),
        map((res: User) => (res != null ? {emailExist: true} : null)),
        first()
      );
  }

  private confirmPass() {
    this.form.controls.confirmPassword.valueChanges.subscribe(confPass => {
      const pass = this.form.controls.password;
      if (pass.value === confPass) {
        this.form.controls.confirmPassword.setErrors(null);
      } else {
        this.form.controls.confirmPassword.setErrors({isConfirm: false});
      }
    });
    this.form.controls.password.valueChanges.subscribe(confPass => {
      const pass = this.form.controls.confirmPassword;
      if (pass.value === confPass) {
        this.form.controls.confirmPassword.setErrors(null);
      } else {
        this.form.controls.confirmPassword.setErrors({isConfirm: false});
      }
    });
  }

  get login() {
    return this.form.get('login');
  }

  get email(){
    return this.form.get('email');
  }

  public gender(name: string): void{
    this.user.gender = name;
  }


}
