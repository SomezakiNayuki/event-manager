import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { ServerCommunicationService } from '../services/server-communication.service';
declare var $: any;

@Component({
  selector: 'em-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnChanges, OnInit {

  // Server communication
  private baseURL: string;

  @Input() public activate: boolean;
  private activity: boolean;

  @Output() private loginEvent = new EventEmitter<Object>();

  protected accountType: string;

  // Login fields
  protected usernameLogin: string;
  protected passwordLogin: string;

  // Login logic controll
  protected invalidUsernameLogin: boolean;
  protected loginFailed: boolean;

  // Login screens
  protected accountTypeScreenLogin: boolean;
  protected credentialScreenLogin: boolean;

  // Register fields
  protected usernameRegister: string;
  protected emailRegister: string;
  protected passwordRegister: string;
  protected passwordRegisterComfirmation: string;
  protected firstNameRegister: string;
  protected lastNameRegister: string;

  // Register logic controll
  protected invalidUsernameRegister: boolean;
  protected invalidEmail: boolean;
  protected invalidPassword: boolean;
  protected invalidPasswordConfirmation: boolean;
  protected invalidFirstName: boolean;
  protected invalidLastName: boolean;
  protected RegisterFailed: boolean;

  // Regsiter screens
  protected credentialScreen: boolean;
  protected passwordScreen: boolean;
  protected accountTypeScreen: boolean;

  constructor(private http: HttpClient, private serverCommunicationService: ServerCommunicationService) { }

  public ngOnInit(): void {
    this.baseURL = this.serverCommunicationService.getBaseURL();
  }

  public ngOnChanges(): void {
    this.activity = this.activate;
    this.accountType = undefined;
    this.initLoginModal();
    this.initRegisterModal();
  }

  private initLoginModal(): void {
    this.usernameLogin = undefined;
    this.passwordLogin = undefined;
    this.invalidUsernameLogin = false;
    this.loginFailed = false;

    // SCREENS
    this.accountTypeScreenLogin = true;
    this.credentialScreenLogin = false;
  }

  private initRegisterModal(): void {
    this.usernameRegister = undefined;
    this.emailRegister = undefined;
    this.passwordRegister = undefined;
    this.passwordRegisterComfirmation = undefined;
    this.firstNameRegister = undefined;
    this.lastNameRegister = undefined;
    this.invalidUsernameRegister = false;
    this.invalidEmail = false;
    this.invalidPassword = false;
    this.invalidPasswordConfirmation = false;
    this.invalidFirstName = false;
    this.invalidLastName = false;
    this.RegisterFailed = false;

    // SCREENS
    this.accountTypeScreen = true;
    this.credentialScreen = false;
    this.passwordScreen = false;
  }

  protected selectAccountTypeLogin(value: any): void {
    this.accountType = value;
    this.accountTypeScreenLogin = false;
    this.credentialScreenLogin = true;
  }

  protected selectAccountTypeRegister(value: any): void {
    this.accountType = value;
    this.credentialScreen = true;
    this.accountTypeScreen = false;
  }

  // ------------------------------------- Login controll ------------------------------------- //

  protected login(): void {
    if (this.validateLoginCredential(this.usernameLogin)) {
      this.loginSubmit(this.usernameLogin, this.passwordLogin);
    }
  }

  private validateLoginCredential(username: string): boolean {
    if (this.validateUsername(username) || this.validateEmail(username)) {
      this.invalidUsernameLogin = false;
      return true;
    } else {
      this.invalidUsernameLogin = true;
      return false;
    }
  }

  private loginSubmit(username: string, password: string): void {
    let requestBody = {username: username, password: password};
    var path = undefined;
    if (this.accountType === 'host') {
      path = '/loginHost'
    } else if (this.accountType === 'customer') {
      path = '/loginCustomer'
    }

    this.http.post<any>(this.baseURL + path, requestBody).pipe(
      catchError(this.loginErrorHandler.bind(this))
    ).subscribe(() => {
      this.closeLoginModal();
      this.loginComplete(this.usernameLogin, this.passwordLogin, false);
    })
  }

  private loginErrorHandler(err: HttpErrorResponse): Observable<any> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
      if (err.status === 500) {
        this.loginFailed = true;
      }
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }

  protected closeLoginModal(): void {
    $('#LoginModal').modal('hide');
  }

  private loginComplete(username: string, password: string, isRegister: boolean): void {
    if (isRegister) {
      let fetchURL = this.accountType === 'host' ? '/fetchHost' : '/fetchCustomer';
      this.http.post<any>(this.baseURL + fetchURL, {username: username, password: password}).subscribe(data => {
        let user: User = new User();
        user.id = data.id;
        user.accountType = this.accountType;
        user.username = username;
        user.email = data.email;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.messages = this.accountType === 'host' ? undefined : data.messages.reverse();
        user.tickets = data.tickets;
        this.loginEvent.emit(user);
      });
    } else {
      let fetchURL = this.accountType === 'host' ? '/fetchHost' : '/fetchCustomer';
      this.http.post<any>(this.baseURL + fetchURL, {username: username, password: password}).subscribe(data => {
        let user: User = new User();
        user.id = data.id;
        user.accountType = this.accountType;
        user.username = username;
        user.email = data.email;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.messages = this.accountType === 'host' ? undefined : data.messages.reverse();
        user.tickets = data.tickets;
        this.loginEvent.emit(user);
      });
    }
  }

  // ------------------------------------- Register controll ------------------------------------- //

  protected registerDetails(): void {
    if (this.validateRegisterDetails(this.usernameRegister, this.emailRegister, this.firstNameRegister, this.lastNameRegister)) {
      this.passwordScreen = true;
      this.credentialScreen = false;
    }
  }

  protected register(): void {
    if (this.validatePassword(this.passwordRegister) && this.validatePasswordConfirmation(this.passwordRegisterComfirmation)) {
      let requestBody = {username: this.usernameRegister,
        email: this.emailRegister,
        password: this.passwordRegister,
        firstname: this.firstNameRegister,
        lastname: this.lastNameRegister
      }
      var path = undefined;
      if (this.accountType === 'host') {
        path = '/registerHost'
      } else if (this.accountType === 'customer') {
        path = '/registerCustomer'
      }
      this.http.post<any>(this.baseURL + path, requestBody).pipe(
        catchError(this.RegisterErrorHandler.bind(this))
      ).subscribe(() => {
        this.closeRegisterDialog();
        this.loginComplete(this.usernameRegister, this.passwordRegister, true);
        this.passwordScreen = false;
      });
    }
  }

  private RegisterErrorHandler(err: HttpErrorResponse): Observable<any> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
      if (err.status === 500) {
        this.RegisterFailed = true;
      }
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }

  protected closeRegisterDialog(): void {
    $('#RegisterModal').modal('hide');
  }

  // ------------------------------------- Validation controll ------------------------------------- //

  private validateUsername(username: string): boolean {
    if (username !== undefined && username !== '' && username.match('^[a-zA-Z0-9]+$')) {
      this.invalidUsernameRegister = false;
      return true;
    } else {
      this.invalidUsernameRegister = true;
      return false;
    }
  }

  private validateEmail(email: string): boolean {
    if (email !== undefined && email !== '' && email.match('^(.+)@(.+)$')) {
      this.invalidEmail = false;
      return true;
    } else {
      this.invalidEmail = true;
      return false;
    }
  }

  private validatePassword(password: string): boolean {
    if (password !== undefined
        && password !== ''
        && password.match('[A-Z]{1}')
        && password.match('[a-z]{1}')
        && password.match('[0-9]{1}')
        && password.match('[!@#$%^&*]{1}')
        && password.match('.{6,}')) {
      this.invalidPassword = false;
      return true;
    } else {
      this.invalidPassword = true;
      return false;
    }
  }

  private validatePasswordConfirmation(password: string): boolean {
    if (password !== undefined && password !== '' && password == this.passwordRegister) {
      this.invalidPasswordConfirmation = false;
      return true;
    } else {
      this.invalidPasswordConfirmation = true;
      return false;
    }
  }

  private validateFirstName(givenName: string): boolean {
    if (givenName !== undefined && givenName !== '' && givenName.match('^[a-zA-Z]+$')) {
      this.invalidFirstName = false;
      return true;
    } else {
      this.invalidFirstName = true;
      return false;
    }
  }

  private validateLastName(givenName: string): boolean {
    if (givenName !== undefined && givenName !== '' && givenName.match('^[a-zA-Z]+$')) {
      this.invalidLastName = false;
      return true;
    } else {
      this.invalidLastName = true;
      return false;
    }
  }

  private validateRegisterDetails(username: string, email: string, firstName: string, lastName: string): boolean {
    if (this.validateFirstName(firstName)
        && this.validateLastName(lastName)
        && this.validateUsername(username)
        && this.validateEmail(email)) {
      return true;
    } else {
      return false
    }
  }

}
