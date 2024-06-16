import request from "@/utils/request";


class TopCategoryApi {
    async getAll(): Promise<VO.TopCategory[]> {
        const res: Result = await request.get('/top-category/all');

        switch (res.code) {
            case 0:
                return res.data;
            default:
                return [];
        }
    }

    async create(name: string): Promise<VO.TopCategory | undefined> {
        // 添加成功后返回新的category，失败返回undefined
        const res: Result = await request.post('/top-category', { name });

        switch (res.code) {
            case 0:
                return res.data;
            default:
                return undefined;
        }
    }

    async edit(category: VO.TopCategory): Promise<boolean> {
        const res: Result = await request.put(`/top-category`, category);

        switch (res.code) {
            case 0:
                return true;
            default:
                return false;
        }
    }

    async delete(id: number): Promise<boolean> {
        const res: Result = await request.delete(`/top-category/${id}`);

        switch (res.code) {
            case 0:
                return true;
            default:
                return false;
        }
    }

    // 改变category的顺序
    async changeOrder(curId: number, tarNextId: number): Promise<boolean> {
        const res: Result = await request.put(`/top-category/order`, { curId, tarNextId });
        switch (res.code) {
            case 0:
                return true;
            default:
                return false;
        }
    }
}

const categoryApi = new TopCategoryApi();

export default categoryApi;