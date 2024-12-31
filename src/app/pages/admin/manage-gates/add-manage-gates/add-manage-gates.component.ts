import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { isControlInvalid } from '../../../../helpers/_validators';
import { SharedModule } from '../../../../modules/auth/helper/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-manage-gates',
  standalone:true,
  imports:[
    SharedModule,
    NgbModalModule,
    NgSelectModule,],
  templateUrl: './add-manage-gates.component.html',
  styleUrls: ['./add-manage-gates.component.scss'],
})
export class AddManageGatesComponent implements OnInit{
  gateTypeList: any = ["main","other"];

  manageGateForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    gateType:[null, Validators.required]
  });
  
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
  }

  isControlInvalidWrapper(controlName: string): boolean {
    return isControlInvalid(this.manageGateForm.get(controlName)!);
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  submit(): void {
    if (!this.manageGateForm.valid) {
      return;
    }
  
    const payload = {
      ...this.manageGateForm.value,
    };
  
    console.log('FormValues', payload);
    this.manageGateForm.reset();
  }
}
