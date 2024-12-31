import {  Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { dateTimeValidator,isControlInvalid } from '../../../../helpers/_validators';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { visitorResponse } from '../../services/visitors/visitor.model';
import { SharedModule } from '../../../../modules/auth/helper/shared.module';
import { DatetimepickerModule } from '../../../../material-module/date-time-picker/datetimepicker.module';
import { MaterialfieldsModule } from '../../../../material-module/material-fields/materialfields.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgSelectModule } from '@ng-select/ng-select';
import { Groups, GroupsResponse } from '../../services/groups/groups.model';
import { GroupsService } from '../../services/groups/groups.service';
import { MultipleInvitesService } from '../../services/multiple-invites/multiple-invites.service';
import { VisitorService } from '../../services/visitors/visitor.service';
import { MultipleRes } from '../../services/multiple-invites/multiple-invites.module';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-multiple-invites',
  standalone:true,
  imports:[
    SharedModule,
    DatetimepickerModule,
    MaterialfieldsModule,
    NgbModalModule,
    InlineSVGModule,
    NgSelectModule,
  ],
  templateUrl: './add-multiple-invites.component.html',
  styleUrls: ['./add-multiple-invites.component.scss']
})
export class AddMultipleInvitesComponent {
  @Input() hostlistData: any[] = [];
  @Input() subTypeList: any[] = [];
  @Output() onClick: EventEmitter<boolean> = new EventEmitter();
  groupList: any[] = []
  dataSource: Groups[] = []
  unsubscribe: Subscription[] = [];
  visiterList:any[]=[]
  filteredVisiterList:any[]=[]
  visitorSubscription$:Subscription;
  visitorId:number
  isstatus: boolean =  false
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  addMultipleInviteForm: FormGroup = this.formBuilder.group({
    visitor: [null, Validators.required],
    group: [null, Validators.required],
    location: ['', Validators.required],
    host: [null, Validators.required],
    checkInDateTime: ['', Validators.required],
    checkOutDateTime: ['', Validators.required],
    inviteDateTime: ['', Validators.required],
    comment: ['', Validators.required],
    purpose: ['', Validators.required],
    premises: ['', Validators.required],
    subType: [null, Validators.required],
  }, {
    validator: dateTimeValidator('checkInDateTime', 'checkOutDateTime')
  });

  minDate: Date=new Date();
  successMessage: string = null;
  errorMessage: string = null;
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal, private groupService: GroupsService,private MultipleService:MultipleInvitesService ,   private visitorService:VisitorService, private toastr: ToastrService,) {this.isLoadingSubject = new BehaviorSubject<boolean>(false);  this.isLoading$ = this.isLoadingSubject.asObservable(); }

  ngOnInit(): void {
    this.GetMultipleInvitesDrop()
    this.getVisitorData()
  }
  ngOnDestroy(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  isControlInvalidWrapper(controlName: string): boolean {
    return isControlInvalid(this.addMultipleInviteForm.get(controlName)!);
  }

  GetMultipleInvitesDrop(): any {
    const invitorsSubscription = this.groupService.GetGroupList().subscribe(
      (response: GroupsResponse) => {
        if (response) {

          this.groupList = response.value;
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    this.unsubscribe.push(invitorsSubscription);
  }

  onGroupSelect(event: any): void {
    console.log('event', event);
    
    const selectedGroupId = event.value; 

    this.MultipleService.GetGroupInviteListByGroupId(selectedGroupId).subscribe(
      (response: MultipleRes) => {
        if (response.value) {
          // this.visitorId = response.value[0].visitorId;
          console.log('response.value?.visitorId', response.value?.visitorId, this.visiterList);
          
          const filteredData = this.visiterList.filter((x) => response.value?.visitorId?.includes(String(x.visitorId)))
          filteredData.map((x) => {
            return {
              fullName: x.fullName,
              id: x.visitorId
            }
          })
          
          console.log('filteredData',filteredData);
          this.filteredVisiterList = filteredData
          this.addMultipleInviteForm.get('visitor')?.setValue(filteredData)
        }
      },
      (error:any) => {
        console.error('Error fetching visitors:', error);
      }
    );
  }

  getVisitorData(): any {
    this.visitorSubscription$ = this.visitorService.getVisitorDetails().subscribe(
      (response:visitorResponse) => {
        
        if(response.value.length > 0) { 
          this.visiterList = response.value.map(item => {
            return {
              ...item,
              fullName: `${item.firstName} ${item.lastName}`
            };
          });
          this.filteredVisiterList = this.visiterList
        }
      },
      (error) => {
        console.error('Error:', error);
      } 
    );
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  selectAll(controlName: string): void {
    const items = this.getSelectedAllValue(controlName);
    this.addMultipleInviteForm.get(controlName)?.setValue(items);

  }
  compareFn(item1: any, item2: any): boolean {
    return item1 && item2 ? item1.value === item2.value : item1 === item2;
  }

  getSelectedAllValue(control: string): any {
    switch (control) {
      case 'visitor':
        return this.filteredVisiterList;
      case 'groups':
        return this.groupList;
      default:
        return [];
    }
  }

  unselectAll(controlName: string) {
    this.addMultipleInviteForm.get(controlName)?.setValue([]);
  }

  submit() {
    this.isLoadingSubject.next(true);
    if (!this.addMultipleInviteForm.valid) {
      return;
    }

    const { group, visitor, host, subType, location, checkInDateTime, checkOutDateTime, inviteDateTime, premises, comment, purpose } = this.addMultipleInviteForm.value;
    
    let payload = {
      groupId: group ? group.value : null,
      visitorId: visitor.length > 0 ? visitor.map((x) => x.visitorId) : null,
      location,
      host: host ? host.value : null,
      expectedCheckinTime: checkInDateTime,
      expectedCheckoutTime: checkOutDateTime,
      inviteDate: inviteDateTime,
      premises,
      comment,
      purpose,
      subType: subType ? subType.value : null,
      inviteId: 0
    }
    this.successMessage = '';
    this.errorMessage = '';
    const invitorDataSave = this.groupService.AddGroupInviteDetail(payload).subscribe(
      (res: any) => {
        this.isstatus = !(res.returnNumber == 200);
        if (res?.returnNumber == 200) {
          this.successMessage = 'Invited Successfully!'
          this.toastr.success(`Multiple-Invited Added Successfully!`, 'Success', {timeOut: 3000});
          this.onClick.emit(true);
          this.closeModal();
          this.addMultipleInviteForm.reset();
        } else {
          this.errorMessage = res?.errorMessage
          this.toastr.error(this.errorMessage, 'Error', {timeOut: 3000})
          return;
        }
        this.isLoadingSubject.next(false)
      },
      (error) => {
        this.isLoadingSubject.next(false)
        this.toastr.error(`Error While add Multiple-Invited data!`, 'Error', {timeOut: 3000});
        console.error('Error:', error);
      }
    );
    this.unsubscribe.push(invitorDataSave);
  }
}
