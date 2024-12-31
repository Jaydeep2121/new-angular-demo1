import { Component } from '@angular/core';
import { NgbModal, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { WATCHLIST_DATA } from '../../../data/raw';
import { WatchList } from '../services/watchlist/watchlist.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgSelectModule } from '@ng-select/ng-select';
import { WatchlistService } from '../services/watchlist/watchlist.service';
import { Subscription } from 'rxjs';
import { VisitorService } from '../services/visitors/visitor.service';
import { AppLoaderComponent } from '../../../libs/app-loader/app-loader.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-watch-list',
  standalone:true,
  imports:[
    CommonModule,
    NgbTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    InlineSVGModule,
    NgSelectModule,
    AppLoaderComponent
  ],
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.scss']
})
export class WatchListComponent {
  displayedColumns: string[] = ['name', 'phone', 'email', 'address', 'city', 'state','country','blockedEntry','vip','remarks'];
  searchTerm: string = ''
  WatchListData : any[]=[];
  unsubscribe: Subscription[] = [];
  filteredData: any[] =[]
  // Pagination properties
  itemsPerPage: number = 5; // Adjust as needed
  currentPage: number = 1;
  totalPages: number;
  pageStyle:string[]=[
    "min-w-200px",
    "min-w-200px",
    "min-w-50px"];
  showLoading:boolean = false;
  noDataFound='';

  constructor(private modalService: NgbModal, private visitorService:VisitorService,private toastr: ToastrService,) { }
  
  openAddWatchListModal(addWatchList: any) {
    this.modalService.open(addWatchList, {centered: true, backdrop: 'static', keyboard: false})
  }

  ngOnInit(): void {
    this.showLoading=true;
    this.getetWatchlist()
  }

  getetWatchlist(): any {
    const hostList = this.visitorService.GetWatchlist().subscribe(
      (response) => {
        if(response.value?.length > 0) { 
          this.noDataFound='';
          this.WatchListData = response.value; 
          this.toastr.success(`Fetched Watch-list Data Successfully!`, 'Success', {timeOut: 3000});
          this.filterData();
          this.showLoading =false;
        }else{
          this.showLoading = false;
          this.noDataFound='No records';
        }
      },
      (error) => {
        this.toastr.error(`Error While fetching Watch-list data!`, 'Error', {timeOut: 3000});
        this.showLoading = false;
        console.error('Error:', error);
      }
    );
    this.unsubscribe.push(hostList);
  }
  clearAutofill() {
    this.searchTerm = ''; 
  }

  applyFilter(): void {
    this.currentPage = 1; // Reset to the first page when applying a filter
    this.filterData();
  }

  filterData(): void {
    const filteredItems = this.WatchListData.filter((row) =>
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
    return lastIndex > (this.filteredData?.length ?? this.displayedColumns?.length)
      ? (this.filteredData?.length ?? this.displayedColumns?.length)*this.currentPage
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
