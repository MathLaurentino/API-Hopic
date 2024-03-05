import supertest from "supertest";
import { Knex } from "../src/server/database/knex";
import { server } from "../src/server/Server";
import { StatusCodes } from "http-status-codes";

/**
 * roda a migration e a seed antes de inicializar os testes 
 */
beforeAll(async () => {
    await Knex.migrate.latest();
});

beforeAll(async () => {
    const signUpRes = await testServer.post("/signup").send({
        "name": "Matheus",
        "email": "matheus@gmail.com",
        "password": "senha123"
    });
    expect(signUpRes.statusCode).toEqual(StatusCodes.CREATED);
    const uniqueStringEmail = signUpRes.body;

    const validateEmail =  await testServer.get(`/validateEmail/${uniqueStringEmail}`).send();
    expect(validateEmail.statusCode).toEqual(StatusCodes.OK);
});

afterAll(async () => {
    await Knex.destroy();
});

export const testServer = supertest(server);