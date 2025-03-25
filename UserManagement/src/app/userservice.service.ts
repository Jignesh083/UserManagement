
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {
  
  private userUpdatedSubject = new BehaviorSubject<boolean>(false); // Define BehaviorSubject

  private userUpdated = new BehaviorSubject<boolean>(false);

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  registerUser(user: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, user, {
          headers: new HttpHeaders({
          })
        });
      }

  getAllUsers(): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>('http://localhost:8080/api/users/all', { headers });
  }

  getUserById(userId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`http://localhost:8080/api/users/${userId}`, { headers });
  }


  updateUser(userId: number, formData: FormData): Observable<any> {
  
    // Retrieve token from localStorage
    const token = localStorage.getItem('authToken');
    console.log("Retrieved Token from LocalStorage:", token);

    // Ensure token is valid before adding it to headers
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();

    console.log("Headers being sent:", headers.get('Authorization')); 

    return this.http.put(`http://localhost:8080/api/users/update/${userId}`, formData, { headers }).pipe(
      tap(() => {
        this.userUpdatedSubject.next(true);
      })
    );
}


  deleteUser(userId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`http://localhost:8080/api/users/delete/${userId}`, { headers });
  }

  notifyUserUpdated() {
    this.userUpdated.next(true);
  }

  userUpdatedObservable(): Observable<boolean> {
    return this.userUpdated.asObservable();
  }
}

