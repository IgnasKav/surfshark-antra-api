import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { CommentDto } from './dto/comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CommentSearchResponse } from './dto/CommentSearchResponse';

@Injectable()
export class AppService {
  apiKey = 'AIzaSyBxYuoIV1oS_bsnZrCvtZckJ1kQ-q3Vhik';
  apiUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(
    private readonly axios: HttpService,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async getVideoComments(videoId: string): Promise<CommentSearchResponse> {
    let comments = await this.commentRepository.find({
      where: { videoId: videoId },
    });
    let source = 'Database';

    if (comments.length === 0) {
      comments = await this.getFromYoutubeAPI(videoId);
      source = 'Youtube API';
      await this.commentRepository.save(comments);
    } else {
      const updateDate = comments[0].updateDate;
      const currentDate = new Date();
      const difference = currentDate.getTime() - updateDate.getTime();

      if (difference > 1000 * 3600 * 24) {
        await this.commentRepository.remove(comments);
        comments = await this.getFromYoutubeAPI(videoId);
        source = 'Youtube API';
        await this.commentRepository.save(comments);
      }
    }

    const commentsDto = comments.map((c) => CommentDto.fromEntity(c));
    return {
      source: source,
      comments: commentsDto,
    };
  }

  async getFromYoutubeAPI(videoId: string): Promise<CommentEntity[]> {
    const url = `${this.apiUrl}/commentThreads?part=snippet&maxResults=20&order=relevance&videoId=${videoId}&key=${this.apiKey}`;
    const request = this.axios.get(url).pipe(
      catchError(() => {
        throw new NotFoundException(`Could not find video with id: ${videoId}`);
      }),
      map((response) => response.data.items),
      map((items) => {
        return items.map((item) => {
          const updateDate = new Date();
          const { snippet: firstSnippet } = item;
          const { videoId, topLevelComment } = firstSnippet;
          const { snippet: secondSnippet } = topLevelComment;
          const {
            authorDisplayName,
            authorProfileImageUrl,
            textDisplay,
            publishedAt,
            likeCount,
          } = secondSnippet;

          const comment: CommentEntity = {
            id: uuid(),
            videoId: videoId,
            userName: authorDisplayName,
            imageUrl: authorProfileImageUrl,
            comment: textDisplay,
            postedAt: new Date(publishedAt),
            numberOfLikes: likeCount,
            updateDate: updateDate,
          };
          return comment;
        });
      }),
    );

    return firstValueFrom(request);
  }
}
