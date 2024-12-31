import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { userInfo } from '../services/user-info/user-info.model';
import { USER_INFO } from '../../../data/raw';
import { SharedModule } from '../../../modules/auth/helper/shared.module';
import { AppLoaderComponent } from '../../../libs/app-loader/app-loader.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AddUserInfoComponent } from './add-user-info/add-user-info.component';

@Component({
  selector: 'app-userinfo',
  standalone: true,
  imports: [SharedModule,AddUserInfoComponent,AppLoaderComponent,InlineSVGModule],
  templateUrl: './userinfo.component.html',
  styleUrl: './userinfo.component.scss'
})
export class UserinfoComponent {
  dataSource: userInfo[] = USER_INFO
  displayedColumns: string[] = ['image', 'id', 'firstname', 'middlename', 'lastname', 'mobileNo', 'address', 'city', 'state', 'role', 'active'];
  searchTerm: string = '';
  isEdit: boolean = false;
  userInfoData: any;
  filteredData: any[] = [];
  // Pagination properties
  itemsPerPage: number = 5; // Adjust as needed
  currentPage: number = 1;
  totalPages: number;
  constructor(private modalService: NgbModal) { }

  openUserInfoModal(addVisitor: any, _isEdit: boolean, data?: userInfo) {
    this.isEdit = _isEdit;
    this.modalService.open(addVisitor, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    this.userInfoData = { ...data, isEdit: this.isEdit };
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }
  onEditform(addUserInfo: any, userinfoData: userInfo) {
    this.isEdit = true;
    this.openUserInfoModal(addUserInfo, true, userinfoData);
  }


  ngOnInit(): void {
    this.filterData();
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
