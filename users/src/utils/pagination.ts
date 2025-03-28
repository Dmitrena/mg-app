import { Document, FilterQuery, Model } from 'mongoose';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

export const paginate = async <T extends Document>(
  model: Model<T>,
  query: FilterQuery<T> = {},
  options: PaginationOptions
): Promise<PaginatedResult<T>> => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const [data, totalItems] = await Promise.all([
    model.find(query).skip(skip).limit(limit).exec(),
    model.countDocuments(query).exec(),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      totalPages,
      totalItems,
    },
  };
};
