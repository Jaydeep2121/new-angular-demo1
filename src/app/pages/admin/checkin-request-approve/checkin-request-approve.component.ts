import { ChangeDetectorRef, Component } from '@angular/core';
import { CHEKIN_APPROVED_DATA } from '../../../data/raw';
import { checkinRequestApprove } from '../services/checkin-request-approve/checkin-request-approve.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../modules/auth/helper/shared.module';
import { CheckinRequestApproveService } from '../services/checkin-request-approve/checkin-request-approve.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AppLoaderComponent } from '../../../libs/app-loader/app-loader.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkin-request-approve',
  standalone:true,
  imports:[SharedModule,AppLoaderComponent],
  templateUrl: './checkin-request-approve.component.html',
  styleUrl: './checkin-request-approve.component.scss'
})
export class CheckinRequestApproveComponent {
  dataSource:any[]=[]
  displayedColumns: string[] = [ 'name','purposeOfVisit','Action'];
  searchTerm: string = '';
  showLoading:boolean= false

  filteredData: any[] = [];
  errorMessage:string = ''
  unsubscribe: Subscription[] = [];
  // Pagination properties
  itemsPerPage: number = 5; // Adjust as needed
  currentPage: number = 1;
  totalPages: number;
  pageStyle:string[]=[
    "min-w-200px",
    "min-w-200px",
    "min-w-200px"];
  noDataFound='';
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  loadingStates: { [key: string]: { accept: boolean, decline: boolean } } = {};

  constructor(private modalService: NgbModal,private checkInApprovalService:CheckinRequestApproveService,private cdr: ChangeDetectorRef,private toastr: ToastrService,) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);  
    this.isLoading$ = this.isLoadingSubject.asObservable();
   }

  ngOnInit(): void {
    // this.filterData();
    this.showLoading=true;
    this.getUnplannedVistListAdminSide()
  }

  getUnplannedVistListAdminSide() {
    const invitorsSubscription = this.checkInApprovalService.GetUnplannedVistListAdminSide().subscribe(
      (response:any) => {
        console.log(response,"checkimg");

        if(response.value?.length > 0) { 
          this.noDataFound='';
          this.dataSource = response.value;
          this.toastr.success(`Checkin-Request Added Successfully!`, 'Success', {timeOut: 3000});
          this.filterData();
          this.showLoading = false;
          this.cdr.detectChanges();
        }else{
          this.showLoading = false;
          this.errorMessage = response.response.errorMessage
          this.toastr.error(this.errorMessage, 'Error', {timeOut: 3000})
          this.noDataFound='No records';
        }
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastr.error(`Error While add Checkin-Request data!`, 'Error', {timeOut: 3000});
        console.error('Error:', error);
        this.showLoading = false;
      } 
    );
    this.unsubscribe.push(invitorsSubscription);
  }
  onVisitStatusChange(inviteId: any, status: boolean, buttonType: 'accept' | 'decline'): void {
    this.loadingStates[inviteId] = { accept: false, decline: false };
    this.loadingStates[inviteId][buttonType] = true;
    this.isLoadingSubject.next(true);
    this.checkInApprovalService.UpdatedNotificationStatusOfAdmin(inviteId,status).subscribe(
      (response:any) => {
        console.log(response,"checkimg",response.returnNumber);

        if(response.returnNumber == 200) { 
          this.filteredData=[];
          this.dataSource=[];
          this.getUnplannedVistListAdminSide();
        }else{
          this.errorMessage = response.errorMessage
          this.toastr.error(this.errorMessage, 'Error', {timeOut: 3000});
        }
        this.isLoadingSubject.next(false);
        this.loadingStates[inviteId][buttonType] = false;
      },
      (error) => {
        this.isLoadingSubject.next(false);
        this.loadingStates[inviteId][buttonType] = false;
        console.error('Error:', error);
        this.showLoading = false;
      } 
    )
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
    console.log(this.filteredData,"filteredData");
    
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
}
