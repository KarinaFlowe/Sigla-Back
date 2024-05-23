const { Router } = require("express");
const api = require("../library/axios");

const donorsRoutes = Router();

class Donors {
  async index(request, response) {
    const query = request.query;
    const filteredQuery = Object.fromEntries(
      //filtro só funciona respeitando o case sensitive
      //http://localhost:2511/donors?nome&endereco&responsavel&telefone&tipo&documento&aniversario
      Object.entries(query).filter(([key, value]) => value)
    );
    try {
      const { data } = await api.get("/donors", {
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
      tipo,
      documento,
      aniversario,
    } = request.body;

    await api.post("/donors", {
      nome,
      endereco,
      responsavel,
      telefone,
      tipo,
      documento,
      aniversario,
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
      tipo,
      documento,
      aniversario,
      status,
    } = request.body;
    try {
      const donor = await api.get("/donors", {
        params: { id },
      });

      if (!donor) {
        return response
          .status(404)
          .json({ mensagem: "Erro: Doador não encontrado!" });
      }

      const updateDonor = {
        ...donor.data,
        nome,
        endereco,
        responsavel,
        telefone,
        tipo,
        documento,
        aniversario,
        status,
      };

      await api.put("/donors", updateDonor);

      return response
        .status(200)
        .json({ mensagem: "Sucesso: Doador atualizado!" });
    } catch {
      return response.status(500).json({ mensagem: "Erro: Erro no servidor!" });
    }
  }

  async delete(request, response) {
    const { id } = request.params;
    try {
      const donor = await api.get(`/donors/${id}`);

      if (!donor) {
        return response
          .status(404)
          .json({ mensagem: "Erro: Doador não encontrado!" });
      }

      await api.delete(`/donors/${donor.data.id}`);

      return response
        .status(200)
        .json({ mensagem: "Sucesso: Doador deletado!" });
    } catch {
      return response.status(500).json({ mensagem: "Erro: Erro no servidor!" });
    }
  }
}

const controller = new Donors();

donorsRoutes.get("/", controller.index);

donorsRoutes.post("/", controller.create);

donorsRoutes.put("/:id", controller.update);

donorsRoutes.delete("/:id", controller.delete);

module.exports = donorsRoutes;