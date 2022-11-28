import { MembersService } from './../../_services/members.service';
import { Photo } from './../../_models/Photo';
import { take } from 'rxjs/operators';
import { AccountService } from './../../_services/account.service';
import { User } from './../../_models/User';
import { environment } from './../../../environments/environment';
import { Member } from './../../_models/Member';
import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-edit-photo',
  templateUrl: './edit-photo.component.html',
  styleUrls: ['./edit-photo.component.css'],
})
export class EditPhotoComponent implements OnInit {
  @Input() member: Member | undefined;

  uploader: FileUploader | undefined;
  hasBaseDropZoneOver: false;
  baseUrl = environment.apiUrl;
  user: User | undefined;

  constructor(
    private accountService: AccountService,
    private memberService: MembersService
  ) {
    // getting user from the account service
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) this.user = user;
      },
    });
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  // setting the drop zone to the event
  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  // the config of the uploading item
  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true, // after upload we will remove it
      autoUpload: false, // users will have to click on the button to upload
      maxFileSize: 10 * 1024 * 1024, // 10mb
    });

    // without this we will have to config the cors
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member.photos.push(photo);
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: () => {
        if (this.user && this.member) {
          (this.user.photoUrl = photo.url),
            this.accountService.setCurrentUser(this.user);
            this.member.photoUrl = photo.url;
          this.member.photos.forEach((p) => {
            if (p.isMain) p.isMain = false;

            if (p.id === photo.id) p.isMain = true;
          });
        }
      },
    });
  }

  deletePhoto(photoId: number){
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        if (this.member) {
          this.member.photos = this.member.photos.filter(x => x.id !== photoId) // we return all the photos except the whole which matches the id
        }
      }
    })
  }
}
