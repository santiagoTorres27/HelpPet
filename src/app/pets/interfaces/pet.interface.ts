import { Comment } from './comment.interface';

export interface Pet {
  id?: string;
  ownerId: string;
  name: string;
  description: string;
  kind: string;
  age: number;
  location: string;
  photoUrl: string;
  postDate: Date;
}
