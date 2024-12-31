import {  Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { PHONE_REGEX } from '../../../../helpers/_constants';
import { dateTimeValidator,isControlInvalid } from '../../../../helpers/_validators';
import { InviteService } from '../../services/invites/invite.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { visitorResponse } from '../../services/visitors/visitor.model';
import { Data } from '@angular/router';
import { SharedModule } from '../../../../modules/auth/helper/shared.module';
import { DatetimepickerModule } from '../../../../material-module/date-time-picker/datetimepicker.module';
import { MaterialfieldsModule } from '../../../../material-module/material-fields/materialfields.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgSelectModule } from '@ng-select/ng-select';
import { VisitorService } from '../../services/visitors/visitor.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-invites',
  standalone:true,
  imports:[
    SharedModule,
    DatetimepickerModule,
    MaterialfieldsModule,
    NgbModalModule,
    InlineSVGModule,
    NgSelectModule,
  ],
  templateUrl: './add-invites.component.html',
  styleUrls: ['./add-invites.component.scss']
})
export class AddInvitesComponent {
  @Input() countriesList: any;
  @Output() onClick: EventEmitter<boolean> = new EventEmitter();
  @Input() data: any;
  @Input() userInvites: boolean = false;
  @Input() hostlist: any[]=[];
  dataSource: Data[] = [];
  isEdit: boolean;
  isstatus :boolean = false;
  unsubscribe: Subscription[] = [];
  visiterList: any;
  selectedFile: File | null = null;
  touched: boolean = false;
  stateList: any = [];
  citiesList: any = [];
  minDate: Date = new Date();
  visitertypedata:any[]=[]
  subtypedata:any[]=[]
  isParent:boolean =false
  countryList: any[] = [];
  successText: string='';
  errorMessage: string='';
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  InvitesForm: FormGroup = this.formBuilder.group({
    name: [null, Validators.required],
    visitor: [null, Validators.required],
    address: ['', Validators.required],
    country: [null, Validators.required],
    city: [null, Validators.required],
    state: [null, Validators.required],
    Phone: ['', [Validators.required, Validators.pattern(PHONE_REGEX)]],
    host: [null, Validators.required],
    location: ['', Validators.required],
    purpose: ['', Validators.required],
    premises:['',Validators.required],
    expectedCheckInDateTime: ['', Validators.required],
    expectedCheckOutDateTime: ['', Validators.required],
    inviteDateTime:['', Validators.required],
    visitertype:[null,Validators.required],
    subtypedata: [null],
    remarks: ['', Validators.required]
  }, {
    validator: dateTimeValidator('expectedCheckInDateTime', 'expectedCheckOutDateTime')
  });
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private inviteService: InviteService,
    private visitorService: VisitorService,
    private toastr: ToastrService,
  ) {  this.isLoadingSubject = new BehaviorSubject<boolean>(false);  this.isLoading$ = this.isLoadingSubject.asObservable();}

  ngOnInit(): void {
    console.log(this.hostlist,"hostlist");
    
    this.visitorService.countryList.subscribe((res) => {
      this.countryList = res;
    })
    if (!this.userInvites) {
      this.InvitesForm.addControl('profile', this.formBuilder.control(null));
    }

    if (this.data && this.data.isEdit) {
      this.InvitesForm.get('visitor')?.disable();
      this.isEdit = this.data.isEdit;
      this.getInvitesData(this.data.inviteId);

    }
    this.getVisitorData()
    this.getvisitertype();
    this.setupCountryOptions();
    this.setupStateOptions();
    this.disableFieldsForEdit();
  }

  private disableFieldsForEdit(): void {
    // If it's an Edit operation, disable the fields
    this.InvitesForm.get('name')?.disable();
    this.InvitesForm.get('address')?.disable();
    this.InvitesForm.get('country')?.disable();
    this.InvitesForm.get('state')?.disable();
    this.InvitesForm.get('city')?.disable();
    this.InvitesForm.get('Phone')?.disable();
  }

  getVisitorData(): any {
    const invitorsSubscription = this.inviteService.GetVisitorsListForInvite().subscribe(
      (response: visitorResponse) => {

        // Handle successful response
        if (response.value.length > 0) {
          // this.dataSource = response.data;
          this.visiterList = response.value.map(item => {
            return {
              visitorId:item.visitorId,
              fullName: `${item.name}`
            };
          });
        }
      },
      (error: any) => {
        // Handle error
        console.error('Error:', error);
        // this.showLoading = false;
      }
    );
    this.unsubscribe.push(invitorsSubscription);
  }
  onVisitorChange(VisitorId:any) {
    this.isLoadingSubject.next(true);
    if (!VisitorId)
    {
      return
    }
       this.inviteService.GetVisitorDetailsById(VisitorId).subscribe(
        (visitorDetailsResponse: visitorResponse) => {
          const visitorDetails:any = visitorDetailsResponse?.value;
          console.log(visitorDetails,"details");
          
          if (Object.keys(visitorDetails).length > 0) {
            const formControls = this.InvitesForm.controls;

            const country = this.countryList.find((x) => x.id == visitorDetails.country)
            const state = country?.states.find(state => state.id === visitorDetails.state);
            const city = state?.cities.find(city => city.id === visitorDetails.city);
            
            console.log('country', country);

            // Update form controls with visitor details
            this.InvitesForm.patchValue({
              name:`${visitorDetails.firstName} ${visitorDetails.lastName}`,
              address: visitorDetails.address,
              country,
              state,
              city,
              Phone: visitorDetails.phoneNumber,
            });
          }
          this.isLoadingSubject.next(false)
        },
        (error) => {
          this.isLoadingSubject.next(false)
          console.error('Error fetching visitor details:', error);
        }
      );
  }

  getInvitesData(inviteId: number): any {
    this.isLoadingSubject.next(true);
    console.log(inviteId,"inviteid");
    
    const inviteData = this.inviteService.GetInviteDetailsById(inviteId).subscribe(

      (response: any) => {
        console.log(response.value,"response");
        
        if (Object.keys(response.value).length > 0) {
          console.log('hostList', this.hostlist);
          this.getvisitertypedata(response.value.visitorType)
          const payload = {
            InviteId:response.value.inviteId,
            visitor: response.value.visitorId,
            visitertype:String(response.value.visitorType),
            subtypedata:response.value.subType && String(response.value.subType),
            name: response.value.name,
            address: response.value.address || '',
            country: response.value.country,
            state: response.value.state,
            city: response.value.city,
            Phone: response.value.phone,
            host: String(response.value.host),
            location: response.value.location,
            purpose: response.value.purpose,
            premises:response.value.premesis,
            expectedCheckInDateTime: response.value.expectedCheckinTime,
            expectedCheckOutDateTime: response.value.expectedCheckoutTime,
            inviteDateTime:response.value.inviteDate,
            remarks: response.value.comment

          };  
          console.log('response.value.visitorType.text', response.value.visitorType.text);
          
          this.isParent = response.value.visitorType == 1
          console.log(' this.isParent',  this.isParent);
          
          this.InvitesForm.patchValue({
            ...payload,
          });
          this.isLoadingSubject.next(false)
        }
      },
      (error) => {
        this.isLoadingSubject.next(false)
        console.error('Error:', error);
      }
    );
    this.unsubscribe.push(inviteData);
  }
  handalevisitertype() {
    const status = this.InvitesForm.controls['visitertype'].value;
    console.log(status, "status");
  
    // Check if the selected item's text is 'Parent'
    this.isParent = status == '1';
    this.getvisitertypedata(status);
  
    // Update the subtypedata control based on whether visitertype is 'Parent'
    const subtypedataControl = this.InvitesForm.get('subtypedata');
  
    if (this.isParent) {
      // If it's 'Parent', add Validators.required
      subtypedataControl?.setValidators([Validators.required]);
    } else {
      // If it's not 'Parent', remove Validators.required
      subtypedataControl?.clearValidators();
    }
  
    // Trigger validation update
    subtypedataControl?.updateValueAndValidity();
  }
  
