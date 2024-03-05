import {testServer} from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("Item - Create", () => {

    let accessToken = "";
    beforeAll(async () => {
        const signInRes = await testServer.post("/signin").send({
            "email": "matheus@gmail.com",
            "password": "senha123"
        });
        expect(signInRes.statusCode).toEqual(StatusCodes.OK);
        accessToken = signInRes.body.accessToken;
    });


    it("Tenta criar um item sem token de acesso", async () => {
        const res = await testServer
            .post("/produtos")
            .send({ 
                name: "Caxias do Sul",
                price: 4,
                shortCut: "Ctrl+4",
                color: "F1F1F1"
            });
    
        expect(res.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(res.body).toHaveProperty("errors.default");
    });


    it("Criar item com sucesso", async ()=> {
        const res = await testServer
            .post("/produtos")
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({
                name: "Chocolate",
                price: 6,
                shortCut: "Ctrl+1",
                color: "FFFFFF"
            });

        expect(res.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res.body).toEqual("number");
    });


    it("Tenta criar item com nome repetido", async ()=> {
        const res = await testServer.post("/produtos").set({ Authorization: `Bearer ${accessToken}` })
            .send({
                name: "Chocolate",
                price: 8,
                shortCut: "Ctrl+2",
                color: "FFFFF!"
            });

        expect(res.statusCode).toEqual(StatusCodes.CONFLICT);
    });


    it("Tenta criar item com shortCut repetido", async ()=> {
        const res = await testServer.post("/produtos").set({ Authorization: `Bearer ${accessToken}` })
            .send({
                name: "Mel",
                price: 10,
                shortCut: "Ctrl+1",
                color: "FFFFF2"
            });

        expect(res.statusCode).toEqual(StatusCodes.CONFLICT);
    });


    it("Tenta criar item com nome menor que o mínimo", async () => {
        const res = await testServer.post("/produtos").set({ Authorization: `Bearer ${accessToken}` })
            .send({
                name: "A",
                price: 8,
                shortCut: "Ctrl+2",
                color: "FFFFF!"
            });

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty("errors.body.name");
    });


    it("Tenta criar item com preço menor que zero", async () => {
        const res = await testServer.post("/produtos").set({ Authorization: `Bearer ${accessToken}` })
            .send({
                name: "Mel",
                price: -5, // Preço menor que zero
                shortCut: "Ctrl+2",
                color: "FFFFF!"
            });

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty("errors.body.price");
    });


    it("Tenta criar item com cor menor que o mínimo", async () => {
        const res = await testServer.post("/produtos").set({ Authorization: `Bearer ${accessToken}` })
            .send({
                name: "Chocolate",
                price: 8,
                shortCut: "Ctrl+2",
                color: "FFFFF"
            });

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty("errors.body.color");
    });


    it("Tenta criar item com atalho maior que o máximo", async () => {
        const res = await testServer.post("/produtos").set({ Authorization: `Bearer ${accessToken}` })
            .send({
                name: "Mel",
                price: 10,
                shortCut: "ThisIsAVeryLongShortcutThatExceedsTheMaxLength",
                color: "FFFFF2"
            });

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty("errors.body.shortCut");
    });
});