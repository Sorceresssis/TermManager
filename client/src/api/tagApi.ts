import request from '@/utils/request';

class TagApi {
  static async getSecondCategoryWithTags(topCategoryId: number): Promise<VO.SecondCategoryWithTags[]> {
    const resp: Result = await request.get(`/tag/all/${topCategoryId}`);

    switch (resp.code) {
      case 0:
        return resp.data;
      default:
        return [];
    }
  }

  static async getTagsByKeyword(keyword: string): Promise<Result<VO.Tag[]>> {
    const resp: Result = await request.get('/tag/search', {
      params: {
        keyword,
      },
    });

    return resp;
  }

  static async create(tag: FormData): Promise<VO.Tag | undefined> {
    const res: Result = await request.post('/tag', tag,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    switch (res.code) {
      case 0:
        return res.data;
      default:
        return undefined;
    }
  }

  static async edit(tagFormData: FormData): Promise<boolean> {
    const res: Result = await request.put('/tag', tagFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    switch (res.code) {
      case 0:
        return true;
      default:
        return false;
    }
  }

  static async delete(id: number): Promise<boolean> {
    const res: Result = await request.delete(`/tag/${id}`);

    switch (res.code) {
      case 0:
        return true;
      default:
        return false;
    }
  }

  static async changeOrderAndMove(curId: number, tarNextId: number, moveToSecondCategoryId: number): Promise<boolean> {
    const res: Result = await request.put('/tag/order', {
      curId, tarNextId, moveToSecondCategoryId,
    });

    switch (res.code) {
      case 0:
        return true;
      default:
        return false;
    }
  }
}

export default TagApi;