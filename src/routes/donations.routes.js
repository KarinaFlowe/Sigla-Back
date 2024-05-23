const { Router } = require("express");
const api = require("../library/axios");

const donationRoutes = Router();

class Donation {
  async index(request, response) {
    const query = request.query;
    const filteredQuery = Object.fromEntries(
      //filtro só funciona respeitando o case sensitive
      //http://localhost:2511/donations?codigo&item&categoria&dataColeta&dataValidade&doador&status
      Object.entries(query).filter(([key, value]) => value)
    );
    try {
      const { data } = await api.get("/donations", {
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
      codigo,
      item,
      categoria,
      dataColeta,
      dataValidade,
      doador,
      fonte,
      quantidade,
    } = request.body;

    await api.post("/donations", {
      codigo,
      item,
      categoria,
      dataColeta,
      dataValidade,
      doador,
      fonte,
      quantidade,
    });
    return response.status(200).json();
  }

  async update(request, response) {
    const { id } = request.params;

    const {
      codigo,
      item,
      categoria,
      dataColeta,
      dataValidade,
      doador,
      fonte,
      quantidade,
    } = request.body;
    try {
      const donation = await api.get(`/donations/${id}`);

      if (!donation) {
        return response
          .status(404)
          .json({ mensagem: "Erro: Doação não encontrada!" });
      }

      const updateDonation = {
        ...donation.data,
        codigo,
        item,
        categoria,
        dataColeta,
        dataValidade,
        doador,
        fonte,
        quantidade,
      };

      await api.put(`/donations/${id}`, updateDonation);

      console.log("atualizou");

      return response
        .status(200)
        .json({ mensagem: "Sucesso: Doação atualizada!" });
    } catch {
      return response.status(500).json({ mensagem: "Erro: Erro no servidor!" });
    }
  }

  async delete(request, response) {
    const { id } = request.params;
    try {
      const donation = await api.get(`/donations/${id}`);

      if (!donation) {
        return response
          .status(404)
          .json({ mensagem: "Erro: Doação não encontrada!" });
      }

      await api.delete(`/donations/${donation.data.id}`);

      return response
        .status(200)
        .json({ mensagem: "Sucesso: Doação deletada!" });
    } catch {
      return response.status(500).json({ mensagem: "Erro: Erro no servidor!" });
    }
  }
}

const controller = new Donation();

donationRoutes.get("/", controller.index);

donationRoutes.post("/", controller.create);

donationRoutes.put("/:id", controller.update);

donationRoutes.delete("/:id", controller.delete);

module.exports = donationRoutes;