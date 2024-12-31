import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReusabledesignModule } from '../../../../re-usable-design/reusabledesign.module';
import { CommonModule } from '@angular/common';
import { VisitorCheckInCheckOutService } from '../../../services/visitor-check-in-check-out.service';
import { switchMap } from 'rxjs';
import { InviteService } from '../../../../admin/services/invites/invite.service';
import { VisitorService } from '../../../../admin/services/visitors/visitor.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { checkInMessages } from '../../../../../helpers/_constants';

@Component({
  selector: 'app-check-in2',
  standalone:true,
  imports:[ReusabledesignModule,CommonModule],
  templateUrl: './check-in2.component.html',
  styleUrls: ['./check-in2.component.scss']
})
export class CheckIn2Component implements OnInit{
  checkIfNavigate:boolean;
  receivedData:any;
  selectedFile: File | null = null;
  touched: boolean = false;
  errorText:string='';
  alreadyExist:string='';
  unPlannedList:any[]=[];
  selectedImage: any;
  notificationMsg:string=''
  inviteId: number;
  checkIsRequestAccepted:boolean;

  constructor(private router: Router,
    private modalService: NgbModal,
    private inviteService:InviteService,
    private visiterService:VisitorService,
    private VisitorCheckInCheckOutService:VisitorCheckInCheckOutService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.receivedData = JSON.parse(localStorage.getItem('newVisitor'));
    this.GetUnplannedVistListUserSide();
    console.log('received Data',this.receivedData);
  }

  onFileChange(event: any): void {
    const fileList: FileList | null = event.target.files;
    if (!fileList || fileList.length === 0) {
      return;
    }

    const selectedFile: File = fileList[0];
    const allowedFileTypes = ['.jpg', '.jpeg', '.png'];
    const fileName: string = selectedFile.name.toLowerCase();
    const isValidFileType: boolean = allowedFileTypes.some(type => fileName.endsWith(type));
    this.selectedFile = selectedFile;
    if (!isValidFileType) {
      this.errorText='*Please choose a PNG or JPG or JPEG file.';
      this.selectedFile=null;
      return;
    }

    this.errorText='';
    this.selectedFile = selectedFile;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImage = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  createNewVisitor(){
    if (!this.selectedFile) {
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('flag', 'visitor')
    const { isNext,ImageDocs,isVIP,WhomMeet,typeOfVIP, ...modifiedData } = this.receivedData;
    console.log('after modifiedData',modifiedData);
    this.VisitorCheckInCheckOutService.imageUpload(formData).pipe(
      switchMap((fileUploadResponse: any) => {
        const formPayload = {
          ...modifiedData,
          photo:fileUploadResponse.value.filePath,
          fileName:fileUploadResponse.value.fileName,
          isVip:this.receivedData.isVIP,
          typeOfVip:this.receivedData.typeOfVIP,
          whomToMeet:WhomMeet.value
        }
        return this.inviteService.AddVisitorDetailsByGetKeeper(formPayload);
      })
    ).subscribe(response => {
      if(response.returnNumber===200){
        this.selectedFile=null;
        this.toastr.success(`visitor Added Successfully!`, 'Success', {timeOut: 3000});
      }else {
        this.alreadyExist=response.errorMessage
        this.toastr.error(this.alreadyExist, 'Error', {timeOut: 3000});
      }
    });
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
        this.unPlannedList = res.value.map(item => ({ firstName: item.firstName, lastName: item.lastName,visitorId:item.visitorId,inviteId: item.inviteId,isUnplannedAccepted:item.isUnplannedAccepted }));
        console.log('unPlanned',this.unPlannedList);
      }
    })
  }

  checkInClick(){
    this.router.navigateByUrl('/user/qrscan');
  }

  onBackClickEmit(isNavigate: boolean){
    this.checkIfNavigate=isNavigate;
    (isNavigate)?this.router.navigateByUrl('/user/pre-registration'):this.router.navigateByUrl('/user/regster-checkIn');
  }
}
