import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedModule } from '../../../../../modules/auth/helper/shared.module';
import { BehaviorSubject, Observable, Subscription, finalize } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PHONE_REGEX } from '../../../../../helpers/_constants';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { VisitorService } from '../../../services/visitors/visitor.service';
import { fileTypeValidator, isControlInvalid } from '../../../../../helpers/_validators';
import { BUTTONTEXT,ROUTES } from '../../../../../helpers/_constants';

import { NgSelectModule } from '@ng-select/ng-select'
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ActivatedRoute } from '@angular/router';
import { InviteService } from '../../../services/invites/invite.service';
import { VisitorCheckInCheckOutService } from '../../../../user/services/visitor-check-in-check-out.service';
import { visitorResponse } from '../../../services/visitors/visitor.model';
// import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../../modules/auth/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-visitor',
  standalone:true,
  imports:[SharedModule,
    NgbModalModule,
    InlineSVGModule,
    NgSelectModule,],
  templateUrl: './add-visitor.component.html',
  styleUrls: ['./add-visitor.component.scss'],
})
export class AddVisitorComponent implements OnInit {
  countriesList: any;
  @Input() data: any;
  @Input() userVisit: boolean = false;
  @Output() onNext: EventEmitter<any> = new EventEmitter();
  @Output() onClick: EventEmitter<boolean> = new EventEmitter();
  unsubscribe: Subscription[] = [];
  isVIPStatus: boolean = false;
  isEdit: boolean;
  vipStatusList: any = []
  selectedFile: File | null = null;
  touched: boolean = false;
  stateList: any = [];
  selectedFileName: string | null = null;
  progress: number = 0;
  citiesList: any = [];
  visitorId: number;
  editFileName:string='';
  editFilePath:string='';
  screeenMode: string='';
  buttonText:string='';
  preReg:string=ROUTES.preReg;
  regChe:string=ROUTES.regChe;
  nextBtn:string=BUTTONTEXT.next;
  checkInBtn:string=BUTTONTEXT.regCheckIn;
  hostlistData: any[] = [];
  errorMsg:string='';
  newVisitorId:number;
  categorylistData :any[]=[];
  isAddedOtherCategory:boolean=false;
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;



