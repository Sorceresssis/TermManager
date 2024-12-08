declare namespace VO {
    type TopCategory = {
        id: number;
        name: string;
    }

    type SecondCategory = {
        id: number;
        name: string;
    }

    type Tag = {
        id: number;
        name: string;
        name_zh: string;
        name_ja: string;
        name_en: string;
    }

    type TagWithCategory = Tag & {
        topCategoryId: number,
        topCategoryName: string,
        secondCategoryId: number,
        secondCategoryName: string,
    }

    type SecondCategoryWithTags = SecondCategory
        & { tags: Tag[]; }
}