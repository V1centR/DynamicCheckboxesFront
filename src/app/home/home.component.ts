import { Component } from '@angular/core';
import { CheckboxService } from '../service/checkbox-service';
import { of } from 'rxjs';
import { CheckedModel } from '../model/checked-model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


  checked:any = false;
  colorBoxes:string = "primary";
  checkBoxes:any[] = [];
  idTransaction:number;
  submitButtomDisabled:boolean = false;
  progressBar:boolean = false;


  constructor(private service: CheckboxService) {} 

  ngOnInit() {
    this.checked = true;
    this.getCheckboxes();
  }


//CheckBox test ################
getCheckboxes(){

  of(this.service.getCheckboxes()).subscribe({

    next: (data) => {
     data.subscribe(items => {
      let options = items;

      //GET selected items#####
      //###############################################
      of(this.service.getChecked()).subscribe({
          next: (selectedData) => {
            selectedData.subscribe(selected => {
            let selectedOptions = selected;
            //Call function filter/setup true false checkboxes
            let listaResultado = this.intersectCheckboxes(options, selectedOptions);
            this.checkBoxes = listaResultado;
          });
          
          },
          error: (e) => console.error(e),
          complete: () => {

          } 
        });
      //#######################
     });
    },
    error: (e) => console.error(e),
    complete: () => {

    }
  });
}

intersectCheckboxes(listaOriginal: any[], listaComparacao: any[]): any[] {

  let mapData = listaOriginal.map(obj => obj.optionsList);
  this.idTransaction = listaComparacao[0].id;

  return mapData.map(item => {
      const estaNaListaComparacao = listaComparacao[0].checked.split(":").includes(item);
      return {item, checked: estaNaListaComparacao };
  });
}  

//Submit Data to microservice
async onSubmit(){

    let mapData = this.checkBoxes.filter(item => item.checked).map(obj => obj.item);

    let selectedItems = new CheckedModel();
    selectedItems.id = this.idTransaction;
    selectedItems.checked = mapData.join(":");

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    await this.service.postCheckedOptions(selectedItems).subscribe({next: (data) => {

      this.progressBar = true;
      this.submitButtomDisabled = true;
      
    },error: (e) => {}, 
      complete:()=>{

      this.progressBar = false;
      //to prevent sequencial and double click
      sleep(1000); 
      this.submitButtomDisabled = false;
    }
    });
  }

}
