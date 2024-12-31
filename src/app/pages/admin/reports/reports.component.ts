import { Component } from '@angular/core';
import { INVITES_DATA } from '../../../data/raw';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { SharedModule } from '../../../modules/auth/helper/shared.module';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatetimepickerModule } from '../../../material-module/date-time-picker/datetimepicker.module';
import { dateTimeValidator } from '../../../helpers/_validators';
import { SchoolVisitService } from '../services/school-visit/school-visit.service';
import { GroupsService } from '../services/groups/groups.service';
import { DatePipe, formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [SharedModule,DatetimepickerModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  // InvitesForm: FormGroup;
  isshowtabledata : boolean =false
  dataSource:any=INVITES_DATA;
  searchTerm: string = '';
  isEdit: boolean = false;
  invitesData: any;
  filteredData: any[] =[]
  countriesData: any;
  itemsPerPage: number = 5; 
  currentPage: number = 1;
  totalPages: number;
  showLoading:boolean = false;
  unsubscribe: Subscription[] = [];
  hostlistData: any[]=[];
  ReportsData:any[]=[];
  errorMessage:any
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  InvitesForm: FormGroup = this.formBuilder.group({
    expectedCheckInDateTime: ['', Validators.required],
    expectedCheckOutDateTime: ['', Validators.required],
  }, {
    validator: dateTimeValidator('expectedCheckInDateTime', 'expectedCheckOutDateTime')
  });

  constructor(private formBuilder: FormBuilder,  private GroupsService:GroupsService,private toastr: ToastrService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);  
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }
  // dateTimeMismatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
  //   const checkInDateTime = control.get('expectedCheckInDateTime')?.value;
  //   const checkOutDateTime = control.get('expectedCheckOutDateTime')?.value;

  //   if (checkInDateTime && checkOutDateTime && checkOutDateTime < checkInDateTime) {
  //     return { dateTimeMismatch: true };
  //   }

  //   return null;
  // }


  ngOnInit(): void {
    this.filterData();
    
    
  }
  getVisitDetails(FromDat:number,ToDate:any): any {
    // const FromData = this.GroupsService.GetVisitDetails(FromDat,ToDate).subscribe(
    //   (response) => {
    //     this.ReportsData = response.value;
    //   },
    //   (error) => {
    //     console.error('Error:', error);
    //   }
    // );
    // this.unsubscribe.push(FromData);
  }
  clearAutofill() {
    this.searchTerm = ''; 
  }

  onGo() {
    this.isLoadingSubject.next(true)
    this.isshowtabledata = true;

    const FromDat = this.InvitesForm.get('expectedCheckInDateTime').value;
    const ToDate = this.InvitesForm.get('expectedCheckOutDateTime').value;

    const fromObj = new Date(FromDat);
    const toObj = new Date(ToDate);

    const datePipe = new DatePipe('en-US');

    const formattedFromDate = datePipe.transform(fromObj, 'dd MMM yyyy');
    const formattedToDate = datePipe.transform(toObj, 'dd MMM yyyy');

    const FromData = this.GroupsService.GetVisitDetails(formattedFromDate, formattedToDate).subscribe(
      (response) => {
        if (response.value) {
          this.ReportsData = response.value;
          this.toastr.success(`Fetched Reports Data Successfully!`, 'Success', {timeOut: 3000});
          this.errorMessage = ""
        } else {
          this.ReportsData = [];
          this.errorMessage = response.response.errorMessage
          this.toastr.error(this.errorMessage, 'Error', {timeOut: 3000});
        }
        this.isLoadingSubject.next(false)
      },
      (error) => {
        this.isLoadingSubject.next(false)
        this.toastr.error(`Error While fetching Reports data!`, 'Error', {timeOut: 3000});
        console.error('Error:', error);
      }
    );

    this.unsubscribe.push(FromData);
  }
  
  applyFilter(): void {
    this.currentPage = 1; // Reset to the first page when applying a filter
    this.filterData();
  }

  filterData(): void {
    const filteredItems = this.dataSource?.filter((row:any) =>
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
    this.filteredData = filteredItems.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getFirstIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getLastIndex(): number {
    const lastIndex = this.currentPage * this.itemsPerPage;
    return lastIndex > (this.filteredData?.length ?? this.dataSource?.length)
      ? (this.filteredData?.length ?? this.dataSource?.length)*this.currentPage
      : lastIndex*this.currentPage;
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

  ngOnDestroy(): void{
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
