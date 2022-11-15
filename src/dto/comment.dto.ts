import { CommentEntity } from '../entities/comment.entity';

export class CommentDto {
  id: string;

  videoId: string;

  userName: string;

  imageUrl: string;

  comment: string;

  postedAt: Date;

  numberOfLikes: number;

  static fromEntity(comment: CommentEntity): CommentDto {
    const dto: CommentDto = {
      id: comment.id,
      videoId: comment.videoId,
      userName: comment.userName,
      imageUrl: comment.imageUrl,
      comment: comment.comment,
      postedAt: comment.postedAt,
      numberOfLikes: comment.numberOfLikes,
    };

    return dto;
  }
}
