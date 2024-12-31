import { ChangeDetectorRef, Component } from '@angular/core';
import { SharedModule } from '../../../modules/auth/helper/shared.module';
import { isControlInvalid } from '../../../helpers/_validators';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AddSchoolMasterComponent } from './add-school-master/add-school-master.component';
import { SchoolMasterService } from '../services/school-master/school-master.service';
import { Subscription } from 'rxjs';
import { AppLoaderComponent } from '../../../libs/app-loader/app-loader.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-school-master',
  standalone: true,
  imports: [SharedModule,NgbModalModule,InlineSVGModule,AddSchoolMasterComponent,FormsModule,AppLoaderComponent],
  templateUrl: './school-master.component.html',
  styleUrl: './school-master.component.scss'
})
export class SchoolMasterComponent {
  dataSource: any
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number;
  itemsPerPage: number = 5;
  filteredData: any[] = [];
  showLoading:boolean = false;
  unsubscribe: Subscription[] = [];
  pageStyle:string[]=[
    "min-w-200px",
    "min-w-200px",
    "min-w-200px",
  ];
  noDataFound='';

  constructor(private formBuilder: FormBuilder,private modalService: NgbModal,private schoolService:SchoolMasterService,private cdr: ChangeDetectorRef,private toastr: ToastrService){}
  addSchoolmasterForm: FormGroup = this.formBuilder.group({
    schoolName: [null, Validators.required],
    FillName: [null, Validators.required],
 
  });
  ngOnInit(): void {
    this.showLoading=true
    this.GetSchoolList()
  }
  handleImageError(event: any) {
    event.target.src = '../../../../assets/media/svg/avatars/blank.svg';
  }

  GetSchoolList(): any {
    const invitorsSubscription = this.schoolService.GetSchoolMasterList().subscribe(
      (response: any) => {
        console.log(response,"res");
        
        if(response.value?.length > 0) { 
          this.dataSource = response.value;
          this.toastr.success(`Fetched SchoolMaster Data Successfully!`, 'Success', {timeOut: 3000});
          this.noDataFound='';
          this.filterData();
          this.showLoading = false;
          this.cdr.detectChanges();
        }else{
          this.showLoading = false;
          this.toastr.error(`No record found`, 'Error', {timeOut: 3000});
          this.noDataFound='No records';
        }
      },
      (error) => {
        this.toastr.error(`Error While fetching SchoolMaster data!`, 'Error', {timeOut: 3000});
        console.error('Error:', error);
        this.showLoading = false;
      } 
    );
    this.unsubscribe.push(invitorsSubscription);
    }
  onClickEmit(){
    this.filteredData=[];
    this.dataSource=[];
    this.GetSchoolList()

  }

  openAddSchoolModal(addSchool: any) {
    this.modalService.open(addSchool, {centered: true, backdrop: 'static', keyboard: false})
  }
  applyFilter(): void {
    this.currentPage = 1; // Reset to the first page when applying a filter
    this.filterData();
  }
  filterData(): void {
    const filteredItems = this.dataSource.filter((row: any) =>
      Object.values(row).some(
        (value) =>
          value &&
          typeof value === 'string' &&
          value.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  
    // Apply pagination
    this.totalPages = Math.ceil(filteredItems.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredData = filteredItems.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
    this.noDataFound = this.filteredData.length === 0 ? 'No records' : '';
  }
  
  getFirstIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getLastIndex(): number {
    if (!this.dataSource) {
      return 0; // or return a default value
    }
    
    const lastIndex = this.currentPage * this.itemsPerPage;
    return lastIndex > this.dataSource.length
      ? this.dataSource.length
      : lastIndex;
  }
  

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterData();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  isControlInvalidWrapper(controlName: string): boolean {
    return isControlInvalid(this.addSchoolmasterForm.get(controlName)!);
  }
}
