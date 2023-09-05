export interface IItem{
    id: number;
    user_id: number; //fk
    name: string;
    visibility: boolean;
    price: number;
    color: string;
    imageAddress:string | null;
}