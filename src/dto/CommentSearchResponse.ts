import { CommentDto } from './comment.dto';

export interface CommentSearchResponse {
  comments: CommentDto[];
  source: string;
}
