import { NgForm } from '@angular/forms';
import { Message } from './../../_models/Message';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MessagesService } from 'src/app/_services/messages.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css'],
})
export class MemberMessagesComponent implements OnInit {

  @ViewChild('messageForm') messageForm?: NgForm;
  @Input() username?: string;
  @Input() messages: Message[] = [];
  messageContent = '';

  constructor(private messageService: MessagesService) {}

  ngOnInit(): void {}

  sendMessage() {
    if (!this.username) return;

    this.messageService
      .sendMessage(this.username, this.messageContent)
      .subscribe({
        next: (message) => {
          this.messages.push(message);
          this.messageForm?.reset();
        },
      });
  }
}
