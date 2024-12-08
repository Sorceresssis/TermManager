import request from '@/utils/request';

class TagApi {
  public static getSecondCategoryWithTags<
    R = DTO.ResponseResult<VO.SecondCategoryWithTags[]>,
    T = DTO.ResponseResult<VO.SecondCategoryWithTags[]>
  >(topCategoryId: number) {
    return request.get<R, T>(`/tag/all/${topCategoryId}`);
  }

  public static getTagsByKeyword<
    R = DTO.ResponseResult<VO.TagWithCategory[]>,
    T = DTO.ResponseResult<VO.TagWithCategory[]>
  >(keyword: string) {
    return request.get<R, T>('/tag/search', {
      params: {
        keyword,
      },
    });
  }

  public static create<
    R = DTO.ResponseResult<VO.Tag | undefined>,
    T = DTO.ResponseResult<VO.Tag | undefined>
  >(tag: FormData) {
    return request.post<R, T>('/tag', tag, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  public static edit<
    R = DTO.ResponseResult<null>,
    T = DTO.ResponseResult<null>
  >(tagFormData: FormData) {
    return request.put<R, T>('/tag', tagFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    );
  }

  public static delete<
    R = DTO.ResponseResult<null>,
    T = DTO.ResponseResult<null>
  >(id: number) {
    return request.delete<R, T>(`/tag/${id}`);
  }

  public static changeOrderAndMove<
    R = DTO.ResponseResult<null>,
    T = DTO.ResponseResult<null>
  >(
    curId: number,
    tarNextId: number,
    moveToSecondCategoryId: number
  ) {
    return request.put<R, T>('/tag/order', {
      curId, tarNextId, moveToSecondCategoryId,
    });
  }
}

export default TagApi;