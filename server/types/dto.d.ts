declare namespace DTO {
    type SecondCategoryForm = {
        name: string;
        topCategoryId: number;
    }

    type TagForm = {
        name: string;
        name_zh: string;
        name_ja: string;
        name_en: string;
        secondCategoryId: number;
    }

    type SecondCategoryOrderForm = {
        curId: number;
        tarNextId: number;
        moveToTopCategoryId: number;
    }

    type TagOrderForm = {
        curId: number;
        tarNextId: number;
        moveToSecondCategoryId: number;
    }
}