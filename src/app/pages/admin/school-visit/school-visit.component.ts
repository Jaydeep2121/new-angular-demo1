import { Component, NgModule } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InviteService } from '../services/invites/invite.service';
import { Subscription } from 'rxjs';
import { SchoolVisitService } from '../services/school-visit/school-visit.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { isControlInvalid } from '../../../helpers/_validators';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from '../../../modules/auth/helper/shared.module';
import { SCHOOL_DATA } from '../../../data/raw';
import { AddSchoolsComponent} from './add-schools/add-schools.component'
import { AppLoaderComponent } from '../../../libs/app-loader/app-loader.component';

@Component({
  selector: 'app-school-visit',
  standalone: true,
  imports: [CommonModule,SharedModule,InlineSVGModule,AddSchoolsComponent,AppLoaderComponent],
  templateUrl: './school-visit.component.html',
  styleUrl: './school-visit.component.scss'
})
export class SchoolVisitComponent {
  InvitesForm: FormGroup;
  unsubscribe: Subscription[] = [];
  schoolvisit: any[] = [];
  filteredData: any[] = [];
  // Pagination properties
  itemsPerPage: number = 5; // Adjust as needed
  currentPage: number = 1;
  isEdit: boolean = false;
  totalPages: number;
  searchTerm: string = '';
  showLoading:boolean = false;
  noDataFound='';
  pageStyle:string[]=[
    "min-w-200px",
    "min-w-200px",
    "min-w-200px",
    "min-w-200px"];


  constructor(
    private schoolService:SchoolVisitService,private modalService: NgbModal,) {

    }

    ngOnInit(): void {
      this.showLoading=true;
      this.getschoolService();
    }

    getschoolService(): any {
    const hostList = this.schoolService.GetSchoolDetails().subscribe(
      (response) => {
        console.log(response,"res");
        if(response.value?.length > 0) { 
          this.noDataFound='';
          this.showLoading = false;
          console.log('response', response.value);
          
          this.schoolvisit = response.value.map((item: any) => ({
            ...item,
            isWhatsappRequired: item.isWhatsappRequired || false, 
            isSmsrequired: item.isSmsrequired || false 
          }));
          this.filterData();
        }else{
          this.showLoading = false;
          this.noDataFound='No records';
        }
        
      },
      (error) => {
        this.showLoading = false
        console.error('Error:', error);
      }
    );
    this.unsubscribe.push(hostList);
  }

  UpdateSchool(id:any,SMS:boolean,isApproval: boolean, Whatsapp:boolean): any {
    const UpdateData = this.schoolService.UpdateSchoolDetails(id,SMS,isApproval,Whatsapp).subscribe(
      (response) => {
        console.log(response,"res");
        
        // this.schoolvisit = response.value.map((item: any) => ({
        //   ...item,
        //   isWhatsappRequired: item.isWhatsappRequired || false, 
        //   isSmsrequired: item.isSmsrequired || false 
        // }));
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    this.unsubscribe.push(UpdateData);
  }
// 
  openAddSchoolModal(addInvites: any,_isEdit: boolean) {
    this.isEdit = _isEdit;
    this.modalService.open(addInvites, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    // this.invitesData = { ...data, isEdit: this.isEdit };
    
  }

  isControlInvalidWrapper(controlName: string): boolean {
    return isControlInvalid(this.InvitesForm.get(controlName)!);
  }
  applyFilter(): void {
    this.currentPage = 1; // Reset to the first page when applying a filter
    this.filterData();
  }

  filterData(): void {
    console.log("this.school visit", this.schoolvisit);
    console.log("searching term", this.searchTerm);
    
    const filteredItems = this.schoolvisit.filter((row: any) =>
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
    return lastIndex > this.schoolvisit.length
      ? this.schoolvisit.length
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
