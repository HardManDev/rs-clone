export interface CollectionResponse<TCollection> {
  totalCount: number;
  collection: Array<TCollection>;
}
