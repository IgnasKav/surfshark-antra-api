import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CommentSearchRequest } from './dto/CommentSearchRequest';
import { CommentSearchResponse } from './dto/CommentSearchResponse';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  getVideoComments(
    @Body() request: CommentSearchRequest,
  ): Promise<CommentSearchResponse> {
    return this.appService.getVideoComments(request.videoId);
  }
}
