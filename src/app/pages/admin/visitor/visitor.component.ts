import { ChangeDetectorRef, Component } from '@angular/core';
import { SharedModule } from '../../../modules/auth/helper/shared.module';
import { AddVisitorComponent } from './components/add-visitor/add-visitor.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { Visitor, visitor, visitorResponse } from '../services/visitors/visitor.model';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { VisitorService } from '../services/visitors/visitor.service';
import { AppLoaderComponent } from '../../../libs/app-loader/app-loader.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-visitor',
  standalone: true,
  imports: [SharedModule,AddVisitorComponent,AppLoaderComponent,InlineSVGModule],
  templateUrl: './visitor.component.html',
  styleUrl: './visitor.component.scss'
})
export class VisitorComponent {
  dataSource: Visitor[] = [];
  displayedColumns: string[] = ['name', 'phone', 'email', 'address','city','state','country','blockedEntry','vipEntry'];
  searchTerm: string = '';
  isEdit: boolean = false;
  visitorData: any;
  countriesData: any;
  filteredData: any[] = [];
  // Pagination properties
  itemsPerPage: number = 5; // Adjust as needed
  currentPage: number = 1;
  totalPages: number;
  receivedNoOfVisitorData: boolean;
  visitorSubscription$:Subscription;
  showLoading:boolean = false;
  visitorLocationsSubscription$:Subscription
  pageStyle:string[]=[
    "min-w-200px",
    "min-w-200px",
    "min-w-200px",
    "min-w-200px",
    "min-w-100px",
    "min-w-100px",
    "min-w-100px",
    "min-w-100px",
    "min-w-100px",
    "min-w-100px",
    "min-w-50px"];
  noDataFound='';
  errorMessage:string = ''
    
  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private visitorService:VisitorService,
    private cdr: ChangeDetectorRef,
    public toastr: ToastrService) {}

  openAddVisitorModal(addVisitor: any,_isEdit: boolean,data?: visitor) {
    this.isEdit = _isEdit;
    this.modalService.open(addVisitor, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    this.visitorData = { ...data, isEdit: this.isEdit };
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  ngAfterContentChecked() {
    this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
      this.receivedNoOfVisitorData = !!params['noOfVisitor'];
    });
  }

  ngOnInit(): void {
    this.getVisitorsDetails();
  }
  handleImageError(event: any) {
    event.target.src = '../../../../assets/media/svg/avatars/blank.svg';
  }
  getVisitorsDetails(){
    this.showLoading = true;
    this.getLocationsData();
    this.getVisitorData();
  }

  getVisitorData(): any {
    this.visitorSubscription$ = this.visitorService.getVisitorDetails().subscribe(
      (response) => {
        
        if(response.value?.length > 0) { 
          this.noDataFound='';
          this.dataSource = response.value;
          this.dataSource = this.dataSource.map((x: any) => {
            return {
              ...x,
              countryName: this.getCountryName(x.country),
              stateName: this.getStateName(x.state),
              cityName: this.getCityName(x.city)
            }
          })
          this.filterData();
          this.toastr.success(`Fetched visitor Data Successfully!`, 'Success', {timeOut: 3000});
          this.showLoading = false;
          this.cdr.detectChanges();
        }else{
          this.errorMessage = response.response?.errorMessage
          this.toastr.error(this.errorMessage, 'Error', {timeOut: 3000});
          this.showLoading = false;
          this.noDataFound='No records';
        }
      },
      (error) => {
        // Handle error
        this.toastr.error(`Error While fetching visitor data!`, 'Error', {timeOut: 3000});
        console.error('Error:', error);
        this.showLoading = false;
      } 
    );
  }

  getLocationsData(): void {
    this.visitorLocationsSubscription$=this.visitorService.countryList.subscribe(
      (response:any) => {
        this.countriesData = response;
      },
      (error) => {
        console.error('Error:', error);
      } 
    );
  }
  getCountryName(countryId: number): string {
    const country = this.countriesData.find((c:any) => c.id === countryId);
    return country ? country.name : '';
  }

  getStateName(stateId: number): string {
    const state = this.countriesData.reduce((acc:any, cur:any) => [...acc, ...cur.states], []).find(s => s.id === stateId);
    return state ? state.name : '';
  }

  getCityName(cityId: number): string {
    const city = this.countriesData.reduce((acc:any, cur:any) => [...acc, ...cur.states], []).reduce((acc, cur) => [...acc, ...cur.cities], []).find(c => c.id === cityId);
    return city ? city.name : '';
  }

  onClickEmit(){
    this.filteredData=[];
    this.dataSource=[];
    this.getVisitorsDetails();
  }

  applyFilter(): void {
    this.currentPage = 1; // Reset to the first page when applying a filter
    this.filterData();
  }

  filterData(): void {
    const filteredItems = this.dataSource?.filter((row: any) =>
      Object.values(row).some(
        (value) =>
          value &&
          typeof value === 'string' &&
          value.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );

    // Apply pagination
    this.totalPages = Math.ceil(filteredItems?.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredData = filteredItems?.slice(
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

  ngOnDestroy(): void{
    if(this.visitorSubscription$){
      this.visitorSubscription$.unsubscribe();
    }
    if(this.visitorLocationsSubscription$){
      this.visitorLocationsSubscription$.unsubscribe();
    }
  }
}
