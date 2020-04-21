import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Comments} from '../../moduls/comments';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private httpClient: HttpClient) { }

  getComments(): Observable<Comments[]> {
    return this.httpClient.get<Comments[]>('/api/comments');
  }
}
