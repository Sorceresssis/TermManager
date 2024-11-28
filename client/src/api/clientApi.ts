import request from '@/utils/request';


class ClientApi {
  static async getTitle(): Promise<string> {
    const res: Result = await request.get('/client/title');
    switch (res.code) {
      case 0:
        return res.data;
      default:
        return '';
    }
  }
}


export default ClientApi;