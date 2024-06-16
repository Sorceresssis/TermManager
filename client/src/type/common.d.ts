type Result = {
    code: number;
    message: string;
    data?: any;
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