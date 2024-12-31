import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddVisitorComponent } from '../../../../admin/visitor/components/add-visitor/add-visitor.component';
import { ReusabledesignModule } from '../../../../re-usable-design/reusabledesign.module';
import { InviteService } from '../../../../admin/services/invites/invite.service';
import { CommonModule } from '@angular/common';
import { VisitorService } from '../../../../admin/services/visitors/visitor.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { checkInMessages } from '../../../../../helpers/_constants';


@Component({
  selector: 'app-check-in1',
  standalone:true,
  imports:[AddVisitorComponent,ReusabledesignModule,CommonModule],
  templateUrl: './check-in1.component.html',
  styleUrls: ['./check-in1.component.scss']
})
export class CheckIn1Component implements OnInit{
  unPlannedList:any[]=[];
  inviteId: number;
  notificationMsg:string=''
  checkIsRequestAccepted:boolean;

  constructor(private visiterService:VisitorService,private router: Router,private inviteSer:InviteService,private toastr: ToastrService,private modalService: NgbModal) { }

  ngOnInit(): void {
    localStorage.removeItem('newVisitor');
    this.GetUnplannedVistListUserSide();
  }
  
  onNextEmit(event: any) {
    if (event.isNext) {
      const visiorData = {
        visitorId: event.newVisitorId,
        reason: event.reason,
        whomToMeet: event.WhomMeet.id
      }
      this.inviteSer.AddVisitOfPreRegisteredVisitorByGetKeeper(visiorData).subscribe((res)=>{
        if (res.returnNumber==200) {
          console.log('AddVisitOfPreRegisteredVisitorByGetKeeper');
        }
      })
    }
    localStorage.setItem('newVisitor',JSON.stringify(event));
    localStorage.setItem('isNextButton',(event.isNext)?'Next':'reg&check');
    this.router.navigateByUrl('/user/checkin2');
  }

  onBackClickEmit(event: any){
    this.router.navigateByUrl('/user/dashboard');
  }

  openCheckNotificationModal(checkNofitication: any,isRequestAccepted:boolean,inviteId:number) {
    this.inviteId=inviteId;
    this.checkIsRequestAccepted = isRequestAccepted;
    this.notificationMsg=(isRequestAccepted)?checkInMessages.accepted:checkInMessages.denied;;
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
