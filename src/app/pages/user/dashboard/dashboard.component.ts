import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { VisitorService } from '../../admin/services/visitors/visitor.service';
import { ReusabledesignModule } from '../../re-usable-design/reusabledesign.module';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { checkInMessages } from '../../../helpers/_constants';


@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports:[ReusabledesignModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  unPlannedList:any[]=[];
  private authLocalStorageToken = `${environment.appVersion}-${environment.userDataKey}`;
  userInfo:any;
  inviteId: number;
  notificationMsg:string=''
  checkIsRequestAccepted:boolean;


  ngOnInit(): void {
    this.userInfo=localStorage.getItem(this.authLocalStorageToken);
    this.userInfo = JSON.parse(this.userInfo)
    console.log('userinfo',this.userInfo);
    
    localStorage.removeItem('newVisitor');
    this.GetUnplannedVistListUserSide();
  }

  constructor(private router: Router,private visiterService:VisitorService,private modalService: NgbModal,private toastr: ToastrService){}
  checkInClick(){
    this.router.navigate(['/user/qrscan']);
  }
  checkOutClick(){
    this.router.navigate(['/user/checkout']);
  }
  navigateBtn(isPre:boolean){
    isPre?this.router.navigateByUrl('/user/pre-registration'):this.router.navigateByUrl('/user/regster-checkIn');
  }
  openCheckNotificationModal(checkNofitication: any,isRequestAccepted:boolean,inviteId:number) {
    this.inviteId=inviteId;
    this.checkIsRequestAccepted = isRequestAccepted;
    this.notificationMsg=(isRequestAccepted)?checkInMessages.accepted:checkInMessages.denied;
    this.modalService.open(checkNofitication, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
  }
    

  closeModal() {
    this.modalService.dismissAll();
  }

  sendInviteId() {
    this.visiterService.UpdatedNotificationStatusOfUser(this.inviteId).subscribe((res)=>{
      if (res.returnNumber==200) {
        this.toastr.success(`Update Notification Successfully!`, 'Success', {timeOut: 3000});
        if (this.checkIsRequestAccepted) {
          this.router.navigateByUrl('/user/qrscan');
        }
        this.closeModal();
      }else{
        this.toastr.error(`Error while update notification`, 'Error', {timeOut: 3000});
      }
    })
  }

  GetUnplannedVistListUserSide(){
    this.visiterService.GetUnplannedVistListUserSide().subscribe((res)=>{
      if (res.value?.length>0) {
        this.unPlannedList = res.value.map(item => ({ firstName: item.firstName, lastName: item.lastName,inviteId: item.inviteId,isUnplannedAccepted:item.isUnplannedAccepted }));
        console.log('unPlanned',this.unPlannedList);
      }
    })
  }
}
