import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Database, ref, set } from '@angular/fire/database';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Comment } from '../interfaces/comment.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private http: HttpClient) {}

  addCommentByPet(petId: string, comment: Comment) {
    return this.http.post(
      `https://tfg-daw-default-rtdb.europe-west1.firebasedatabase.app/pets/${petId}.json`,
      comment
    );
  }

  /*   getPetComments(petId: string) {
    searchParams = searchParams.append('custom', 'key');

    return this.http
      .get(
        `https://tfg-daw-default-rtdb.europe-west1.firebasedatabase.app/pets/${petId}.json`
      )
      .pipe(
        map((res) => {
          const comments: Comment[] = [];
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              comments.push({ ...res[key], id: key });
            }
          }
        })
      );
  } */

  fetchPosts(id: string) {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');

    return this.http
      .get<Comment[]>(
        `https://tfg-daw-default-rtdb.europe-west1.firebasedatabase.app/pets/${id}.json`,
        {
          headers: new HttpHeaders({
            'Custom-header': 'Hello',
          }),
          params: searchParams,
        }
      )
      .pipe(
        map((responseData) => {
          const postArray: Comment[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key] });
            }
          }
          return postArray;
        }),
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }
}
