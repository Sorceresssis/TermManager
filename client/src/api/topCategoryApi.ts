import request from '@/utils/request';


class TopCategoryApi {
  public static getAll<
    R = DTO.ResponseResult<VO.TopCategory[]>,
    T = DTO.ResponseResult<VO.TopCategory[]>
  >(
    options?: Parameters<typeof request.get<R, T>>[1]
  ) {
    return request.get<R, T>('/top-category/all', {
      ...(options || {}),
    });
  }

  public static create<
    R = DTO.ResponseResult<VO.TopCategory | undefined>,
    T = DTO.ResponseResult<VO.TopCategory | undefined>
  >(
    name: string,
    options?: Parameters<typeof request.post<R, T>>[2]
  ) {
    return request.post<R, T>('/top-category', {
      name,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }

  public static edit<
    R = DTO.ResponseResult<null>,
    T = DTO.ResponseResult<null>
  >(
    category: VO.TopCategory,
    options?: Parameters<typeof request.put<R, T>>[2]
  ) {
    return request.put<R, T>('/top-category', category, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }

  public static delete<
    R = DTO.ResponseResult<null>,
    T = DTO.ResponseResult<null>
  >(
    id: number,
    options?: Parameters<typeof request.delete<R, T>>[1]
  ) {
    return request.delete<R, T>(`/top-category/${id}`, {
      ...(options || {}),
    });
  }

  public static changeOrder<
    R = DTO.ResponseResult<null>,
    T = DTO.ResponseResult<null>
  >(
    curId: number,
    tarNextId: number,
    options?: Parameters<typeof request.put<R, T>>[2]
  ) {
    return request.put<R, T>('/top-category/order', {
      curId, tarNextId,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    });
  }
}


export default TopCategoryApi;