import request from "@/utils/request";

class TagApi {
    async getSecondCategoryWithTags(topCategoryId: number): Promise<VO.SecondCategoryWithTags[]> {
        const res: Result = await request.get(`/tag/all/${topCategoryId}`);

        switch (res.code) {
            case 0:
                return res.data;
            default:
                return [];
        }
    }

    async create(tag: FormData): Promise<VO.Tag | undefined> {
        const res: Result = await request.post('/tag', tag,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        switch (res.code) {
            case 0:
                return res.data
            default:
                return undefined
        }
    }

    async edit(tagFormData: FormData): Promise<boolean> {
        const res: Result = await request.put('/tag', tagFormData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        switch (res.code) {
            case 0:
                return true
            default:
                return false
        }
    }

    async delete(id: number): Promise<boolean> {
        const res: Result = await request.delete(`/tag/${id}`);

        switch (res.code) {
            case 0:
                return true
            default:
                return false
        }
    }

    async changeOrderAndMove(curId: number, tarNextId: number, moveToSecondCategoryId: number): Promise<boolean> {
        const res: Result = await request.put('/tag/order', { curId, tarNextId, moveToSecondCategoryId })

        switch (res.code) {
            case 0:
                return true;
            default:
                return false;
        }
    }
}

const tagApi = new TagApi();

export default tagApi;