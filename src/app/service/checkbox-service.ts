import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CheckedModel } from "../model/checked-model";

@Injectable({
    providedIn: 'root'
  })
export class CheckboxService {

    HOST_MS:string = "http://localhost:8080/checkbox";

    constructor(private http: HttpClient) { }

    getCheckboxes(){
        return this.http.get<any[]>(`${this.HOST_MS}/all-options`);
    }
    
    getChecked(){
        return this.http.get<any[]>(`${this.HOST_MS}/all-selected`);
    }

    postCheckedOptions(data:CheckedModel){
        return this.http.post<CheckedModel[]>(`${this.HOST_MS}/save`,data);
    }

}
