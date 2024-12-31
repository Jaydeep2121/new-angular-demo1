import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { LOGIN_CREDENTIAL_PAYLOAD } from '../../models/login.model';
import { isControlInvalid } from '../../../../helpers/_validators';
import { SharedModule } from '../../helper/shared.module';
import { NgSelectModule } from '@ng-select/ng-select'
import { School, Site, schoolSiteDetailsResponse } from '../../models/login-response.model';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule,NgSelectModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  private accessType = environment.accessType;
  loginCredential:LOGIN_CREDENTIAL_PAYLOAD = {
    username: "",
    password: "",
    schoolId: 0,
    siteId: 0,
    grant_Type: "",
    refresh_Token: ""
  }
  // loginForm: FormGroup;
  loginFormGroup: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; 
  isOpen: boolean=false;
  isDataLoading:boolean=false;
  schoolNamesList:School[]=[];
  schoolSiteNamesList:Site[]=[];
  responseError:string='';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {

    this.isLoadingSubject = new BehaviorSubject<boolean>(false);  this.isLoading$ = this.isLoadingSubject.asObservable();
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(["/", "admin"]);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'    
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/admin';
  }


  initForm() {
     this.loginFormGroup= this.fb.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', [Validators.required]],
      schoolNames: [null, Validators.required],
      schoolSiteNames: [null, Validators.required],
     }); 
  }
  
  isControlInvalidWrapper(controlName: string): boolean {
    return isControlInvalid(this.loginFormGroup.get(controlName)!);
  }

  onSubmit() {
    this.hasError = false;
    const formControls = this.loginFormGroup.controls;
    this.loginCredential.username = formControls['username'].value;
    this.loginCredential.password = formControls['password'].value;
    this.loginCredential.schoolId = parseInt(formControls['schoolNames'].value.value)
    this.loginCredential.siteId = parseInt(formControls['schoolSiteNames'].value.value)
    const loginSubscr = this.authService
      .login(this.loginCredential)
      .subscribe((user: any) => {
        if (user) {
          const type = localStorage.getItem(this.accessType);
          let route: string;
          switch (type) {
            case 'admin':
              route = '/admin';
              break;
            case 'user':
              route = '/user';
              break;
            case 'master':
              route = '/master';
              break;
          }
        this.router.navigate([route]);
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(loginSubscr);
  }

  getDetails(){
    this.loginFormGroup.patchValue({schoolNames: null,schoolSiteNames: null});
    this.isLoadingSubject.next(true);
      this.isDataLoading = true;
      const payload = {
        UserName:this.loginFormGroup.controls['username'].value,
        Password:this.loginFormGroup.controls['password'].value
      }
      const userDetails = this.authService.getSchoolSiteDetails(payload).subscribe(
        (response:schoolSiteDetailsResponse) => {
          if(response.response.returnNumber === 200) { 
            this.responseError='';
            this.schoolNamesList = response.school;
            this.schoolSiteNamesList = response.site;
            this.isOpen = true;
            this.isLoadingSubject.next(false);
          }else{
            this.responseError= response.response?.errorMessage;
            this.toastr.error(this.responseError, 'Error', {timeOut: 3000});
            this.isOpen = false;
            this.isLoadingSubject.next(false);
          }
        },
        (error) => {
          // Handle error
          console.error('Error:', error);
          this.responseError='Something went wrong.try again!';
          this.toastr.error(this.responseError, 'Error', {timeOut: 3000});
          this.isOpen = false;
          this.isLoadingSubject.next(false);
        } 
      );
    this.unsubscribe.push(userDetails);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
