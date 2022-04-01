import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, BehaviorSubject, take, catchError, Subject, of } from 'rxjs';

export interface Currency {
  code: string;
  country: string;
}

export interface Currencies {
  currencies: Currency[]
}

export interface CurrencyDetail {
  currency: Currency;
  rates: number[]
}
@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {

  constructor(private http: HttpClient) { }
  currencyDetail$ = new BehaviorSubject<CurrencyDetail | null>(null);
  selectedCurrency$ = new BehaviorSubject<string | undefined>('');
  currencyDetailNotFound$ = new Subject<string>();

  getCurrencies(): Observable<Currency[]> {
    return this.http
      .get<Currencies>("assets/data/currencies.json")
      .pipe(
        map(({ currencies }) => currencies)
      );
  }

 

  getCurrencyDetail(currency: Currency): void {
    this.http
      .get<{ rates: number[] }>(`assets/data/${currency.code.toLowerCase()}.json`).pipe(
        map(
          ({ rates }) => rates),
        catchError(_ => (
          this.currencyDetailNotFound$.next(currency.code),
          of([])
        ))
        ).subscribe(
            data => {this.currencyDetail$.next({
            currency: currency,
            rates: data
        })
        
      });
  }

  
  
}
