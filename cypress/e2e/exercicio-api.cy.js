/// <reference types="cypress" />
import contract from "../contracts/usuarios.contract";
import { faker } from "@faker-js/faker";

describe("Testes da Funcionalidade Usuários", () => {
  let token;
  before(() => {
    cy.token("fulano@qa.com", "teste").then((tkn) => {
      token = tkn;
    });
  });

  it("Deve validar contrato de usuários", () => {
    cy.request("usuarios").then((response) => {
      return contract.validateAsync(response.body);
    });
  });

  it("Deve listar usuários cadastrados", () => {
    cy.request({
      method: "GET",
      url: "usuarios",
    }).then((response) => {
      expect(response.body.usuarios[0].nome).to.equal("Fulaninho");
      expect(response.status).to.equal(200);
      expect(response.duration).to.be.lessThan(20);
    });
  });

  it("Deve cadastrar um usuário com sucesso", () => {
    cy.cadastrarUsuario(
      token,
      faker.internet.displayName(),
      faker.internet.email(),
      faker.internet.password(),
      faker.datatype.boolean().toString()
    ).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal("Cadastro realizado com sucesso");
    });
  });

  it("Deve validar um usuário com email inválido", () => {
    cy.cadastrarUsuario(
      token,
      faker.internet.displayName(),
      "fakeemail",
      faker.internet.password(),
      faker.datatype.boolean().toString()
    ).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.email).to.equal("email deve ser um email válido");
    });
  });

  it("Deve editar um usuário previamente cadastrado", () => {
    const email = faker.internet.email();
    const displayName = faker.internet.displayName();
    const password = faker.internet.password();
    const isAdmin = faker.datatype.boolean().toString();

    cy.cadastrarUsuario(token, displayName, email, password, isAdmin).then(
      (response) => {
        let id = response.body._id;
        cy.editarUsuario(id, token, displayName, email, password, isAdmin).then(
          (response) => {
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal(
              "Registro alterado com sucesso"
            );
          }
        );
      }
    );
  });

  it("Deve deletar um usuário previamente cadastrado", () => {
    const email = faker.internet.email();
    const displayName = faker.internet.displayName();
    const password = faker.internet.password();
    const isAdmin = faker.datatype.boolean().toString();

    cy.cadastrarUsuario(token, displayName, email, password, isAdmin).then(
      (response) => {
        let id = response.body._id;
        cy.deletarUsuario(id, token).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.message).to.equal(
            "Registro excluído com sucesso"
          );
        });
      }
    );
  });
});
