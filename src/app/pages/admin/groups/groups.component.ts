import { ChangeDetectorRef, Component } from '@angular/core';
import { NgbModal, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Groups, GroupsResponse } from '../services/groups/groups.model';
import { GroupsService } from '../services/groups/groups.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AddManageGroupsComponent } from './add-manage-groups/add-manage-groups.component';
import { AppLoaderComponent } from '../../../libs/app-loader/app-loader.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports:[
    CommonModule,
    NgbTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    NgSelectModule,
    InlineSVGModule,
    AddManageGroupsComponent,
    AppLoaderComponent
  ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent {
  dataSource: Groups[] = []
  displayedColumns: string[] = ['id', 'name', 'type'];
  searchTerm: string = '';
  showLoading:boolean = false;
  filteredData: any[] = [];
  // Pagination properties
  itemsPerPage: number = 5; // Adjust as needed
  currentPage: number = 1;
  totalPages: number;
  unsubscribe: Subscription[] = [];
  pageStyle:string[]=[
    "min-w-200px",
    "min-w-200px",
    "min-w-200px",
  ];
  noDataFound='';

  constructor(private modalService: NgbModal, private cdr: ChangeDetectorRef,private toastr: ToastrService,
    private inviteService:GroupsService) { }

 
  GetGroupList(): any {
    const invitorsSubscription = this.inviteService.GetGroupList().subscribe(
      (response: GroupsResponse) => {
        if(response.value?.length > 0) { 
          this.dataSource = response.value;
          this.noDataFound='';
          this.toastr.success(`Groups-details fetched Successfully!`, 'Success', {timeOut: 3000});
          this.filterData();
          this.showLoading = false;
          this.cdr.detectChanges();
        }else{
          this.showLoading = false;
          this.toastr.error("No records found.", 'Error', {timeOut: 3000});
          this.noDataFound='No records';
        }
      },
      (error) => {
        this.toastr.error(`Error While fetching Groups data!`, 'Error', {timeOut: 3000});
        console.error('Error:', error);
        this.showLoading = false;
      } 
    );
    this.unsubscribe.push(invitorsSubscription);
    }
  openAddGroupsModal(addVisitor: any) {
    this.modalService.open(addVisitor, {centered: true, backdrop: 'static', keyboard: false})
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }
  getGroupsDetails(){
    this.showLoading = true;
    this.GetGroupList();
   
  }

  onClickEmit(){
    this.filteredData=[];
    this.dataSource=[];
    this.getGroupsDetails()
  }
  ngOnInit(): void {
    this.filterData();
    this.GetGroupList()
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
