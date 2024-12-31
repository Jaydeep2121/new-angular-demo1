import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { COUNTRIES, PHONE_REGEX } from '../../../../helpers/_constants';
import { isControlInvalid, fileTypeValidator, dateTimeValidator } from '../../../../helpers/_validators';
import { SharedModule } from '../../../../modules/auth/helper/shared.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgSelectModule } from '@ng-select/ng-select';
import { Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { InviteService } from '../../services/invites/invite.service';
import { visitorResponse } from '../../services/visitors/visitor.model';
import { DatetimepickerModule } from '../../../../material-module/date-time-picker/datetimepicker.module';
import { MaterialfieldsModule } from '../../../../material-module/material-fields/materialfields.module';
import { VisitorService } from '../../services/visitors/visitor.service';

@Component({
  selector: 'app-add-user-info',
  standalone:true,
  imports:[SharedModule,
    NgbModalModule,
    InlineSVGModule,
    DatetimepickerModule,
    MaterialfieldsModule,
    NgSelectModule,],
  templateUrl: './add-user-info.component.html',
  styleUrls: ['./add-user-info.component.scss']
})
export class AddUserInfoComponent implements OnInit {
  @Input() data: any;
  @Input() countriesList: any;
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
  roleList: any = ["admin", "user"];
  activeList: any = ["yes", "no"];

  visitorForm: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    middleName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(PHONE_REGEX)]],
    address: ['', Validators.required],
    city: [null, Validators.required],
    state: [null, Validators.required],
    country: [null, Validators.required],
    roleType: [null, Validators.required],
    activeType: [null, Validators.required]
  });

  
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private visitorService: VisitorService,
  ) { }

  removeSelectedFile() {
    this.selectedFile = null;
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

    if (this.data && this.data.isEdit) {

      this.isEdit = this.data.isEdit;
      const payload = {
        firstName: this.data.firstname || '',
        lastName: this.data.lastname|| '',
        middleName:this.data.middlename || '',
        phone: this.data.mobileNo.replace(/-/g, '') || '',
        address:this.data.address || '' ,
        roleType: this.data.role || '',
        activeType:this.data.active || ''

      };    
      
      this.visitorForm.patchValue({
        state: {name: this.data.state},
        city: this.data.city,
        ...payload,
      });
    }

    this.setupCountryOptions();
    this.setupStateOptions();
  }

  getVIPStatusData() {
    this.visitorService.visitorStatus().subscribe(
      (response) => {
        // Handle successful response
        this.vipStatusList = response.value.map((item: any) => ({
          name: item.codeDesc,
          codeId: item.codeId,
        }));
      },
      (error) => {
        // Handle error
        console.error('Error:', error);
      }
    );
  }

  getVisitorData(visitorId: number) {
    const visiorDataSusc = this.visitorService.GetVisitorDetailsById(visitorId).subscribe(
      (response) => {
        if (Object.keys(response.value).length > 0) {
          this.visitorId = response.value.visitorId;
          const payload = {
            visitorid: response.value.visitorId,
            firstName: response.value.firstName,
            lastName: response.value.lastName,
            phone: response.value.phoneNumber.replace(/-/g, '') || '',
            email: response.value.email || '',
            address: response.value.address || '',
            country: response.value.country,
            state: response.value.state,
            city: response.value.city,
          };
          console.log("api respones", response.value.visitorId);

          this.isVIPStatus = response.value.isVIP === true ? true : false;
          this.visitorForm.patchValue({
            ...payload,
          });
        }
      },
      (error) => {
        // Handle error 
        console.error('Error:', error);
      }
    );
    this.unsubscribe.push(visiorDataSusc);
  }

  handleVIPStatusChange() {
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
    this.selectedFile = event.target.files[0];
    this.selectedFileName = event.target.files[0].name;
    this.uploadFile();
    this.visitorForm.patchValue({ profile: this.selectedFile });
  }

  get file() {
    return this.visitorForm.get('profile');
  }


  isControlInvalidWrapper(controlName: string): boolean {
    return isControlInvalid(this.visitorForm.get(controlName)!);
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  submitForm(): void {
    if (!this.visitorForm.valid) {
      return;
    }

    const formControls = this.visitorForm.controls;

    const visitorPayload = {
      visitorId: (this.data && this.data.isEdit) ? this.visitorId : 0,
      firstName: formControls['firstName'].value,
      lastName: formControls['lastName'].value,
      phoneNumber: formControls['phone'].value,
      email: formControls['email'].value,
      address: formControls['address'].value,
      country: formControls['country'].value.id,
      state: formControls['state'].value.id,
      city: formControls['city'].value.id,
      ImageDocs: formControls['profile'].value,
    };
    const visiorDataSave = this.visitorService.saveVisitorDetail(visitorPayload).subscribe(
      (response: visitorResponse) => {
        // Handle successful response
        this.closeModal();
        this.onClick.emit(true);
      },
      (error) => {
        // Handle error
        console.error('Error:', error);
      }
    );
    this.unsubscribe.push(visiorDataSave);
    console.log('FormValues', visitorPayload);

    this.selectedFile = null
    this.touched = false;
    this.visitorForm.reset();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
