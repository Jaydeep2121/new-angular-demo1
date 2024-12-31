import { ChangeDetectorRef, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../../modules/auth/helper/shared.module';
import { NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { VisitorService } from '../services/visitors/visitor.service';
import { DashboardService } from '../services/dashboard/dashboard.service';
import { Subscription } from 'rxjs';
import { visitorResponse } from '../services/visitors/visitor.model';
import { AppLoaderComponent } from '../../../libs/app-loader/app-loader.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports:[
    SharedModule,   
    NgbTooltipModule,
    NgbModalModule,
    InlineSVGModule,
    NgScrollbarModule,
    AppLoaderComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  dataSource: any = []
  displayedColumns: string[] = ['image','name', 'email', 'id', 'checkIn'];
  searchTerm: string = '';
  totalVisitorInSchoolCount:number;
  totalVisitorTillCount:number;
  totalVisitorTodayCount:number;
  visitorSubscription$:Subscription;

  filteredData: any[] = [];
  showLoading:boolean = false;
  // Pagination properties
  itemsPerPage: number = 5; // Adjust as needed
  currentPage: number = 1;
  totalPages: number;
  pageStyle:string[]=[
    'min-w-200px',
    'min-w-125px',
    'min-w-125px',
    'min-w-200px'
    ];
  noDataFound='';
  errorMessage:string = ''

  constructor(private router: Router, private visitorService: VisitorService,private dahsboardServ:DashboardService, private cdr: ChangeDetectorRef,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.showLoading=true;
    this.filterData();
    this.dashboardDetails();
    this.getDashboardList();
  }

  getDashboardList() { 
    this.visitorSubscription$ = this.visitorService.getVisitorDetails().subscribe(
      (response) => {
        if(response.value?.length > 0) { 
          this.dataSource = response.value.slice(0, 5);
          this.noDataFound='';
          this.filterData();
          this.showLoading = false;
          this.cdr.detectChanges();
        }else{
          this.errorMessage = response.response?.errorMessage
          this.toastr.error(this.errorMessage, 'Visitor', {timeOut: 3000});
          this.showLoading = false;
          this.noDataFound='No records';
        }
      },
      (error) => {
        // Handle error
        console.error('Error:', error);
        this.showLoading = false;
      } 
    );
  }

  dashboardDetails() {
    this.dahsboardServ.GetTotalVisitorInSchool().subscribe((res) => {
      this.totalVisitorInSchoolCount=res.value.count
    },
    (error) => {
      // Handle error
      console.error('Error:', error);
    })
    
    this.dahsboardServ.GetTotalVisitorTillDate().subscribe((res) => {
      this.totalVisitorTillCount=res.value.count
    },
    (error) => {
      // Handle error
      console.error('Error:', error);
    })

    this.dahsboardServ.GetTotalVisitorVisitToday().subscribe((res) => {
      this.totalVisitorTodayCount=res.value.count
    },
    (error) => {
      // Handle error
      console.error('Error:', error);
    })
  }

  applyFilter(): void {
    this.currentPage = 1; // Reset to the first page when applying a filter
    this.filterData();
  }

  noOfVisitor(){
    const queryParams = {
      noOfVisitor: true
    };
    this.router.navigate(['/admin/visitor'],{ queryParams });
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
  }

  getFirstIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getLastIndex(): number {
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
}
