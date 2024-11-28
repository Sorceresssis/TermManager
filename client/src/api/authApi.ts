import request from '@/utils/request';


export function login(username: string, password: string) {
  return request.post<any, DTO.ResponseResult<string>>('/login', {
    username,
    password,
  });
}