  visitorForm: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(PHONE_REGEX)]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    city: [null, Validators.required],
    state: [null, Validators.required],
    country: [null, Validators.required],
    blockedEntry: [null, Validators.required],
    vipEntry: [null, Validators.required],
    vipStatus: [null],
  });

  fetchvisitorForm: FormGroup = this.formBuilder.group({
    mobileNum: ['', [Validators.required, Validators.pattern(PHONE_REGEX)]],
    blockedEntry: [''], // Ensure this matches the name in the template
    vipEntry: [''], // Also include other form controls
    // Also include other form controls
    // ... other fo
  });
  fileName: string;
  successText: string='';
  errorMessage: string='';
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public visitorService: VisitorService,
    private route: ActivatedRoute,
    private inviteService: InviteService,
    private VisitorCheckInCheckOutService:VisitorCheckInCheckOutService,
    private toastr: ToastrService,
    private authService: AuthService,
  ) 

   {   this.isLoadingSubject = new BehaviorSubject<boolean>(false);  this.isLoading$ = this.isLoadingSubject.asObservable();}

  removeSelectedFile() {
    this.selectedFile = null;
    this.fileName='';
    this.editFileName='';
    this.visitorForm.patchValue({ profile: null });
  }

  uploadFile(): void {
    // You can implement your file upload logic here
    // For demonstration purposes, let's simulate a delay and update progress
    this.progress = 0;
    const totalSize = this.selectedFile!.size;
    let uploadedSize = 0;

    const bytesPerInterval = 10000; // Simulating uploaded bytes per interval
    const totalIntervals = totalSize / bytesPerInterval; // Total number of intervals needed
    const intervalDuration = 200; // Interval duration in milliseconds
    let currentInterval = 0;

    const interval = setInterval(() => {
      uploadedSize += bytesPerInterval; // Simulating uploaded bytes

      // Update progress
      this.progress = Math.min((uploadedSize / totalSize) * 100, 100);

      // Stop interval when upload is complete
      if (this.progress === 100 || currentInterval >= totalIntervals) {
        clearInterval(interval);
      }
    }, intervalDuration);
  }

  getFileSize(sizeInBytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (sizeInBytes === 0) return '0 Byte';
    const i = parseInt(
      Math.floor(Math.log(sizeInBytes) / Math.log(1024)).toString()
    );
    return Math.round(sizeInBytes / Math.pow(1024, i)) + ' ' + sizes[i];
  }

  ngOnInit(): void {
    // this.isLoadingSubject.next(true);
    this.route.data.subscribe((data:any) => {
      const mode = data.mode;
      this.screeenMode = mode;
    });
    if (!this.userVisit) {
      this.visitorForm.addControl('profile', this.formBuilder.control(null, [Validators.required, fileTypeValidator]));
    }
    if (this.screeenMode===this.regChe || this.screeenMode===this.preReg) {
      this.visitorForm.removeControl('profile');
      this.visitorForm.addControl('reason', this.formBuilder.control(null,Validators.required));
      this.visitorForm.addControl('host', this.formBuilder.control(null,Validators.required));
      this.getHostDrop();
    }
    if (this.screeenMode===this.regChe) {
      this.isLoadingSubject.next(true);
      this.getCategoryListData();
      this.visitorForm.removeControl('blockedEntry');
      this.visitorForm.removeControl('vipEntry');
      this.visitorForm.removeControl('vipStatus');
      this.visitorForm.addControl('category', this.formBuilder.control(null,Validators.required));
      this.visitorForm.get('category').valueChanges.subscribe(catRes => {
        if (catRes?.value === '3' && catRes) {
          this.isAddedOtherCategory = true;
          this.visitorForm.addControl('OtherCategory', this.formBuilder.control(null,Validators.required));
        }else{
          this.isAddedOtherCategory = false;
          this.visitorForm.removeControl('OtherCategory');
        }
      });
       this.isLoadingSubject.next(false)
    }
    
    if (this.data && this.data.isEdit) {
      this.isLoadingSubject.next(true);
      this.visitorForm.removeControl('profile');
      this.visitorForm.addControl('profile', this.formBuilder.control(null));
      this.isEdit = this.data.isEdit;
      this.getVisitorData(this.data.visitorId);
      this.isLoadingSubject.next(false)
    }
    this.getLocationsData();
    this.setupCountryOptions();
    this.setupStateOptions();
  }

  getHostDrop(): any {
    const hostList = this.inviteService.getHostList().subscribe(
      (response) => {
        this.hostlistData = response.value;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    this.unsubscribe.push(hostList);
  }

  getLocationsData(): void {
    const visitorLocationsSubscription$=this.visitorService.countryList.subscribe(
      (response:any) => {
        this.countriesList = response;
      },
      (error) => {
        console.error('Error:', error);
      } 
    );
    this.unsubscribe.push(visitorLocationsSubscription$);
  }

  getVIPStatusData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.visitorService.visitorStatus().subscribe(
        (response) => {
          // Handle successful response
          this.vipStatusList = response.value.map((item: any) => ({          
            name: item.text,
            codeId: item.value,
          }));
          resolve();
        },
        (error) => {
          // Handle error
          console.error('Error:', error);
          reject(error);
        }
      );
    });
  }

  getCategoryListData() {
    this.visitorService.GetVisitorCategory().subscribe(
      (response) => {
        this.categorylistData = response.value;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  async getVisitorData(visitorId: number) {
    this.isLoadingSubject.next(true);
    const visiorDataSusc = this.visitorService.GetVisitorDetailsById(visitorId).subscribe(
      async (response) => {
        if (Object.keys(response.value).length > 0) {
          this.visitorId = response.value.visitorId;
          this.editFileName = response.value.fileName;
          this.editFilePath = response.value.photo;
          await this.getVIPStatusData();
          const vipStatusValue = this.getTypeOfVipValues(response.value.typeOfVIP);
          const payload = {
            visitorid: response.value.visitorId,
            firstName: response.value.firstName,
            lastName: response.value.lastName,
            phone: response.value.phoneNumber.replace(/-/g, '') || '',
            email: response.value.email || '',
            address: response.value.address || '',
            country: this.getCountryName(response.value.country),
            state: this.getStateName(response.value.state),
            city: this.getCityName(response.value.city),
            blockedEntry: response.value.isBlocked === true ? true : false,
            vipEntry: response.value.isVIP === true ? true : false,
            vipStatus: vipStatusValue
          };
          this.isVIPStatus = response.value.isVIP === true ? true : false;
          this.visitorForm.patchValue({
            ...payload,
          });
        }
        this.isLoadingSubject.next(false)
      },
      (error) => {
        this.isLoadingSubject.next(false)
        // Handle error 
        console.error('Error:', error);
      }
    );
    this.unsubscribe.push(visiorDataSusc);
  }

  getTypeOfVipValues(codeId:number){
    const item = this.vipStatusList.find(item => item.codeId == codeId);
    return item ? item : null;
  }

  getCountryName(countryId: number): string {
    const country = this.countriesList.find((c:any) => c.id === countryId);
    return country ? country : '';
  }

  getStateName(stateId: number): string {
    const state = this.countriesList.reduce((acc:any, cur:any) => [...acc, ...cur.states], []).find(s => s.id === stateId);
    return state ? state : '';
  }

  getCityName(cityId: number): string {
    const city = this.countriesList.reduce((acc:any, cur:any) => [...acc, ...cur.states], []).reduce((acc, cur) => [...acc, ...cur.cities], []).find(c => c.id === cityId);
    return city ? city : '';
  }


  handleVIPStatusChange(isVip?:boolean) {
    const vipStatusControl = this.visitorForm.get('vipStatus');
    if (isVip === false && vipStatusControl) {
      vipStatusControl.setValidators([Validators.required]);
    } else if (vipStatusControl) {
      vipStatusControl.clearValidators();
    }
    if (vipStatusControl) {
      vipStatusControl.updateValueAndValidity();
    }

    const status = this.visitorForm.controls['vipEntry'].value;

    if (status) {
      this.getVIPStatusData();
    }

    this.isVIPStatus = status;
  }

  private setupCountryOptions(): void {
    this.visitorForm.get('country')?.valueChanges.subscribe((val) => {
      this.stateList = [];

      this.visitorForm.patchValue({
        state: null,
        city: null,
      });

      const targetCountry = this.countriesList.find((country: any) => country.name === val.name);

      if (targetCountry && targetCountry.states && targetCountry.states.length > 0) {
        this.stateList = targetCountry.states;
      }
    });
  }
  private setupStateOptions(): void {
    this.visitorForm.get('state')?.valueChanges.subscribe((val) => {
      this.citiesList = [];

      this.visitorForm.patchValue({
        city: null,
      });

      // Add a null check for val
      if (val && val.name) {
        const selectedCountry = this.countriesList.find((country: any) => {
          return country.states.some((state: any) => state.name === val.name);
        });

        if (selectedCountry) {
          const selectedStateObj = selectedCountry.states.find((state: any) => state.name === val.name);

          if (selectedStateObj && selectedStateObj.cities) {
            this.citiesList = selectedStateObj.cities;
          }
        }
      }
    });
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files.length === 0) {
        return;
    }
    this.selectedFile = event.target.files[0];
    this.selectedFileName = event.target.files[0].name;

    this.uploadFile(); 
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('flag', 'visitor')
    console.log(formData,this.selectedFile);
    
    const imageUpload = this.VisitorCheckInCheckOutService.imageUpload(formData).subscribe(
      (fileUploadResponse: any) => {
        console.log(fileUploadResponse);
        this.fileName = fileUploadResponse.value.fileName;
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
    this.unsubscribe.push(imageUpload);
    this.visitorForm.patchValue({ profile: this.selectedFile });
  }

  get file() {
    return this.visitorForm.get('profile');
  }

  isControlInvalidFetchVis(controlName: string): boolean {
    return isControlInvalid(this.fetchvisitorForm.get(controlName)!);
  }

  isControlInvalidWrapper(controlName: string): boolean {
    return isControlInvalid(this.visitorForm.get(controlName)!);
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  fetchVisitor() {
    const { mobileNum } = this.fetchvisitorForm.value;
    this.visitorService.GetVisitorDetailsByPhoneNumber(mobileNum).subscribe((res)=>{
      if (res.response.returnNumber===404 || res.response.returnNumber===401 ) {
        this.visitorForm.reset();
        this.errorMsg=res.response.errorMessage;
        this.toastr.error(this.errorMsg, 'Error', {timeOut: 3000});
      }else if(res.response.returnNumber===200){
        this.errorMsg='';
        const visitorId = res.value.visitorId;
        this.toastr.success('Fetched Data Successfully!', 'Success', {timeOut: 3000});
        this.getVisitorData(visitorId);
        this.newVisitorId=res.value.visitorId
      }
    })
  }

  onMobileNumChange() {
    const mobileNumControl = this.fetchvisitorForm.get('mobileNum');
    if (mobileNumControl.errors && (mobileNumControl.errors['required'] || mobileNumControl.errors['pattern'])) {
      this.visitorForm.reset();
    }
  }

  submitOrContinue(isNext: boolean): void {
    this.isLoadingSubject.next(true);
    if (!this.visitorForm.valid) {
      return;
    }
    this.errorMessage = '';
    const formControls = this.visitorForm.controls;

    const visitorPayload:any = {
      visitorId: (this.data && this.data.isEdit) ? this.visitorId : 0,
      firstName: formControls['firstName'].value,
      lastName: formControls['lastName'].value,
      phoneNumber: formControls['phone'].value,
      email: formControls['email'].value,
      address: formControls['address'].value,
      country: formControls['country'].value.id,
      state: formControls['state'].value.id,
      city: formControls['city'].value.id,
      fileName:this.fileName,
      whomToMeet:formControls['host']?.value?formControls['host']?.value.id:null,
      reason:formControls['reason']?.value?formControls['reason']?.value:null,
      category:formControls['category']?.value?formControls['category']?.value.value:0,
      OtherCategory:formControls['OtherCategory']?.value?formControls['OtherCategory']?.value:'',
      isBlocked: formControls['blockedEntry']?.value?formControls['blockedEntry'].value:false,
      isVIP: formControls['vipEntry']?.value?formControls['vipEntry'].value:false,
      typeOfVIP: this.isVIPStatus ? formControls['vipStatus'].value.codeId : 0,
    };

    if (isNext) {
      const isNext = this.screeenMode === this.preReg;
      console.log('isnext',isNext);
      
      const payload = {
        isNext,
        WhomMeet:formControls['host']?.value,
        newVisitorId:this.newVisitorId,
        ...visitorPayload
      };
      this.onNext.emit(payload);
      return;
    }

    visitorPayload.fileName=this.fileName?this.fileName:this.editFileName;
    visitorPayload.reason = '';
    visitorPayload.whomToMeet=0;
    visitorPayload.inviteId=0;

    console.log('visitorPayload',visitorPayload);
    
    const visiorDataSave = this.visitorService.saveVisitorDetail(visitorPayload).subscribe(
      (visitorResp: any) => {
        if (visitorResp.returnNumber===200) {
          // Handle successful response
          this.toastr.success(`visitor Added Successfully!`, 'Success', {timeOut: 3000});
          this.onClick.emit(true);
          this.closeModal();
        }else{
          this.errorMessage = visitorResp.response.errorMessage;
          this.toastr.error(this.errorMessage, 'Error', {timeOut: 3000});
        }
        this.isLoadingSubject.next(false)
      },
      (error) => {
        // Handle error
        this.isLoadingSubject.next(false)
        this.toastr.error(`Error While add visitor data!`, 'Error', {timeOut: 3000});
        console.error('Error:', error);
      }
      );
    this.unsubscribe.push(visiorDataSave);
    console.log('FormValues', visitorPayload);

    this.selectedFile = null
    this.touched = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}