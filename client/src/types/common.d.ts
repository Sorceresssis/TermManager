type Result<T = any> = {
    code: number;
    message: string;
    data: T;
}

type DraggableChangeEvent<T> = {
    moved?: {
        newIndex: number,
        element: T
    },
    added?: {
        oldIndex: number,
        element: T
    },
    removed?: {
        newIndex: number,
        oldIndex: number,
        element: T
    }
};