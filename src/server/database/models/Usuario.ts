export interface IUsuario{
    id: number,
    nome: string,
    email: string,
    senha: string,
    isValid: boolean,
    uniqueString: string | null,
}