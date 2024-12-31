import { Component } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { isControlInvalid } from '../../../../helpers/_validators';
import { SharedModule } from '../../../../modules/auth/helper/shared.module';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-schools',
  standalone: true,
  imports: [NgbModalModule, SharedModule, InlineSVGModule],
  templateUrl: './add-schools.component.html',
  styleUrl: './add-schools.component.scss',
})
export class AddSchoolsComponent {
  isEdit: boolean = false;
  unsubscribe: Subscription[] = [];
  selectedFile: File | null = null;
  editFileName: string = '';
  touched: boolean = false;
  selectedFileName: string | null = null;
  fileName: string;
  photo: string;
  progress: number = 0;
  schoolForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.initializeForm()
  }

  initializeForm(): void {
    this.schoolForm = this.formBuilder.group({
      schoolName: [null, Validators.required],
      sites: [null, Validators.required],
      additionalSites: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
  }

  isAddtionalSitesInvalid(index: number): boolean {
    const control = this.additionalSites.at(index) as FormControl;
    return control && control.invalid && (control.dirty || control.touched);
  }

  isControlInvalidWrapper(controlName: string): boolean {
    return isControlInvalid(this.schoolForm.get(controlName)!);
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
    this.selectedFileName = event.target.files[0].name;

    this.uploadFile();
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    console.log(formData, this.selectedFile);

    // const imageUpload = this.VisitorCheckInCheckOutService.imageUpload(formData).subscribe(
    //   (fileUploadResponse: any) => {
    //     console.log(fileUploadResponse);

    //     this.photo = fileUploadResponse.value.filePath;
    //     this.fileName = fileUploadResponse.value.fileName;
    //   },
    //   (error: any) => {
    //     console.error('Error:', error);
    //   }
    // );
    // this.unsubscribe.push(imageUpload);
    this.schoolForm.patchValue({ profile: this.selectedFile });
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

  get file() {
    return this.schoolForm.get('profile');
  }

  get additionalSites(): FormArray {
    return this.schoolForm.get('additionalSites') as FormArray;
  }

  addAdditionalSite() {
    console.log('before site::', this.additionalSites);
    const controlName = `additionalSite${this.additionalSites.length + 1}`;
    const control = this.formBuilder.control('', Validators.required);
    control['customName'] = "additionalSite";
    this.additionalSites.push(control);
    console.log('After:', this.additionalSites);
  }

  addAdditionalSiteAtIndex(index: number): void {
    this.additionalSites.insert(index + 1, this.formBuilder.control('', Validators.required));
  }

  removeAdditionalSite(index: number) {
    this.additionalSites.removeAt(index);
  }

  // isControlInvalid(controlName: string): boolean {
  //   const control = this.schoolForm.get(controlName);
  //   return control && control.invalid && (control.dirty || control.touched);
  // }

  removeSelectedFile() {
    this.selectedFile = null;
    this.fileName='';
    this.editFileName='';
    this.schoolForm.patchValue({ profile: null });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  submitOrContinue(isNext: boolean): void {
    if (!this.schoolForm.valid) {
      return;
    }

    const formControls = this.schoolForm.controls;
    console.log("formcontrols", formControls);
    
    const visitorPayload: any = {
      schoolName: formControls['schoolName'].value,
    };

    this.selectedFile = null;
    this.touched = false;
  }
}
