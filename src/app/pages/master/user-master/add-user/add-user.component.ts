import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { isControlInvalid } from '../../../../helpers/_validators';
import { SharedModule } from '../../../../modules/auth/helper/shared.module';
import { UserMasterRequest } from '../../services/user-master/user-master.model';
import { UserMasterService } from '../../services/user-master/user-master.service';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [NgbModalModule, SharedModule, InlineSVGModule, NgSelectModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  @Output() onAdd: EventEmitter<boolean> = new EventEmitter();
  @Output() onCancel: EventEmitter<any> = new EventEmitter();
  private authLocalStorageToken = `${environment.appVersion}-${environment.userDataKey}`;

  schoolList: any[] = [];
  siteList: any[] = [];
  unsubscribe: Subscription[] = [];
  successMessage: string='';
  errorMessage: string='';
  userType:string='';
  private accessType = environment.accessType;
  schoolId:number;
  siteId:number;
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
 
  userForm: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    userName: ['', Validators.required],
    password: ['', Validators.required],
    school: [null, Validators.required],
    site: [null, Validators.required]
  });
  
  constructor(
    private formBuilder: FormBuilder,
    private userMasterService: UserMasterService,
    private toastr: ToastrService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);  
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.userType=localStorage.getItem(this.accessType);
    const storedData = localStorage.getItem(this.authLocalStorageToken);
    const parsedData = JSON.parse(storedData);
    this.siteId = parsedData.defaultSiteId;
    this.schoolId = parsedData.schoolId;
    if (this.userType!=='master') {
      this.userForm.removeControl('school');
      this.userForm.removeControl('site');
    }
    if (this.userType==='master') {
      this.getSchoolSiteList();
      this.onSchoolValueChange();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  getSchoolSiteList() {
    const schoolSiteList$ = this.userMasterService.GetSchoolSiteList().subscribe(
      (response:any) => {
        this.schoolList = response.value;
      },
      (error) => {
        console.error('Error:', error);
      } 
    );
    this.unsubscribe.push(schoolSiteList$);
  }

  onSchoolValueChange(): void {
    this.userForm.get('school')?.valueChanges.subscribe((val) => {
      this.siteList = [];

      this.userForm.patchValue({
        site: null,
      });

      if (this.schoolList.length > 0 && val) {
        const targetSchool = this.schoolList.find((school: any) => school.name === val.name);
  
        if (targetSchool && targetSchool.site && targetSchool.site.length > 0) {
          this.siteList = targetSchool.site;
          this.siteList = targetSchool.site.map(item => {
            return {
              value: item.id,
              text: `${item.name}`,
            };
          });
        }
      }
    });
  }
    
    compareFn(item1: any, item2: any): boolean {
      return item1 && item2 ? item1.value === item2.value : item1 === item2;
    }

  
  isControlInvalidWrapper(controlName: string): boolean {
    return isControlInvalid(this.userForm.get(controlName)!);
  }

  selectAll(controlName: string): void {
    const items = this.getSelectedAllValue(controlName);        
    this.userForm.get(controlName)?.setValue(items);
  }
  unselectAll(controlName:string) {
    this.userForm.get(controlName)?.setValue([]);
  }

  getSelectedAllValue(control:string){
    switch (control) {
      case 'site':
        return this.siteList;
      default:
        break;
    }
  }

  onCancelClick() {
    this.onCancel.emit();
  }

  submit(): void {
    this.isLoadingSubject.next(true);
    if (!this.userForm.valid) {
      return;
    }
    this.successMessage = '';
    this.errorMessage = '';
    const { firstName, lastName, userName, password, school, site } = this.userForm.value;
    const payload: UserMasterRequest = {
      userId: 0,
      firstName,
      lastName,
      userName,
      password,
      schoolId: (this.userType==='master')?school?.id || null:this.schoolId,
      siteId:  (this.userType==='master')?site?.map((x) => x.value) || null:this.siteId,
      type:(this.userType==='master')?1:2
    };
    const userSave$ = this.userMasterService.AddUserMaster(payload).subscribe(
        (res: any) => {
          if (res.returnNumber == 200) {
            this.successMessage = 'User Created Successfully!';
            this.toastr.success(`User Created Successfully!`, 'Success', {timeOut: 3000});
            this.onAdd.emit(true);
          } else {
            this.errorMessage = res?.errorMessage;
            this.toastr.error(`Error While create user details!`, 'Error', {timeOut: 3000});
            return;
          }
          this.isLoadingSubject.next(false);
        },
        (error) => {
          this.toastr.error(`Error While create user details!`, 'Error', {timeOut: 3000});
          console.error('Error:', error);
          this.isLoadingSubject.next(false);
        }
      );
    this.unsubscribe.push(userSave$);
    this.userForm.reset();
  }
}
