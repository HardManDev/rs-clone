import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  Header,
} from '@nestjs/common';
import { ScoreService } from './score.service';
import {
  CreateScoreRequestDto,
  CreateScoreResponseDto,
} from '../../types/dto/score/createScoreDto';
import { JwtAuthGuard } from '../../guards/jwtAuth.guard';
import { AuthorizedRequest } from '../../types/authorizedRequest';
import { Response as ExpressResponse } from 'express';
import { CollectionRequestDto } from '../../types/dto/collectionDto';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get()
  @Header('Access-Control-Expose-Headers', 'X-Total-Count')
  @UseGuards(JwtAuthGuard)
  async get(
    @Req() req: AuthorizedRequest,
    @Query() query: CollectionRequestDto,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    const result = await this.scoreService.findAllByUser(
      req.user,
      query.sortBy,
      query.page,
      query.limit,
    );

    res.header('X-Total-Count', result.totalCount.toString());
    res.status(HttpStatus.OK).send([...result.collection]);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: AuthorizedRequest,
    @Body() score: Omit<CreateScoreRequestDto, 'user'>,
  ): Promise<CreateScoreResponseDto> {
    return await this.scoreService.create({
      ...score,
      user: req.user,
    });
  }
}
