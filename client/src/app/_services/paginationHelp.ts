import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaginatedResults } from "../_models/Pagination";

export function getPaginatedResult<T>(url: string, params: HttpParams, http:HttpClient) {
    const paginatedResults: PaginatedResults<T> = new PaginatedResults<T>();

    return http.get<T>(url, { observe: 'response', params }).pipe(
      map((response) => {
        paginatedResults.result = response.body;
        if (response.body) {
        }

        // this will be the header which we will get
        const pagination = response.headers.get('Pagination');

        if (pagination) {
          paginatedResults.pagination = JSON.parse(pagination);
        }

        return paginatedResults;
      })
    );
  }

export function getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams(); // allows to set params in the url

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    return params;
  }
