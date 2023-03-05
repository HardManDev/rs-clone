import { SortFilter } from '../enums/sortFilters';

export type CollectionRequestDto = {
  page?: number;
  limit?: number;
  sortBy: SortFilter;
};
