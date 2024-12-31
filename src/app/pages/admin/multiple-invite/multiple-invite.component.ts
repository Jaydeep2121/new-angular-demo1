import { ChangeDetectorRef, Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../modules/auth/helper/shared.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { Subscription } from 'rxjs';
import { InviteService } from '../services/invites/invite.service';
import { AppLoaderComponent } from '../../../libs/app-loader/app-loader.component';
import { AddMultipleInvitesComponent } from './add-multiple-invites/add-multiple-invites.component';
import { VisitorService } from '../services/visitors/visitor.service';
import { getMultipleInviteResponse } from '../services/visitors/visitor.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-multiple-invite',
  standalone: true,
  imports: [SharedModule,AddMultipleInvitesComponent,InlineSVGModule,AppLoaderComponent],
  templateUrl: './multiple-invite.component.html',
  styleUrl: './multiple-invite.component.scss'
})
export class MultipleInviteComponent {
  dataSource:any[] = [];
  displayedColumns: string[] = ['name', 'phone', 'email', 'address', 'city', 'state','country','blockedEntry','vip','remarks'];
  searchTerm: string = ''
  showLoading:boolean = false;
  noDataFound='';
  constructor(private modalService: NgbModal,
    private visitorService:VisitorService,
    private inviteService: InviteService,
    private cdr: ChangeDetectorRef, private toastr: ToastrService,) { }
  
  openAddWatchListModal(addWatchList: any) {
    this.modalService.open(addWatchList, {centered: true, backdrop: 'static', keyboard: false})
  }

  filteredData: any[] =[]
  // Pagination properties
  itemsPerPage: number = 5; // Adjust as needed
  currentPage: number = 1;
  totalPages: number;
  hostlist: any[]=[];
  subTypeList: any[]=[];
  unsubscribe: Subscription[] = [];
  pageStyle:string[]=[
    "min-w-200px",
    "min-w-200px",
    "min-w-200px",
    "min-w-250px",
    "min-w-250px",
    "min-w-200px",
    "min-w-100px",
    "min-w-100px"
  ];

  ngOnInit(): void {
    this.showLoading=true;
    this.getVisitorSubType();
    this.getHostDrop();
    this.getMultipleInviteData();
  }

  getHostDrop(): any {
    const hostList = this.inviteService.getHostList().subscribe(
      (response) => {
        this.hostlist = response.value;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    this.unsubscribe.push(hostList);
  }

  getMultipleInviteData(): any {
    const visitorSubscription$ = this.visitorService.GetGroupInviteDetails().subscribe(
      (response:getMultipleInviteResponse) => {
        
        if(response.value?.length > 0) { 
          this.noDataFound='';
          this.dataSource = response.value;
          this.dataSource = response.value.map((res:any)=>{
            return {
              ...res,
              subType:this.getSubTypeValue(res.subType),
              hostName:this.getHostName(res.host)
            }
          });
          this.toastr.success(`Fetched Multiple-Invited Data Successfully!`, 'Success', {timeOut: 3000});
          this.filterData();
          this.showLoading = false;
          this.cdr.detectChanges();
        }else{
          this.showLoading = false;
          this.noDataFound='No records';
        }
      },
      (error) => {
        // Handle error
        this.toastr.error(`Error While fetching Multiple-Invited data!`, 'Error', {timeOut: 3000});
        console.error('Error:', error);
        this.showLoading = false;
      } 
    );
    this.unsubscribe.push(visitorSubscription$);
  }

  getVisitorSubType(): any {
    const subTypeList$ = this.inviteService.GetVisitorType().subscribe(
      (response) => {
        this.subTypeList = response.value;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    this.unsubscribe.push(subTypeList$);
  }

  getSubTypeValue(id:number){
    const item = this.subTypeList.find(item => item.value == id);
    return item ? item.text : null;
  }

  getHostName(id: number): string {
    const hostname = this.hostlist.find((c:any) => c.value == id);
    return hostname ? hostname.text : null;
  }

  applyFilter(): void {
    this.currentPage = 1; // Reset to the first page when applying a filter
    this.filterData();
  }

  filterData(): void {
    const filteredItems = this.dataSource.filter((row) =>
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
    this.noDataFound = this.filteredData.length === 0 ? 'No records' : '';
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
  
  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  
  onSave(event: any){
    this.filteredData=[];
    this.dataSource=[];
    this.getMultipleInviteData();
    this.modalService.dismissAll();
  }
}
