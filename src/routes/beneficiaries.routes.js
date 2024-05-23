const { Router } = require("express");
const api = require("../library/axios");

const beneficiariesRoutes = Router();

class Beneficiaries {
  async index(request, response) {
    const query = request.query;
    const filteredQuery = Object.fromEntries(
      //filtro só funciona respeitando o case sensitive
      //http://localhost:2511/beneficiaries?nome&endereco&responsavel&telefone&dataNascimento&comorbidades
      Object.entries(query).filter(([key, value]) => value)
    );
    try {
      const { data } = await api.get("/beneficiaries", {
        params: filteredQuery,
      });
      return response.json({ result: data });
    } catch (error) {
      return response
        .status(500)
        .json({ mensagem: "Erro: Não foi possível filtrar" });
    }
  }

  async create(request, response) {
    const {
      nome,
      endereco,
      responsavel,
      telefone,
      dataNascimento,
      comorbidades,
    } = request.body;

    await api.post("/beneficiaries", {
      nome,
      endereco,
      responsavel,
      telefone,
      dataNascimento,
      comorbidades,
      status: "Ativo",
    });
    return response.status(200).json();
  }

  async update(request, response) {
    const { id } = request.params;
    const {
      nome,
      endereco,
      responsavel,
      telefone,
      dataNascimento,
      comorbidades,
      status,
    } = request.body;
    try {
      const beneficiarie = await api.get("/beneficiaries", {
        params: { id },
      });

      if (!beneficiarie) {
        return response
          .status(404)
          .json({ mensagem: "Erro: Beneficiário não encontrado!" });
      }

      const updateBeneficiarie = {
        ...beneficiarie.data,
        codigo,
        nome,
        endereco,
        responsavel,
        telefone,
        dataNascimento,
        comorbidades,
        status,
      };

      await api.put("/beneficiaries", updateBeneficiarie);

      return response
        .status(200)
        .json({ mensagem: "Sucesso: Beneficiário atualizado!" });
    } catch {
      return response.status(500).json({ mensagem: "Erro: Erro no servidor!" });
    }
  }

  async delete(request, response) {
    const { id } = request.params;
    try {
      const beneficiarie = await api.get(`/beneficiaries/${id}`);

      if (!beneficiarie) {
        return response
          .status(404)
          .json({ mensagem: "Erro: Beneficiário não encontrada!" });
      }

      await api.delete(`/beneficiaries/${beneficiarie.data.id}`);

      return response
        .status(200)
        .json({ mensagem: "Sucesso: Beneficiário deletado!" });
    } catch {
      return response.status(500).json({ mensagem: "Erro: Erro no servidor!" });
    }
  }
}

const controller = new Beneficiaries();

beneficiariesRoutes.get("/", controller.index);

beneficiariesRoutes.post("/", controller.create);

beneficiariesRoutes.put("/:id", controller.update);

beneficiariesRoutes.delete("/:id", controller.delete);

module.exports = beneficiariesRoutes;