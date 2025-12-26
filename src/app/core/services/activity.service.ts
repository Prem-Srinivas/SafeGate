import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity.model';
import { API_URL } from '../constants';

@Injectable({
    providedIn: 'root'
})
export class ActivityService {

    constructor(private http: HttpClient) { }

    logActivity(activity: Activity): Observable<any> {
        return this.http.post(`${API_URL}/activity-logs`, activity);
    }

    getActivities(type?: string, residentId?: number): Observable<Activity[]> {
        let params = new HttpParams();
        if (type) params = params.set('type', type);
        if (residentId) params = params.set('resident_id', residentId);

        return this.http.get<Activity[]>(`${API_URL}/activity-logs`, { params });
    }

    updateStatus(id: number, status: string): Observable<any> {
        return this.http.put(`${API_URL}/activity-logs/${id}`, { status });
    }
}
