import request from '@/utils/request';


class ClientApi {
  public static getConfig<
    R = DTO.ResponseResult<VO.ClientConfig>,
    T = DTO.ResponseResult<VO.ClientConfig>
  >(
    options?: Parameters<typeof request.get<R, T>>[1]
  ) {
    return request.get<R, T>('/client/config', {
      ...(options || {}),
    });
  }
}


export default ClientApi;