import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }
  getPokemons(){
    return this.http.get('assets/data/pokemon.json');
  }
  getGeinin(){
    return this.http.get('assets/data/geinin.json');
  }
}
