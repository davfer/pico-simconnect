import {BoardItem} from "../board.types";

export interface InitBoardProps {
    id: string,
    vendorId: number,
    productId: number,
    items: BoardItem[]
}

export interface GenericResponse {
    success: boolean;
    error?: string;
}