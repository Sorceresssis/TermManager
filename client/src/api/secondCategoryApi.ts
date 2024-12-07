import request from '@/utils/request';


class SecondCategoryApi {
  public static getAllOfTopCategory<
    R = DTO.ResponseResult<VO.SecondCategory[]>,
    T = DTO.ResponseResult<VO.SecondCategory[]>
  >(
    topCategoryId: number,
    options?: Parameters<typeof request.get<R, T>>[1]
  ) {
    return request.get<R, T>(`/second-category/all/${topCategoryId}`, {
      ...(options || {}),
    });
  }

  public static create<
    R = DTO.ResponseResult<VO.SecondCategory>,
    T = DTO.ResponseResult<VO.SecondCategory>
  >(
    secondCategory: DTO.SecondCategoryForm
  ) {
    return request.post<R, T>('/second-category', secondCategory);
  }

  public static edit<
    R = DTO.ResponseResult<null>,
    T = DTO.ResponseResult<null>
  >(secondCategory: VO.SecondCategory) {
    return request.put<R, T>('/second-category', secondCategory);
  }

  public static delete<
    R = DTO.ResponseResult<null>,
    T = DTO.ResponseResult<null>
  >(id: number) {
    return request.delete<R, T>(`/second-category/${id}`);
  }

  public static changeOrderAndMove<
    R = DTO.ResponseResult<null>,
    T = DTO.ResponseResult<null>
  >(
    curId: number,
    tarNextId: number,
    moveToTopCategoryId: number
  ) {
    return request.put<R, T>('/second-category/order', {
      curId, tarNextId, moveToTopCategoryId,
    });
  }
}


export default SecondCategoryApi;