import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SelService {

  constructor(private http: HttpClient) { }

  getData(url: string){
    return this.http.get<any>(url);
  }

  getUploadData(url: string){
    //return this.http.get<Blob>(url);
    return this.http.get(url,{
      responseType: 'arraybuffer'} 
     )
  }

  sendData(url: string, data: any){
    return this.http.post<any>(url, data);
  }

  patchData(url: string, data: any){
    return this.http.patch<any>(url, data);
  }

  deleteData(url: string){
    return this.http.delete<any>(url);
  }
}
