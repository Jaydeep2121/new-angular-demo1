import { Component } from '@angular/core';
import { NgbModal, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MANAGEGATES_DATA } from '../../../data/raw';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgSelectModule } from '@ng-select/ng-select';
import { manageGates } from '../services/manage-gates/manage-gates.model';
import { AddManageGatesComponent } from './add-manage-gates/add-manage-gates.component';


@Component({
  selector: 'app-manage-gates',
  standalone: true,
  imports:[
    CommonModule,
    NgbTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    InlineSVGModule,
    NgSelectModule,
    AddManageGatesComponent
  ],
  templateUrl: './manage-gates.component.html',
  styleUrl: './manage-gates.component.scss'
})
export class ManageGatesComponent {
  dataSource: manageGates[] = MANAGEGATES_DATA
  displayedColumns: string[] = ['id', 'name', 'type'];
  searchTerm: string = '';

  filteredData: any[] = [];
  // Pagination properties
  itemsPerPage: number = 5; // Adjust as needed
  currentPage: number = 1;
  totalPages: number;
  constructor(private modalService: NgbModal) { }

  openAddManageGatesModal(addVisitor: any) {
    this.modalService.open(addVisitor, {centered: true, backdrop: 'static', keyboard: false})
  }

  closeModal(): void {
    this.modalService.dismissAll();
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
