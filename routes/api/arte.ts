import express = require("express");
// @@@ Upload de arquivos
import multer = require("multer");
import wrap = require("express-async-error-wrapper");
import Arte = require("../../models/arte");

const router = express.Router();

router.get("/listar", wrap(async (req: express.Request, res: express.Response) => {
	// Operações extras... Usuário está logado? Tem permissão de ver essa lista?

	let lista = await Arte.listar();

	res.json(lista);
}));

router.get("/obter/:idArte", wrap(async (req: express.Request, res: express.Response) => {
	// Operações extras... Usuário está logado? Tem permissão de acessar a obra de arte?

	let id = parseInt(req.params["idArte"]);
	if (isNaN(id)) {
		res.status(400).json("Id inválido!");
		return;
	}

	let arte = await Arte.obter(id);

	// Opção 1: retorna null de qualquer jeito
	//res.json(arte);

	// Opção 2: se for null, retorna um erro
	if (!arte) {
		res.status(400).json("Arte não encontrada");
	} else {
		res.json(arte);
	}
}));

router.post("/criar", multer().single("imagem"), wrap(async (req: express.Request, res: express.Response) => {
	// Operações extras... Usuário está logado? Tem permissão de criar obras de arte?

	let arte = req.body as Arte;

	let erro = await Arte.criar(arte, req["file"]);

	if (erro) {
		res.status(400).json(erro);
	} else {
		res.sendStatus(204);
	}
}));

router.post("/alterar", multer().single("imagem"), wrap(async (req: express.Request, res: express.Response) => {
	// Operações extras... Usuário está logado? Tem permissão de alterar obras de arte?

	let arte = req.body as Arte;

	let erro = await Arte.alterar(arte, req["file"]);

	if (erro) {
		res.status(400).json(erro);
	} else {
		res.sendStatus(204);
	}
}));

router.get("/excluir/:id", wrap(async (req: express.Request, res: express.Response) => {
	// Operações extras... Usuário está logado? Tem permissão de acessar a obra de arte?

	let id = parseInt(req.params["id"]);
	if (isNaN(id)) {
		res.status(400).json("Id inválido!");
		return;
	}

	let erro = await Arte.excluir(id);

	if (erro) {
		res.status(400).json(erro);
	} else {
		res.sendStatus(204);
	}
}));

export = router;
