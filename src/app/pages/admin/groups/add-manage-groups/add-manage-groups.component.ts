import { Component, EventEmitter, Output,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GroupsService } from '../../services/groups/groups.service';
import { Visitor, visitorResponse } from '../../services/visitors/visitor.model';

import { isControlInvalid } from '../../../../helpers/_validators';
import { SharedModule } from '../../../../modules/auth/helper/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { VisitorService } from '../../services/visitors/visitor.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-manage-groups',
  standalone:true,
  imports:[
    SharedModule,
    NgbModalModule,
    NgSelectModule,],
  templateUrl: './add-manage-groups.component.html',
  styleUrls: ['./add-manage-groups.component.scss'],
})
export class AddManageGroupsComponent implements OnInit{
  newlist:any
  @Output() onClick: EventEmitter<boolean> = new EventEmitter();
  groupsSubscription$:Subscription;
  dataSource: Visitor[] = [];
  visiterList :any
  isstatus :boolean = false;
  unsubscribe: Subscription[] = [];
  successText: string='';
  errorMessage: string='';
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

 

  GroupaForm: FormGroup = this.formBuilder.group({
    section:['', Validators.required],
    visitor:[null, Validators.required]

  });
  
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private groupsService: GroupsService,
    private visitorService:VisitorService,
    private toastr: ToastrService,

  ) {this.isLoadingSubject = new BehaviorSubject<boolean>(false);  this.isLoading$ = this.isLoadingSubject.asObservable();}

  ngOnInit(): void {
    console.log("test");
    
    this.getVisitorData()
  }

  getVisitorData(): any {
    this.groupsSubscription$ = this.visitorService.getVisitorDetails().subscribe(
      (response:visitorResponse) => {
        console.log(response,"groups");
        
        if (response.value.length > 0) {
          this.newlist = response.value.map(item => {
            return {
              value:item.visitorId,
              text: `${item.firstName} ${item.lastName}`,
            };
          });
          // this.dataSource = response.data;
          this.visiterList = response.value.map(item => {
            return {
              ...item,
              fullName: `${item.firstName} ${item.lastName}`
            };
          });
        }
        (error:any) => {
          // Handle error
          console.error('Error:', error);
          // this.showLoading = false;
        } 
      }
      );
    }
    
    compareFn(item1: any, item2: any): boolean {
      return item1 && item2 ? item1.value === item2.value : item1 === item2;
    }
    selectAll(controlName: string): void {
      const items = this.getSelectedAllValue(controlName);    
      this.GroupaForm.get(controlName)?.setValue(items);
  }
  unselectAll(controlName:string) {
    this.GroupaForm.get(controlName)?.setValue([]);
  }

  getSelectedAllValue(control:string){
    switch (control) {
      case 'visitor':
        return this.newlist;
      default:
        break;
    }
  }
  
  isControlInvalidWrapper(controlName: string): boolean {
    return isControlInvalid(this.GroupaForm.get(controlName)!);
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  submit(): void {
    this.isLoadingSubject.next(true);
    if (!this.GroupaForm.valid) {
      return;
    }
    this.errorMessage = '';
    const formControls = this.GroupaForm.controls;
    const visitorIdValues = formControls['visitor'].value;
    const groupPayload: any = {
      groupName:formControls['section'].value,
      visitorId: visitorIdValues,
    };    
    const invitorDataSave = this.groupsService.CreateGroup(groupPayload).subscribe(
      (res) => {
        this.isstatus = !(res.returnNumber == 200);
        if (res.returnNumber == 200) {
          this.toastr.success(`Group Added Successfully!`, 'Success', {timeOut: 3000});
          // this.successText='Group Created Successfully!'
          this.onClick.emit(true);
          this.closeModal();
        } else {
          this.errorMessage = res?.errorMessage;
          this.toastr.error(this.errorMessage, 'Error', {timeOut: 3000})
          return;
        }
        this.isLoadingSubject.next(false)
      },
      (error) => {
        this.isLoadingSubject.next(false)
        this.toastr.error(`Error While add Group data!`, 'Error', {timeOut: 3000});
        console.error('Error:', error);
      }
    );
    this.unsubscribe.push(invitorDataSave);
    
    console.log('FormValues', groupPayload);
    this.GroupaForm.reset();
  }
}