//  conditionalRequiredValidator(isParent: boolean): any {
//     return (control: any) => {
//       return isParent ? Validators.required(control) : null;
//     };
//   }
  

  private getvisitertype ():void {
 const typeData = this.inviteService.GetVisitorType().subscribe(
    (response) => {
      
      this.visitertypedata = response.value;

      console.log(this.visitertypedata,"res");
      
    },
    (error) => {
      console.error('Error:', error);
    }
  );
  this.unsubscribe.push(typeData);
  }

  private getvisitertypedata (id:number):void {
    console.log(id,"id");
    
    const subtypeData = this.inviteService.GetVisitorSubType(id).subscribe(
       (response) => {
         if (response.value) {
         console.log('HELLO FROM RESOINSE VALUE:', );
          this.subtypedata = response.value;
         }
       },
       (error) => {
         console.error('Error:', error);
       }
     );
     this.unsubscribe.push(subtypeData);
     }
  private setupCountryOptions(): void {
    this.InvitesForm.get('country')?.valueChanges.subscribe((val) => {
      this.stateList = [];

      this.InvitesForm.patchValue({
        state: null,
        city: null,
      });

      if(!val) {
        return
      }

      if (val?.states?.length > 0) {
        this.stateList = val.states;
      }
    });
  }

  private setupStateOptions(): void {
    this.InvitesForm.get('state')?.valueChanges.subscribe((val) => {
      this.citiesList = [];

      this.InvitesForm.patchValue({
        city: null,
      });

      if(!val) {
        return
      }

      if (!!val) {
        this.citiesList = val.cities;
      }
    });
  }

  isControlInvalidWrapper(controlName: string): boolean {
    return isControlInvalid(this.InvitesForm.get(controlName)!);
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  submitForm(): void {
    this.isLoadingSubject.next(true);
    if (!this.InvitesForm.valid) {
      return;
    }
    this.errorMessage = '';
  
    const formControls = this.InvitesForm.controls;
    console.log('formValue', this.InvitesForm.value);
    
    let {name, visitor, address, country, city, state, Phone, host, location, purpose, premises, expectedCheckInDateTime, expectedCheckOutDateTime, inviteDateTime, visitertype, subtypedata, remarks} = this.InvitesForm.value;

    const invitorPayload: any = {
      inviteId: this.data.inviteId || 0,
      visitorId:formControls['visitor'].value || null,
      visitorType: visitertype,
      host: host,
      location: location,
      expectedCheckinTime: expectedCheckInDateTime,
      expectedCheckoutTime: expectedCheckOutDateTime,
      inviteDate: inviteDateTime,
      purpose: purpose,
      premises:premises,
      comment: remarks,
    };
  
    // Only include subtypedata if the selected visitorType is 'Parent'
    console.log(this.isParent,"parents");
    console.log( formControls['subtypedata'].value ,"subtype");
    
    if (invitorPayload.visitorType == 1) {
      invitorPayload.subType = subtypedata;
    }
    console.log(invitorPayload,"pallo");
    
    const invitorDataSave = this.inviteService.AddInviteDetail(invitorPayload).subscribe(
      (res) => {
        this.isstatus = !(res.returnNumber == 200);
        if (res?.returnNumber == 200) {
          this.toastr.success(`Invited Added Successfully!`, 'Success', {timeOut: 3000});
          // this.successText='Invited Successfully!'
          this.onClick.emit(true);
          this.closeModal();
        } else {
          this.errorMessage = res?.errorMessage;
          this.toastr.error(this.errorMessage, 'Error', {timeOut: 3000})
          return;
        }
        setTimeout(() => {
          
          this.isLoadingSubject.next(false)
        }, 5000);
      },
      (error) => {
        this.isLoadingSubject.next(false)
        this.toastr.error(`Error While add Invited data!`, 'Error', {timeOut: 3000});
        console.error('Error:', error);
      }
    );
    this.unsubscribe.push(invitorDataSave);
  }
  
  
  
  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
