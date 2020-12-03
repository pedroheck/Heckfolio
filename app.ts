import express = require("express");
import path = require("path");
import ejs = require("ejs");
import lru = require("lru-cache");
import wrap = require("express-async-error-wrapper");
import Arte = require("./models/arte");

const app = express();

// Configura o diretório de onde tirar as views (páginas que serão devolvidas
// pelos tratadores das rotas)
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public"), {
	cacheControl: true,
	etag: false,
	maxAge: "30d"
}));

// Configura o Express para reconhecer dados provenientes do corpo das requisições
// http://expressjs.com/en/api.html#express.json
// http://expressjs.com/en/api.html#express.urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura o cache, para armazenar as 200 últimas páginas já processadas, por ordem de uso
ejs.cache = lru(200);
// Define o view engine como o ejs e importa o express-ejs-layouts
// https://www.npmjs.com/package/express-ejs-layouts, pois o ejs não
// suporta layouts nativamente: https://www.npmjs.com/package/ejs#layouts
app.set("view engine", "ejs");
app.use(require("express-ejs-layouts"));

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
	res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
	res.header("Expires", "-1");
	res.header("Pragma", "no-cache");
	next();
});

app.use("/api/arte", require("./routes/api/arte"));

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@ Preencher aqui!!!
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

app.get("/", wrap(async (req: express.Request, res: express.Response) => {
	let opcoes = {
		artes: await Arte.listar()
	};

	res.render("index", opcoes);
}));
app.get("/artista", (req: express.Request, res: express.Response) => {
	res.render("artista");
});
app.get("/compre", (req: express.Request, res: express.Response) => {
	res.render("compre");
});
app.get("/contato", (req: express.Request, res: express.Response) => {
	res.render("contato");
});
app.get("/upload", (req: express.Request, res: express.Response) => {
	res.render("upload", {arte: null});
});
app.get("/excluir", wrap(async (req: express.Request, res: express.Response) => {
	let opcoes = {
		artes: await Arte.listar()
	};

	res.render("excluir", opcoes);
}));

app.get("/alterar/:id", wrap(async (req: express.Request, res: express.Response) => {
	let idArte = parseInt(req.params["id"]);

	if (isNaN(idArte)) {
		res.render("excluir");
	} else {
		let arte = await Arte.obter(idArte);
		
		if (!arte) {
			res.render("excluir");
		} else {
			res.render("upload", {arte: arte});
		}
	}
}));


app.listen(1337, () => {
	console.log("Executando servidor na porta 1337");
});
