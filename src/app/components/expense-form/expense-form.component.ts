import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { ActivatedRoute, OutletContext, Router } from '@angular/router';
import Toastify from 'toastify-js';
@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss'],
})
export class ExpenseFormComponent implements OnInit {
  expenseForm: FormGroup = new FormGroup({
    type: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    amount: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    expense_date: new FormControl('', Validators.required),
  });
  expenseId?: number;

  constructor(private expenseService: ExpenseService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadDataIntoForm();
  }

    
  saveExpense(): void{


    if(this.expenseId){
      this.expenseService.updateExpense(this.expenseId, this.expenseForm.value).subscribe(expense =>{
        this.ShowSuccessToast("Gastos Actualizados Exitosamente")
        this.router.navigateByUrl('/gastos');
      })
    }else{
      this.expenseService.createExpense(this.expenseForm.value).subscribe(expense=>{
        this.ShowSuccessToast("Nuevo Regristo de Gatos Guardado Exitosamente")
        this.router.navigateByUrl('/gastos');
      });
    }
   
  }

  hasError(field: string): boolean{
    const errorObject = this.expenseForm.get(field)?.errors ??{};
    const errors = Object.keys(errorObject);

    if(errors.length && (this.expenseForm.get(field)?.touched || this.expenseForm.get(field)?.dirty)){
      return true ;
    }
    return false;
  }

  getCurrentError(field: string):string{
    const errorObject = this.expenseForm.get(field)?.errors ??{};
    const errors = Object.keys(errorObject);
    if(!errors){
      return '';
    }
    return errors[0];
  }

  getFormTitle(): string{
    return this.expenseId? 'Editar gastos': 'Nuevo Gasto';
  }

  private loadDataIntoForm(): void{
    this.expenseId = Number(this.route.snapshot.paramMap.get('id'));
    if(this.expenseId){
      this.expenseService.getExpense(this.expenseId).subscribe(expense => {
        this.expenseForm.patchValue(expense)
      })
    }
  }

  private ShowSuccessToast(message: string):void{
    Toastify({
      text: message,
      close: true,
      gravity: 'bottom',
      position: 'center',
      stopOnFocus: true,
      style:{
        background: "#189586"
      }
    }).showToast();
  }
}
