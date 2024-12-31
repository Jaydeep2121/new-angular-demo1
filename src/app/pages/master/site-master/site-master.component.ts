import { ChangeDetectorRef, Component } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2/lib_commonjs/inline-svg.module';
import { SharedModule } from '../../../modules/auth/helper/shared.module';
import { AppLoaderComponent } from '../../../libs/app-loader/app-loader.component';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddSiteMasterComponent } from './add-site-master/add-site-master.component';
import { SiteMasterService } from '../services/site-master/site-master.service';
import { getSiteMasterResponse } from '../services/site-master/site-master-model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-site-master',
  standalone: true,
  imports: [AppLoaderComponent,SharedModule,InlineSVGModule,AddSiteMasterComponent],
  templateUrl: './site-master.component.html',
  styleUrl: './site-master.component.scss'
})
export class SiteMasterComponent {
  dataSource:any[] = [];
  searchTerm: string = '';
  isEdit: boolean = false;
  filteredData: any[] =[]
  // Pagination properties
  itemsPerPage: number = 5; // Adjust as needed
  currentPage: number = 1;
  totalPages: number;
  showLoading:boolean = false;
  unsubscribe: Subscription[] = [];
  pageStyle:string[]=[
    'min-w-200px',
    'min-w-200px',
    'min-w-200px',];
  noDataFound='';


  constructor(
    private modalService: NgbModal,
    private schoolSiteServ:SiteMasterService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getSiteMasterDetails();
  }
  
  getSiteMasterDetails(){
    this.showLoading = true;
    this.getSiteMasterData();
  }

  getSiteMasterData(): any {
    const invitorsSubscription = this.schoolSiteServ.GetSiteMasterList().subscribe(
      (response:getSiteMasterResponse) => {
        if(response.value?.length > 0) { 
          this.dataSource = response.value;
          this.toastr.success(`Fetched SiteMaster Data Successfully!`, 'Success', {timeOut: 3000});
          this.noDataFound='';
          this.filterData();
          this.showLoading = false;
          this.cdr.detectChanges();
        }else{
          this.toastr.error(`No record found`, 'Error', {timeOut: 3000});
          this.showLoading = false;
          this.noDataFound='No records';
        }
      },
      (error) => {
        this.toastr.error(`Error While fetching SiteMaster data!`, 'Error', {timeOut: 3000});
        console.error('Error:', error);
        this.showLoading = false;
      } 
    );
    this.unsubscribe.push(invitorsSubscription);
  }

  onClickEmit(){
    this.filteredData=[];
    this.dataSource=[];
    this.getSiteMasterDetails();
  }

  openAddSiteModal(addSites: any,_isEdit: boolean) {
      this.isEdit = _isEdit;
      this.modalService.open(addSites, {
        centered: true,
        backdrop: 'static',
        keyboard: false,
      });
    }

    closeModal(): void {
      this.modalService.dismissAll();
    }
  
  applyFilter(): void {
    this.currentPage = 1; // Reset to the first page when applying a filter
    this.filterData();
  }

  filterData(): void {
    const filteredItems = this.dataSource?.filter((row) =>
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
    return lastIndex > this.dataSource.length ? this.dataSource.length : lastIndex;
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
