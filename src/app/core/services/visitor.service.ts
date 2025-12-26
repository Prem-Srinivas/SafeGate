import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Visitor } from '../../shared/models/visitor.model';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private apiUrl = 'http://localhost:3000/visitors'; // backend endpoint

  constructor(private http: HttpClient) {}

  logVisitor(visitor: Visitor) {
    return this.http.post(this.apiUrl, visitor);
  }
}
