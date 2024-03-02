export interface IItem{
    id: number;
    user_id: number; //fk
    name: string;
    price: number;
    color: string;
    shortCut: string;
    imageAddress:string | null;
}