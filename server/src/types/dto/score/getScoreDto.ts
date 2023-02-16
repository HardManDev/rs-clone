import { SortFilter } from '../../enums/sortFilters';

export type GetScoreRequestDto = {
  page?: number;
  limit?: number;
  sortBy: SortFilter;
};
