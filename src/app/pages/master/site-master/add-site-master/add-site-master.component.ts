import { Component, EventEmitter, Output } from '@angular/core';
import { SharedModule } from '../../../../modules/auth/helper/shared.module';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { isControlInvalid } from '../../../../helpers/_validators';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SiteMasterService } from '../../services/site-master/site-master.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-site-master',
  standalone: true,
  imports: [SharedModule,
    NgbModalModule,
    NgSelectModule],
  templateUrl: './add-site-master.component.html',
  styleUrl: './add-site-master.component.scss'
})
export class AddSiteMasterComponent {
  @Output() onClick: EventEmitter<boolean> = new EventEmitter();
  unsubscribe: Subscription[] = [];
  successText: string='';
  errorMessage: string='';
  schoolListData:any[]=[];
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  siteForm: FormGroup = this.formBuilder.group({
    sites: [null, Validators.required],
    additionalSites: this.formBuilder.array([]),
    schoolList: [null, Validators.required],
  });
  
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private schoolSiteServ:SiteMasterService,
    private toastr: ToastrService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);  
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.GetSchoolListData();
  }

  get additionalSites(): FormArray {
    return this.siteForm.get('additionalSites') as FormArray;
  }

  isAddtionalSitesInvalid(index: number): boolean {
    const control = this.additionalSites.at(index) as FormControl;
    return control && control.invalid && (control.dirty || control.touched);
  }

  removeAdditionalSite(index: number) {
    this.additionalSites.removeAt(index);
  }
  
  addAdditionalSite() {
    const control = this.formBuilder.control('', Validators.required);
    control['customName'] = "additionalSite";
    this.additionalSites.push(control);
  }

  isControlInvalidWrapper(controlName: string): boolean {
    return isControlInvalid(this.siteForm.get(controlName)!);
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  GetSchoolListData() {
    this.schoolSiteServ.GetSchoolList().subscribe(
      (response) => {
        this.schoolListData = response.value;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  submit(): void {
    this.isLoadingSubject.next(true);
    if (!this.siteForm.valid) {
      return;
    }
    this.errorMessage = '';
    const formControls = this.siteForm.controls;
    const additionalSitesArray = this.siteForm.get('additionalSites') as FormArray;
    const sitesValue = formControls['sites'].value;
    additionalSitesArray.value.push(sitesValue);
    const sitPayload = {
      siteName:additionalSitesArray.value,
      schoolId: parseInt(formControls['schoolList'].value.value),
    }
    const siteDataSave = this.schoolSiteServ.SaveSchoolSiteDetails(sitPayload).subscribe(
      (res) => {
        if (res.returnNumber == 200) {
          this.successText='site created Successfully!'
          this.toastr.success(`Site created Successfully!`, 'Success', {timeOut: 3000});
          this.onClick.emit(true);
          this.closeModal();
        } else {
          this.errorMessage = res?.errorMessage;
          this.toastr.error(this.errorMessage, 'Error', {timeOut: 3000});
          return;
        }
        this.isLoadingSubject.next(false);
      },
      (error) => {
        this.toastr.error(`Error While add site details!`, 'Error', {timeOut: 3000});
        console.error('Error:', error);
        this.isLoadingSubject.next(false);
      }
    );
    this.unsubscribe.push(siteDataSave);
  }
  
  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
