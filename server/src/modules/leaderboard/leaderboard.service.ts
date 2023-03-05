import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Score } from '../../models/scheme/score.schema';
import { Model } from 'mongoose';
import { CollectionResponse } from '../../types/interfaces/collectionResponse';
import { IScore } from '../../types/interfaces/score';
import { SortFilter } from '../../types/enums/sortFilters';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(Score.name) private readonly scoreModel: Model<Score>,
  ) {}

  async findAll(
    sorter: SortFilter = SortFilter.DESCENDING,
    page = 1,
    limit = 100,
  ): Promise<CollectionResponse<IScore>> {
    const result = await this.scoreModel
      .find({})
      .sort({ score: sorter })
      .skip(limit * (page - 1))
      .limit(limit)
      .populate({
        path: 'user',
        select: '-password -createdAt',
      })
      .exec();

    return {
      totalCount: await this.scoreModel.count(),
      collection: result,
    };
  }
}
