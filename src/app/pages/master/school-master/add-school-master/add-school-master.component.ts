import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../../modules/auth/helper/shared.module';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { fileTypeValidator, isControlInvalid } from '../../../../helpers/_validators';
import { SchoolMasterService } from '../../services/school-master/school-master.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { VisitorCheckInCheckOutService } from '../../../user/services/visitor-check-in-check-out.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-school-master',
  standalone: true,
  imports: [ SharedModule,
    NgbModalModule,
    NgSelectModule,],
  templateUrl: './add-school-master.component.html',
  styleUrl: './add-school-master.component.scss'
})
export class AddSchoolMasterComponent implements OnInit{
  @Output() onClick: EventEmitter<boolean> = new EventEmitter()
  selectedFileName: string | null = null;
  selectedFile: File | null = null;
  unsubscribe: Subscription[] = [];
  progress: number = 0;
  fileName: string;
  touched: boolean = false;
  editFileName:string='';
  schoolName: string;
  errorMessage: string='';
  successText: string='';
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private formBuilder: FormBuilder, private schoolService:SchoolMasterService,private modalService: NgbModal,private VisitorCheckInCheckOutService:VisitorCheckInCheckOutService,private toastr: ToastrService) {
      this.isLoadingSubject = new BehaviorSubject<boolean>(false);  
      this.isLoading$ = this.isLoadingSubject.asObservable();
    }


  SchoolMasterForm: FormGroup = this.formBuilder.group({
    schoolName:['', Validators.required],
  });

  ngOnInit(): void {
    this.SchoolMasterForm.addControl('profile', this.formBuilder.control(null, [Validators.required, fileTypeValidator]));
  }

  onSubmit() {
    this.isLoadingSubject.next(true);
    if (!this.SchoolMasterForm.valid) {
      return;
    }
    this.errorMessage = '';
    const {schoolName}=this.SchoolMasterForm.value;
    const payload = {
      schoolName,
      fileName: this.fileName
    }
  const schoolService = this.schoolService.SaveSchoolDetails(payload).subscribe(
      (response) => {
        if (response.returnNumber==200) {
          this.successText='School details saved successfully!'
          this.toastr.success(`School details saved successfully!`, 'Success', {timeOut: 3000});
          this.onClick.emit(true);
          this.closeModal();
        }else{
          this.errorMessage = response.errorMessage;
          this.toastr.error(this.errorMessage, 'Error', {timeOut: 3000});
        }
        this.isLoadingSubject.next(false);
      },
      (error) => {
        // Handle error response if needed
        this.toastr.error(`Error While add School details!`, 'Error', {timeOut: 3000});
        console.error('Error saving school details:', error);
        this.isLoadingSubject.next(false);
      }
    );
    this.unsubscribe.push(schoolService);
    this.SchoolMasterForm.reset();
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
  onFileChange(event: any): void {
    
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile,"selectedFile");
    this.selectedFileName = event.target.files[0].name;

    this.uploadFile(); 
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('flag', 'logo')
    console.log('school',formData,this.selectedFile);
    
    const imageUpload = this.VisitorCheckInCheckOutService.imageUpload(formData).subscribe(
      (fileUploadResponse: any) => {
        console.log('return number',fileUploadResponse.response.returnNumber);
        if (fileUploadResponse.response.returnNumber==200) {
          this.fileName = fileUploadResponse.value.fileName;  
        }else{
          this.errorMessage = fileUploadResponse.response.errorMessage;
        }
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
    this.unsubscribe.push(imageUpload);
    this.SchoolMasterForm.patchValue({ profile: this.selectedFile });
  }
  get file() {
    return this.SchoolMasterForm.get('profile');
  }

  removeSelectedFile() {
    this.selectedFile = null;
    this.fileName='';
    this.editFileName='';
    this.SchoolMasterForm.patchValue({ profile: null });
  }
  getFileSize(sizeInBytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (sizeInBytes === 0) return '0 Byte';
    const i = parseInt(
      Math.floor(Math.log(sizeInBytes) / Math.log(1024)).toString()
    );
    return Math.round(sizeInBytes / Math.pow(1024, i)) + ' ' + sizes[i];
  }
  isControlInvalidWrapper(controlName: string): boolean {
    return isControlInvalid(this.SchoolMasterForm.get(controlName)!);
  }
  closeModal() {
    this.modalService.dismissAll();
  }
}
