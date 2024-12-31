import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReusabledesignModule } from '../../../re-usable-design/reusabledesign.module';

import {
  Html5Qrcode,
  Html5QrcodeScanner,
  Html5QrcodeSupportedFormats,
} from 'html5-qrcode';
import { VisitorService } from '../../../admin/services/visitors/visitor.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { visitor } from '../../../admin/services/visitors/visitor.model';
import { __values } from 'tslib';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { checkInMessages } from '../../../../helpers/_constants';

@Component({
  selector: 'app-check-out',
  standalone:true,
  imports:[ReusabledesignModule,CommonModule,FormsModule],
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit, OnDestroy {
  visitor: any = {}
  dataSource:visitor[] = []
  errorMessage: string = ''
  successMessage: string = ''
  inputType: string = 'qr'; // Default to QR input
  inviteCode: string = '';
  qrResult: any = {}
  html5QrcodeScanner: any
  unPlannedList:any[]=[];
  countrydata:any
  inviteId: number;
  notificationMsg:string=''
  checkIsRequestAccepted:boolean;

  constructor(private router: Router, private visitorService: VisitorService,private modalService: NgbModal,private toastr: ToastrService) { 
    // this.getVisitorData = this.getVisitorData.bind(this);
  }
  
  onBackClickEmit(event: any){
    this.router.navigateByUrl('/user/dashboard');
  }

  ngAfterViewInit(): void {
    // this.qrResult.subscribe((val) => {
    // })
  }
  title = 'qr-scanner';
  // lastResult: any = 0
  // countResults: any = 0;
  // html5QrcodeScanner: any;
  ngOnInit(): void {  
    this.GetUnplannedVistListUserSide()

    this.html5QrcodeScanner = new Html5QrcodeScanner(
      'reader2',
      { fps: 10, qrbox: { width: 100, height: 100 } },
      /* verbose= */ false
    );
    this.html5QrcodeScanner.render(this.onScanSuccess.bind(this), this.onScanFailure.bind(this));
  }
  ngOnDestroy(): void {
    if(this.html5QrcodeScanner)
    this.html5QrcodeScanner.clear();
  }
  handleRadioChange(): void {
    this.errorMessage = '';
    this.successMessage = '';
    

  
  }
  // ngOnInit(): void {
  //   // const html5QrCode = new Html5Qrcode(
  //   //   "reader", { verbose: false, formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ] });
  //   // const qrCodeSuccessCallback = (decodedText: any, decodedResult: any) => {
  //   //     /* handle success */
  //   //     console.log(`Code matched = ${decodedText}`, decodedResult);
  //   // };
  //   // const qrCodeErrorCallback = () => {

  //   // }
  //   // const config = { fps: 10, qrbox: { width: 250, height: 250 } };

  //   // // If you want to prefer front camera
  //   // html5QrCode.start({ facingMode: "user" }, config, qrCodeSuccessCallback, qrCodeErrorCallback);
  //   let html5QrcodeScanner = new Html5QrcodeScanner(
  //     'reader',
  //     { fps: 10, qrbox: { width: 100, height: 100 } },
  //     /* verbose= */ false
  //   );
  //   html5QrcodeScanner.render(this.onScanSuccess.bind(this), this.onScanFailure.bind(this));
  //   console.log('this.qrResult', this.qrResult);
    
  // }

  onScanSuccess(decodedText: string, decodedResult: any) {
      let resultContainer: any = document.getElementById('qr-reader-results-2');
      
      
      // try {
          // Ensure decodedText is properly formatted JSON-like string
          // const jsonText = decodedText.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
  
          // // Parse the JSON string
          // const decodedData = JSON.parse(jsonText);
  
          // // Extract visitorId and inviteId from the parsed data
          // const visitorId = decodedData.visitorId;
          // const inviteId = decodedData.inviteId;
  
          let splitCode = decodedText.split('&');
          console.log(splitCode,"splitCode");
          let  visitorId = splitCode[0].split('=')[1];
          let inviteId = splitCode[1].split('=')[1];
                 
  
          // Update the result container
          resultContainer.innerHTML = `Visitor ID: ${visitorId}, Invite ID: ${inviteId}`;
          this.qrResult={visitorId, inviteId}
      //     // Fetch visitor data
          this.getVisitorData(visitorId);
          
      // } catch (error) {
      //     console.error('Error parsing decoded text:', error);
      // }
    
}
getInvitecode() {
  this.successMessage=''
  this.errorMessage =''
  this.visitorService.GetVisitorDetailsByInvitecode(this.inviteCode).subscribe(
    (response:any) => {
      console.log(response,"type");
      if (response.response.returnNumber == 200) {
        this.qrResult=response.value 
        console.log(response.value,"200");
        this.getVisitorData(this.qrResult.visitorId);
        this.successMessage="Invite Code fetched"
        
      }else{
        this.errorMessage = response.response.errorMessage;
        this.qrResult={}
      }
    },
    (error) => {
      console.error('Check-in failed:', error);
    } 
)
}
  

  getVisitorData(visitorId: any) {
    this.visitorService.GetVisitorDetailsById(visitorId).subscribe(
      (response) => {
        console.log(response,"res");
        
        if (Object.keys(response.value).length > 0) {
          const countryList:any = this.visitorService.countryList.getValue();
          this.countrydata = countryList.find((c: any) => c.id === response.value.country);        
          // Update UI with visitor details
          this.updateVisitorDetails(response.value);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  updateVisitorDetails(visitorDetails: any) {
    this.visitor = { ...visitorDetails };
  }

  checkIn() {
    // Extract visitorId and inviteId from qrResult
    const { visitorId, inviteId } = this.qrResult;
    const combinedId = `${visitorId},${inviteId}`;
    this.errorMessage =''
    this.successMessage =''
    // Call the CheckInVisitByQR API with visitorId and inviteId
  this.visitorService.CheckOutVisitByQR(visitorId, inviteId).subscribe(
      (response:any) => {
        console.log(response,"qr");
        if (response.returnNumber == 200) {
          this.successMessage = 'Checked Out Successfully'
        } else{
          this.errorMessage = response.errorMessage;
        }
        
      },
      (error) => {
        console.error('Check-in failed:', error);
        // if (error && error.error && error.error[' ']) {
        //     const errorMessage = error.error[' '];
        //     console.error('Error message:', errorMessage);
        //     this.errorMessage = errorMessage;
        // }
      } 
  );

}

  onScanFailure(error: any) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    this.qrResult={}
    console.warn(`Code scan error = ${error}`);
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
    this.visitorService.UpdatedNotificationStatusOfUser(this.inviteId).subscribe((res)=>{
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
    this.visitorService.GetUnplannedVistListUserSide().subscribe((res)=>{
      if (res.value?.length>0) {
        this.unPlannedList = res.value.map(item => ({ firstName: item.firstName, lastName: item.lastName,inviteId: item.inviteId,isUnplannedAccepted:item.isUnplannedAccepted }));
        console.log('unPlanned',this.unPlannedList);
      }
    })
  }
}
