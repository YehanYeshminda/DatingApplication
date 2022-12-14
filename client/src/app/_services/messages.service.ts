import { Message } from './../_models/Message';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelp';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  baseUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }

  getMessages(pageNumber: number, pageSize: number, container: string){
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<Message[]>(this.baseUrl + "message", params, this.http);
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(this.baseUrl + "message/thread/" + username);
  }

  sendMessage(username: string, content: string){
    return this.http.post<Message>(this.baseUrl + 'message', {recipientUsername: username, content})
  }

  deleteMessage(id: number){
    return this.http.delete(this.baseUrl + 'message/'+ id);
  }
}
