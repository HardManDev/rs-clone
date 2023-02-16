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
} from '@nestjs/common';
import { ScoreService } from './score.service';
import {
  CreateScoreRequestDto,
  CreateScoreResponseDto,
} from '../../types/dto/score/createScoreDto';
import { JwtAuthGuard } from '../../guards/jwtAuth.guard';
import { AuthorizedRequest } from '../../types/authorizedRequest';
import { GetScoreRequestDto } from '../../types/dto/score/getScoreDto';
import { Response as ExpressResponse } from 'express';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async get(
    @Req() req: AuthorizedRequest,
    @Query() query: GetScoreRequestDto,
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
