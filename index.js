const express = require("express")
const server = require("./api/server.js");
const budgetRouter = require("./budget-router")

const PORT = process.env.PORT || 5000;

server.use(express.json())
server.use(budgetRouter)


server.listen(PORT, () => {
  console.log(`\n== API running on port ${PORT} ==\n`);
});
