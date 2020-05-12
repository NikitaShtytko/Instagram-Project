import {Component, OnInit} from '@angular/core';
import {User} from '../../../moduls/user';
import {UserService} from '../../../service/user/user.service';
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
    this.user.gender = 'MAN';
  }

  register() {
    this.user.login = this.form.controls.login.value;
    this.user.firstName = this.form.controls.firstName.value;
    this.user.lastName = this.form.controls.lastName.value;
    this.user.password = this.form.controls.password.value;
    this.user.email = this.form.controls.email.value;

    console.log('register');

    console.log(this.user);
    this.subscriptions.push(this.userService.saveUser(this.user).subscribe(response =>
    {this.user = response; console.log(response);
     this.router.navigate(['/home/' + this.user.login]);
    }));
  }

  public saveUser(user: User): void{
    this.subscriptions.push(this.userService.saveUser(user).subscribe(response => {this.user = response; console.log(response); }));
  }

  // private loginValidator(): AsyncValidatorFn {
  //   return control => control.valueChanges
  //     .pipe(
  //       debounceTime(500),
  //       distinctUntilChanged(),
  //       switchMap((val: string) => this.userService.getUserByLogin(val)),
  //       map((res: User) => (res != null ? {loginExist: true} : null)),
  //       first()
  //     );
  //   console.log(this.user);
  // }

  private loginValidator(): AsyncValidatorFn {
    return control => control.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((val: string) => this.userService.existUser(val)),
        map((res: User) => (res != null ? {loginExist: true} : null)),
        first()
      );
  }

  private emailValidator(): AsyncValidatorFn {
    return control => control.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((val: string) => this.userService.existEmail(val)),
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
    console.log(this.user.gender);
  }


}
