const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const { MongoClient } = require("mongodb");
const { MongoMemoryServer } = require("mongodb-memory-server");
const server = require("../api/app");

chai.use(chaiHttp);

const { expect } = chai;

const EXAMPLE_ID = '605de6ded1ff223100cd6aa1';
const COLLECTION = 'lista-de-tarefas';
const DB_NAME = 'tarefas';


describe("PUT /todo/update", () => {
  describe("Quando uma tarefa é atualizada com sucesso", () => {
    let response = {};
    const DBServer = new MongoMemoryServer();

    before(async () => {
      const URLMock = await DBServer.getUri();
      const connectionMock = await MongoClient.connect(URLMock, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      sinon.stub(MongoClient, "connect").resolves(connectionMock);

      connectionMock.db(DB_NAME)
      .collection(COLLECTION)
      .insertOne({
        _id: EXAMPLE_ID,
        title: "titulo da tarefa",
        status: "pending",
        edit: false
      })

      response = await chai.request(server).put("/todo/update").set('X-API-Key', 'foobar').send({
        _id: EXAMPLE_ID,
        title: "titulo da tarefa atualizado",
        status: "pending",
        edit: false
      });
    });

    after(async () => {
      MongoClient.connect.restore();
      await DBServer.stop();
    });

    it("retorna o código de status 200", () => {
      expect(response).to.have.status(200);
    });

    it("retorna um objeto", () => {
      expect(response.body).to.be.a("object");
    });

    it('o objeto possui as propriedades "message"', () => {
      expect(response.body).to.have.property("message");
    });
    it('a propriedade "message" possui o texto "Tarefa atualizada com sucesso"', () => {
      expect(response.body.message).to.be.equal(
        "Tarefa atualizada com sucesso"
      );
    });
  });
  describe("Quando uma tarefa é atualizada sem sucesso", () => {
    let response = {};
    const DBServer = new MongoMemoryServer();

    before(async () => {
      const URLMock = await DBServer.getUri();
      const connectionMock = await MongoClient.connect(URLMock, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      sinon.stub(MongoClient, "connect").resolves(connectionMock);

      await connectionMock.db('teste_update')
      .collection('todos')
      .insertOne({
        _id: EXAMPLE_ID,
        title: "titulo da tarefa",
        status: "pending",
        edit: false
      })


      response = await chai.request(server).put("/todo/update").send({
        title: "titulo da tarefa atualizado",
        status: "completed",
        edit: false
      });
    });

    after(async () => {
      MongoClient.connect.restore();
      await DBServer.stop();
    });

    it("retorna o código de status 401", () => {
      expect(response).to.have.status(401);
    });

    it("retorna um objeto", () => {
      expect(response.body).to.be.a("object");
    });

    it('o objeto possui as propriedades "message"', () => {
      expect(response.body).to.have.property("message");
    });
    it('a propriedade "message" possui o texto "Ocorreu um erro: Faltou algo em sua requisição"', () => {
      expect(response.body.message).to.be.equal(
        "Ocorreu um erro: Faltou algo em sua requisição"
      );
    });
  });
});