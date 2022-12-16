import { Pagination } from './../_models/Pagination';
import { Message } from './../_models/Message';
import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../_services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[] | undefined;
  pagination: Pagination | undefined;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  constructor(private messageService: MessagesService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(){
    this.loading = true;

    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe({
      next : (res) => {
        this.messages = res.result;
        this.pagination = res.pagination;
        this.loading = false;
      }
    })
  }

  deleteMessage(id: number){
    this.messageService.deleteMessage(id).subscribe({
      next : () => this.messages.splice(this.messages.findIndex(m => m.id === id), 1)
    })
  }

  pageChanged(event:any){
    if (this.pageNumber != event.page){
      this.pageNumber = event.page;
      this.pagination = event.pagination;
    }
  }
}
