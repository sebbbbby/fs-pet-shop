import fs from "fs/promises";
import express from "express";
import pg from "pg";
// import { readFile } from "fs/promises";

const app = express();
const PORT = 4000;
app.use(express.json());
const db = new pg.Pool({
  database: "petshop",
});

app.get("/", (req, res) => {
  db.query("SELECT * FROM pet", [], (error, result) => {
    if (error) {
      throw error;
    }
    res.send(result.rows);
  });
});

app.patch("/pet/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, age, kind } = req.body;

  if (
    Number.isNaN(id) ||
    (!age && !name && !kind) ||
    (age && Number.isNaN(age)) ||
    age < 0
  ) {
    res.sendStatus(422);
    return;
  }

  db.query(
    "UPDATE pet SET name = COALESCE($1, name), age= COALESCE($2,age), kind =COALESCE($3,kind) WHERE id=COALESCE($4, id) RETURNING * ",
    [name, age, kind, id]
  ).then((result) => {
    if (result.rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.send(result.rows[0]);
    }
  });
});

app.delete("/pet/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.sendStatus(422);
    return;
  }

  db.query("DELETE FROM pet WHERE id = $1 RETURNING *", [id])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});

// [{"age":7,"kind":"rainbow","name":"fido"},{"age":5,"kind":"snake","name":"Buttons"},{"age":10,"kind":"sloth","name":"Poki"},{"age":20,"name":"fofo","type":"cat"}]
