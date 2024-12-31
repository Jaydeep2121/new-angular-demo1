import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  Html5Qrcode,
  Html5QrcodeScanner,
  Html5QrcodeSupportedFormats,
} from 'html5-qrcode';
import { ReusabledesignModule } from '../../../re-usable-design/reusabledesign.module';
import { VisitorService } from '../../../admin/services/visitors/visitor.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { InviteService } from '../../../admin/services/invites/invite.service';
import { environment } from '../../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { checkInMessages } from '../../../../helpers/_constants';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-qr-scan',
  standalone:true,
  imports:[ReusabledesignModule,CommonModule,FormsModule],
  templateUrl: './qr-scan.component.html',
  styleUrls: ['./qr-scan.component.scss']
})
export class QrScanComponent implements OnInit, AfterViewInit {
  visitor: any = {}
  errorMessage: string = ''
  successMessage: string = ''
  inputType: string = 'qr'; // Default to QR input
  inviteCode: string = '';
  qrResult: any = {}
  unPlannedList:any[]=[];
  invite: any = {};
  countrydata:any
  private API_IMAGE = `${environment.apiUrl}/Image/GetImage`;
  inviteId: number;
  notificationMsg:string=''
  checkIsRequestAccepted:boolean;

  html5QrcodeScanner: any
  constructor(private router: Router, private visitorService: VisitorService, private inviteService: InviteService,private modalService: NgbModal,private toastr: ToastrService) { 
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
      'reader',
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
  
  onGeneratePass() {
    console.log('pass printing');
  var datePipe = new DatePipe('en-us');
  const visitorCardDefinition: any = {
    pageSize: 'A5', // Set the page size
    pageOrientation: 'landscape',
    pageMargins: [40, 40, 40, 40], // Adjust margins as needed
    content: [
      {
        absolutePosition: { x: 17, y: 10 },
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 550.28, // Width of A4 page in PDFMake (in points)
            h: 350.89, // Height of A4 page in PDFMake (in points)
            r: 10, // Radius for rounded corners (if needed)
            lineWidth: 2, // Border width
            lineColor: '#000000', // Border color
          },
        ],
      },
      {
        columns: [
          [{ text: '\t\t\tVISITOR\t\t\t', style: 'visitorCard' }],
          [],
          [
            {
              text: 'LOGO',
              style: 'logo',
            },
          ],
        ],
      },
      {
        columns: [
          [
            '\n',
            { text: 'Name', style: 'text' },
            '\n',
            { text: 'From', style: 'text' },
            '\n',
            { text: 'To Meet', style: 'text' },
            '\n',
            { text: 'Purpose', style: 'text' },
            '\n',
            { text: 'TIME IN', style: 'text' },
            '\n',
            {
              text: 'VALIDITY',
              style: 'text',
            },
          ],
          [
            '\n',
            { text: `${this.visitor.firstName} ${this.visitor.lastName}`, style: 'text' },
            '\n',
            { text: '-', style: 'text' },
            '\n',
            { text: '-', style: 'text' },
            '\n',
            { text: `${this.invite.purpose}`, style: 'text' },
            '\n',
            { text:  `${datePipe.transform(this.invite.expectedCheckinTime, 'dd-MM-yyyy hh:mm')}`, style: 'text' },
            '\n',
            {
              text: `${datePipe.transform(this.invite.expectedCheckoutTime, 'dd-MM-yyyy hh:mm')}`,
              style: 'text',
            },
          ],
          [
            '\n',
            { image: 'logo', width: 150, height: 100, alignment: 'center' },
            '\n',
            {
              text: '',
              style: 'text',
            },
          ],
        ],
      },
      {
        columns: [
          [
            '\n\n\n\n\n\n\n',
            {
              text: 'VISITOR SIGN',
              style: 'text',
            },
          ],
          [
            '\n\n\n\n\n\n\n',
            {
              text: 'EMPLOYEE SIGN',
              style: 'text',
            },
          ],
          [
            '\n\n\n\n\n\n\n',
            {
              text: 'SECURITY OFFICER',
              style: 'text',
            },
          ],
        ],
      },
    ],

    styles: {
      logo: {
        alignment: 'end',
      },
      visitorCard: {
        padding: 50,
        fontSize: 20,
        bold: true,
        alignment: 'center',
        background: 'green',
        color: 'white',
      },
      text: { fontSize: 12, alignment: 'left' },
      column: { alignment: 'center' },
    },
    images: {
      logo: `${this.API_IMAGE}?imageName=${this.visitor.fileName}&contentType=${this.visitor.fileName.split('.')[1]}&flag=visitor`,
    },
  };
    const pdfDocGenerator = pdfMake.createPdf(visitorCardDefinition);
    pdfDocGenerator.getBlob((blob: Blob) => {
      // Save or display the blob as needed (e.g., open in a new tab)
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    });
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
      let resultContainer: any = document.getElementById('qr-reader-results');
      
      
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
          console.log(decodedText,"text");
          console.log(decodedResult,"decodedResult");
                    
          this.qrResult={visitorId, inviteId}
      //     // Fetch visitor data
          this.getVisitorData(visitorId);
          this.getInviteData(inviteId);
          
      // } catch (error) {
      //     console.error('Error parsing decoded text:', error);
      // }
    
}
getInvitecode() {
  this.successMessage=''
  this.errorMessage=''
  this.visitorService.GetVisitorDetailsByInvitecode(this.inviteCode).subscribe(
    (response:any) => {
      console.log(response,"type");
      if (response.response.returnNumber == 200) {
        this.qrResult=response.value 
        console.log(response.value,"200");
        this.getVisitorData(this.qrResult.visitorId);
        this.getInviteData(this.qrResult.inviteId);
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
          // Update UI with visitor details
          this.updateVisitorDetails(response.value);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getInviteData(inviteId: any) {
    this.inviteService.GetInviteDetailsById(inviteId).subscribe(
      (response) => {
        console.log(response,"res");
        
        if (Object.keys(response.value).length > 0) {
          const countryList:any = this.visitorService.countryList.getValue();
          this.countrydata = countryList.find((c: any) => c.id === response.value.country)
          // Update UI with visitor details
          this.invite = response.value;
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
    this.successMessage=''
    // Call the CheckInVisitByQR API with visitorId and inviteId
  this.visitorService.CheckInVisitByQR(visitorId, inviteId).subscribe(
      (response:any) => {
        console.log(response,"qr");
        if (response.returnNumber == 200) {
          this.successMessage = 'Checked In Successfully'
        } else {
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
