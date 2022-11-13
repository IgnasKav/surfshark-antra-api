import { IsString } from 'class-validator';

export class CommentSearchRequest {
  @IsString()
  videoId: string;
}
