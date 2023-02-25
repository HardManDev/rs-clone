import {
  Controller,
  Get,
  Header,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { LeaderboardService } from './leaderboard.service';
import { CollectionRequestDto } from '../../types/dto/collectionDto';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  @Header('Access-Control-Expose-Headers', 'X-Total-Count')
  async get(
    @Query() query: CollectionRequestDto,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    const result = await this.leaderboardService.findAll(
      query.sortBy,
      query.page,
      query.limit,
    );

    res.header('X-Total-Count', result.totalCount.toString());
    res.status(HttpStatus.OK).send([...result.collection]);
  }
}
