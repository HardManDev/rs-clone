import { ConflictException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Score } from '../../models/scheme/score.schema';
import {
  CreateScoreRequestDto,
  CreateScoreResponseDto,
} from '../../types/dto/score/createScoreDto';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../../types/interfaces/user';
import { IScore } from '../../types/interfaces/score';
import { SortFilter } from '../../types/enums/sortFilters';
import { User } from '../../models/scheme/user.schema';
import { CollectionResponse } from '../../types/interfaces/collectionResponse';

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel(Score.name) private readonly scoreModel: Model<Score>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAllByUser(
    user: IUser,
    sorter: SortFilter = SortFilter.DESCENDING,
    page = 1,
    limit = 100,
  ): Promise<CollectionResponse<IScore>> {
    const result = await this.scoreModel
      .find({ user: user._id })
      .sort({ score: sorter })
      .skip(limit * (page - 1))
      .limit(limit)
      .exec();

    return {
      totalCount: await this.scoreModel.find({ user: user._id }).count(),
      collection: result,
    };
  }

  async create(score: CreateScoreRequestDto): Promise<CreateScoreResponseDto> {
    try {
      const newScore = await this.scoreModel.create(score);

      await newScore.save();

      return await newScore.populate({
        path: 'user',
        select: '-password -createdAt',
      });
    } catch (e) {
      throw new ConflictException(
        `Score '${score.score}' already exists for the user with id '${score.user._id}'`,
      );
    }
  }
}
