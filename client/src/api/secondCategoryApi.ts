import request from "@/utils/request";


class SecondCategoryApi {
    async getAllOfTopCategory(topCategoryId: number): Promise<VO.SecondCategory[]> {
        const res: Result = await request.get(`/second-category/all/${topCategoryId}`)

        switch (res.code) {
            case 0:
                return res.data;
            default:
                return [];
        }
    }

    async create(secondCategory: DTO.SecondCategoryForm): Promise<VO.SecondCategory | undefined> {
        const res: Result = await request.post('/second-category', secondCategory)

        switch (res.code) {
            case 0:
                return res.data;
            default:
                return undefined;
        }
    }

    async edit(secondCategory: VO.SecondCategory): Promise<boolean> {
        const res: Result = await request.put('/second-category', secondCategory)

        switch (res.code) {
            case 0:
                return true
            default:
                return false
        }
    }

    async delete(id: number): Promise<boolean> {
        const res: Result = await request.delete(`/second-category/${id}`);

        switch (res.code) {
            case 0:
                return true;
            default:
                return false;
        }
    }

    async changeOrderAndMove(curId: number, tarNextId: number, moveToTopCategoryId: number): Promise<boolean> {
        const res: Result = await request.put('/second-category/order', { curId, tarNextId, moveToTopCategoryId })

        switch (res.code) {
            case 0:
                return true;
            default:
                return false;
        }
    }
}

const secondCategoryApi = new SecondCategoryApi();

export default secondCategoryApi;