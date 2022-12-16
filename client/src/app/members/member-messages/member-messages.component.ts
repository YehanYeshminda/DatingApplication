import { Message } from './../../_models/Message';
import { Component, Input, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/_services/messages.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() username?: string;
  @Input() messages: Message[] = [];

  constructor(private messageService: MessagesService) { }

  ngOnInit(): void {
  }

}
