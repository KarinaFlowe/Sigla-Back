const { Router } = require("express");
const donationsRoutes = require("./donations.routes");
const beneficiariesRoutes = require("./beneficiaries.routes");
const donorsRoutes = require("./donors.routes");

const routes = Router();

routes.use("/donations", donationsRoutes)
routes.use("/beneficiaries", beneficiariesRoutes)
routes.use("/donors", donorsRoutes)

module.exports = routes