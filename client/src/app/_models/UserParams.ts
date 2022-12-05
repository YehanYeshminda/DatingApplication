import { User } from './User';
export class UserParams {
  gender: string;
  minAge = 18;
  maxAge = 99;
  pageNumber = 1;
  pageSize = 3;
  orderBy = 'lastActive'

  // if a female then return male
  constructor(user: User){
    this.gender = user.gender === 'female' ? 'male' : 'female';
  }
}
