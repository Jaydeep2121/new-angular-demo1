import { ChangeDetectorRef, Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../modules/auth/helper/shared.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AddInvitesComponent } from './add-invites/add-invites.component';
import { inviteData, inviteResponse, invites } from '../services/invites/invites.model';
import { Subscription } from 'rxjs';
import { InviteService } from '../services/invites/invite.service';
import { locationResponse } from '../services/visitors/visitor.model';
import { AppLoaderComponent } from '../../../libs/app-loader/app-loader.component';
import { VisitorService } from '../services/visitors/visitor.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invites',
  standalone: true,
  imports: [SharedModule,InlineSVGModule,AddInvitesComponent,AppLoaderComponent],
  templateUrl: './invites.component.html',
  styleUrl: './invites.component.scss'
})
export class InvitesComponent {
  dataSource:inviteData[] = [];
  searchTerm: string = '';
  isEdit: boolean = false;
  invitesData: any;
  filteredData: any[] =[]
  countriesData: any;
  // Pagination properties
  itemsPerPage: number = 5; // Adjust as needed
  currentPage: number = 1;
  totalPages: number;
  showLoading:boolean = false;
  unsubscribe: Subscription[] = [];
  hostlistData: any[]=[];
  pageStyle:string[]=[
    'min-w-200px',
    'min-w-200px',
    'min-w-200px',
    'min-w-200px',
    'min-w-200px',
    'min-w-200px',
    'min-w-200px',
    'min-w-200px',
    'min-w-200px',
    'min-w-200px',
    'min-w-200px',
    'min-w-200px',
    'min-w-200px',
    'min-w-200px',
    'min-w-100px'];
  noDataFound='';


  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private inviteService:InviteService,
    private visitorService:VisitorService,
    private toastr: ToastrService,) {}

  ngOnInit(): void {
    this.getInvitorsDetails();
  }
  
  getInvitorsDetails(){
    this.showLoading = true;
    this.getHostDrop();
    this.getLocationsData();
    this.getInvitorData();
  }

  getHostDrop(): any {
    const hostList = this.inviteService.getHostList().subscribe(
      (response) => {
        this.hostlistData = response.value;
       },
      (error) => {
        console.error('Error:', error);
      }
    );
    this.unsubscribe.push(hostList);
  }
  getHostName(hostId: number): string {
    const host = this.hostlistData.find((h: any) => h.value == hostId);
    return host ? host.text : '';
  }
  clearAutofill() {
    this.searchTerm = ''; 
  }

  getInvitorData(): any {
    const invitorsSubscription = this.inviteService.GetInvitorDetails().subscribe(
      (response) => {
        if(response.value?.length > 0) { 
          this.noDataFound='';
          this.dataSource = response.value;
          this.dataSource = this.dataSource.map((x: any) => {
            return {
              ...x,
              countryName: this.getCountryName(x.country),
              stateName: this.getStateName(x.state),
              cityName: this.getCityName(x.city),
              hostName:this.getHostName(x.host)
            }
          })
          this.toastr.success(`Fetched Invited Data Successfully!`, 'Success', {timeOut: 3000});
          this.filterData();
          this.showLoading = false;
          this.cdr.detectChanges();
        }else{
          this.showLoading = false;
          this.noDataFound='No records';
          this.toastr.error("No records found.", 'Error', {timeOut: 3000});
        }
      },
      (error) => {
        this.toastr.error(`Error While fetching Invited data!`, 'Error', {timeOut: 3000});
        console.error('Error:', error);
        this.showLoading = false;
      } 
    );
    this.unsubscribe.push(invitorsSubscription);
  }

  getLocationsData(): void {
    const invitorLocationsSubscription=this.visitorService.countryList.subscribe(
      (response:locationResponse["value"]) => {
        this.countriesData = response;
      },
      (error) => {
        console.error('Error:', error);
      } 
    );
    this.unsubscribe.push(invitorLocationsSubscription);
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
    this.getInvitorsDetails();
  }

  openAddInviteModal(addInvites: any,_isEdit: boolean,data?: invites) {
      this.isEdit = _isEdit;
      this.modalService.open(addInvites, {
        centered: true,
        backdrop: 'static',
        keyboard: false,
      });
      this.invitesData = { ...data, isEdit: this.isEdit };
      
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
