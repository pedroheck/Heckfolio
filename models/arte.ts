import converterDataISO = require("../utils/converterDataISO");
import FS = require("../infra/fs");
import Sql = require("../infra/sql");
import Upload = require("../infra/upload");

export = class Arte {
	public idArte: number;
	public titleArte: string;
	public descArte: string;
	public dateArte: string;



	


	// @@@ Upload de arquivos
	// Esta função aqui abaixo serve para validar o arquivo enviado:
	// ele não pode ter mais de 1 MiB.
	private static validarImagem(imagem: any): string {
		// Vamos retornar uma string sempre que houver algum erro
		// de validação, ou null se tudo estiver OK!

		if (!imagem) {
			return "Imagem faltando";
		}

		if (!imagem.buffer || !imagem.size) {
			return "Imagem inválida";
		}

		if (imagem.size > (4096 * 4096)) {
			return "Imagem muito grande";
		}

		return null;
	}

	private static validar(arte: Arte, criando: boolean): string {
		if (!arte)
			return "Dados faltantes";

		arte.titleArte = (arte.titleArte || "").normalize().trim();
		if (arte.titleArte.length < 1 || arte.titleArte.length > 100)
			return "Titulo inválido";

		arte.descArte = (arte.descArte || "").normalize().trim();
		if (arte.descArte.length < 1 || arte.descArte.length > 200)
			return "Descrição inválida";

		// 2020-10-19 ISO
		// 19/10/2020 pt-br
		// MySQL / SQL Server / Oracle
		// 1o problema: se vier d/m/a da tela, tem que converter para ISO
		// 2o problema: veio uma data (10 caracteres ou menos)????
		// 3o problema: a data é válida? 32/10 ... 30/02... 29/02 em ano não bissexto...

		if (criando) {
			arte.dateArte = converterDataISO(arte.dateArte);
			if (!arte.dateArte)
				return "Data de criação inválida";
		}

		return null;
	}

	

	public static async listar(): Promise<Arte[]> {
		let lista: Arte[] = null;

		await Sql.conectar(async (sql) => {

			lista = await sql.query("select idArte, titleArte, descArte, date_format(dateArte, '%d/%m/%Y') dateArte from arte");
		
		});

		return lista;
	}

	public static async obter(idArte: number): Promise<Arte> {
		let arte: Arte = null;

		await Sql.conectar(async (sql) => {

			let lista = await sql.query("select idArte, titleArte, descArte, dateArte from Arte where idArte = ?", [idArte]);

			if(lista && lista.length) 
				arte = lista[0];
			
		});

		return arte;
	}

	public static async criar(arte: Arte, imagem: any): Promise<string> {
		let erro = Arte.validar(arte, true);

		if (erro)
			return erro;

		// @@@ Upload de arquivos
		// Aqui, a foto é opcional, então, está OK caso ela não exista!
		erro = Arte.validarImagem(imagem);
		if (erro) {
			return erro;
		}

		await Sql.conectar(async (sql) => {

			// @@@ Upload de arquivos
			// Precisamos começar uma transação, para podermos cancelar a inserção
			// caso a gravação do arquivo dê errado
			await sql.beginTransaction();

			await sql.query("insert into arte (titleArte, descArte, dateArte) values (?, ?, ?)", [arte.titleArte, arte.descArte, arte.dateArte]);

			// Obtém o id da pessoa que acabou de ser inserida
			arte.idArte = await sql.scalar("select last_insert_id()");

			// Vamos gravar a imagem direto dentro da pasta public, para que ela possa ser acessada
			// por todos, sem necessidade de termos que criar algum código extra...
			await Upload.gravarArquivo(imagem, "public/images/artes", arte.idArte + ".jpg");

			// Se não ocorreu nenhuma exceção, e chegamos até aqui, então podemos confirmar a inserção!
			await sql.commit();

		});

		return erro;
	}

	public static async alterar(arte: Arte, imagem: any): Promise<string> {
		let erro = Arte.validar(arte, false);
		if (erro)
			return erro;

		// @@@ Upload de arquivos
		// Aqui, a foto é opcional, então, está OK caso ela não exista!
		if (imagem) {
			erro = Arte.validarImagem(imagem);
			if (erro) {
				return erro;
			}
		}

		await Sql.conectar(async (sql) => { //como ignorar a data?

			// @@@ Upload de arquivos
			// Precisamos começar uma transação, para podermos cancelar o update
			// caso a gravação do arquivo dê errado
			await sql.beginTransaction();

			let lista = await sql.query("update arte set titleArte = ?, descArte = ? where idArte = ?", [arte.titleArte, arte.descArte, arte.idArte]);

			if (!sql.linhasAfetadas) {
				erro = "Arte não encontrada";
			} else if (imagem) {
				// Como a foto é opcional na edição, precisamos primeiro verificar se ela existe.
				await Upload.gravarArquivo(imagem, "public/images/artes", arte.idArte + ".jpg");
			}

			// Se não ocorreu nenhuma exceção, e chegamos até aqui, então podemos confirmar o update!
			await sql.commit();

		});

		return erro;
	}

	public static async excluir(idArte: number): Promise<string> {
		let erro: string = null;

		await Sql.conectar(async (sql) => {

			// @@@ Upload de arquivos
			// Precisamos começar uma transação, para podermos cancelar a exclusão
			// caso a exclusão do arquivo dê errado
			await sql.beginTransaction();

			let lista = await sql.query("delete from arte where idArte = ?", [idArte]);

			if (!sql.linhasAfetadas) {
				erro = "Arte não encontrada. It Shall Not Pass!";
			} else {
				await FS.excluirArquivo("public/images/artes/" + idArte + ".jpg");
			}

			// Se não ocorreu nenhuma exceção, e chegamos até aqui, então podemos confirmar a exclusão!
			await sql.commit();

		});

		return erro;
	}
};
