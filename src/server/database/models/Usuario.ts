export interface IUsuario{
    id: number,
    nome: string,
    email: string,
    senha: string,
    isValid: boolean,
    uniqueStringEmail: string | null,
    uniqueStringPassword: string | null,
}