import { RequestHandler } from "express";
import { AnyObject, Maybe, ObjectSchema, ValidationError } from "yup";
import { StatusCodes } from "http-status-codes";

/* Tipo de propriedade que determina qual parte da requisição deve ser validada. */
type TProperty = "body" | "header" | "params" | "query";

/* Tipo genérico para uma função que retorna um esquema de validação Yup. */
type TGetSchema = <T extends Maybe<AnyObject>>(schema: ObjectSchema<T>) => ObjectSchema<T>

/* Tipo para armazenar todos os esquemas de validação possíveis para uma requisição. */
type TAllSchemas = Record<TProperty, ObjectSchema<any>>;

/* Tipo para uma função que recebe o TGetSchema e retorna um conjunto parcial de TAllSchemas. */
type TGetAllSchemas = (getSchema: TGetSchema) => Partial<TAllSchemas>;

/* Tipo para a função de validação que recebe um TGetAllSchemas e retorna um RequestHandler do Express. */
type TValidation = (getAllSchemas: TGetAllSchemas) => RequestHandler;

/**
 * Função de validação que recebe uma função TGetAllSchemas como entrada e retorna um middleware Express
 * para validar a solicitação com base nos esquemas fornecidos. Ele validará cada parte da solicitação
 * e acumulará quaisquer erros encontrados. Se nenhum erro for encontrado, o próximo middleware na cadeia será chamado.
 * Se forem encontrados erros, uma resposta com um status BAD_REQUEST e um objeto JSON contendo os erros será enviada.
 *
 * @param getAllSchemas - Uma função que aceita uma função TGetSchema e retorna um conjunto parcial de TAllSchemas.
 * @returns Um RequestHandler do Express para ser usado como middleware para validação de solicitação.
 */
export const validation: TValidation = (getAllSchemas) => async (req, res, next) => {
    const schemas = getAllSchemas((schema) => schema);


    const errorsResult: Record<string, Record<string, string>> = {};

    Object.entries(schemas).forEach(([key, schema]) => {
        try {
            schema.validateSync(req[key as TProperty], { abortEarly: false });
        } catch (err) {
            const yupError = err as ValidationError;
            const errors: Record<string, string> = {};

            yupError.inner.forEach(error => {
                if (error.path === undefined) return;
                errors[error.path] = error.message;
            });

            errorsResult[key] = errors;
        }
    });


    if (Object.entries(errorsResult).length === 0) {
        return next();
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errorsResult });
    }
};
