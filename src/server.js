const express = require('express');
const routes = require('./routes')

const app = express();

app.use(express.json())

app.use(routes);

//servidor rodando na porta 2511
const port = 2511

app.listen(port, () => console.log(`Funcionando na porta ${port}`));