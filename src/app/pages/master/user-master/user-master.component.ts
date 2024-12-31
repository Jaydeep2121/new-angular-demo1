import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { Subscription } from 'rxjs';
import { SCHOOL_DATA } from '../../../data/raw';
import { isControlInvalid } from '../../../helpers/_validators';
import { SharedModule } from '../../../modules/auth/helper/shared.module';
import { SchoolVisitService } from '../../admin/services/school-visit/school-visit.service';
import { UserMasterService } from '../services/user-master/user-master.service';
import { AddUserComponent } from './add-user/add-user.component';
import { AppLoaderComponent } from '../../../libs/app-loader/app-loader.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-master',
  standalone: true,
  imports: [SharedModule,InlineSVGModule, AddUserComponent,AppLoaderComponent],
  templateUrl: './user-master.component.html',
  styleUrl: './user-master.component.scss'
})
export class UserMasterComponent {

  InvitesForm: FormGroup;
  schoolvisit: any[] = SCHOOL_DATA;
  
  userForm: FormGroup;
  userList: any[] = [];
  unsubscribe: Subscription[] = [];
  filteredData: any[] = [];
  // Pagination properties
  itemsPerPage: number = 5; // Adjust as needed
  currentPage: number = 1;
  isEdit: boolean = false;
  totalPages: number;
  searchTerm: string = '';
  pageStyle:string[]=[
    "min-w-200px",
    "min-w-200px",
    "min-w-200px",
    "min-w-200px"];
  noDataFound='';
  showLoading=false;
  
  constructor(
    private userMasterService: UserMasterService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {

    }

    ngOnInit(): void {
      this.showLoading=true;
      this.getUserList();
    }

    getUserList() {
      const userList$ = this.userMasterService.GetUserMasterList().subscribe(
        (response) => {
          if(response.value?.length > 0) { 
          this.toastr.success(`Fetched UserMaster Data Successfully!`, 'Success', {timeOut: 3000});
            this.noDataFound='';
            this.showLoading = false;
          this.userList = response.value;
          this.filterData();
        }else{
          this.toastr.error(response.response.errorMessage, 'Error', {timeOut: 3000});
          this.showLoading = false;
          this.noDataFound='No records';
        }
        },
        (error) => {
        this.toastr.error(`Error While fetching UserMaster data!`, 'Error', {timeOut: 3000});
          this.showLoading = false;
          console.error('Error:', error);
        }
      );
      this.unsubscribe.push(userList$);
      
    }

  openAddUserModal(addUser: any,_isEdit: boolean) {
    this.isEdit = _isEdit;
    this.modalService.open(addUser, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });    
  }

  closeAddUserModal() {
    this.modalService.dismissAll();
  }

  isControlInvalidWrapper(controlName: string): boolean {
    return isControlInvalid(this.userForm.get(controlName)!);
  }

  applyFilter(): void {
    this.currentPage = 1; // Reset to the first page when applying a filter
    this.filterData();
  }

  filterData(): void {
    const filteredItems = this.userList.filter((row: any) =>
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
    return lastIndex > this.userList.length
      ? this.userList.length
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

  onUserAdd(event) {
    if (event) {
      this.getUserList();
      this.closeAddUserModal();
    }
  }

}
