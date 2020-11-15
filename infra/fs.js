"use strict";
var _a;
const fs = require("fs");
const moment = require("moment");
const path = require("path");
const Arquivo = require("./arquivo");
module.exports = (_a = class FS {
        static descobrirAppPath() {
            // Vamos apenas retornar o caminho da pasta pai (assumindo que
            // fs.js esteja em um diretório que é filho direto da raiz)
            let caminho = path.dirname(__filename);
            if (caminho.endsWith(path.sep)) {
                let i = caminho.lastIndexOf(path.sep, caminho.length - 2);
                caminho = caminho.substr(0, i + 1);
            }
            else {
                let i = caminho.lastIndexOf(path.sep);
                caminho = caminho.substr(0, i);
            }
            return caminho;
        }
        static ajustarCaminhoRelativo(caminhoRelativo, barrasValidas) {
            if (!caminhoRelativo ||
                caminhoRelativo.charAt(0) === "." ||
                caminhoRelativo.indexOf("..") >= 0 ||
                caminhoRelativo.indexOf("*") >= 0 ||
                caminhoRelativo.indexOf("?") >= 0 ||
                (!barrasValidas && (caminhoRelativo.indexOf("\\") >= 0 || caminhoRelativo.indexOf("/") >= 0)))
                throw new Error("Caminho inválido");
            return ((path.sep === "/") ?
                caminhoRelativo.replace(FS.barraInvertida, "/") :
                caminhoRelativo.replace(FS.barra, "\\"));
        }
        static gerarCaminhoAbsoluto(caminhoRelativo) {
            return path.join(FS.appPath, FS.ajustarCaminhoRelativo(caminhoRelativo, true));
        }
        static gerarCaminhoAbsolutoArquivo(caminhoRelativo, nomeArquivo) {
            if (!(nomeArquivo = FS.validarNomeDeArquivo(nomeArquivo)))
                throw new Error("Nome de arquivo inválido");
            return path.join(FS.appPath, FS.ajustarCaminhoRelativo(caminhoRelativo, true), nomeArquivo);
        }
        static validarNomeDeArquivo(nome) {
            return ((!nome ||
                !(nome = nome.trim().toLowerCase()) ||
                nome.charAt(0) === "." ||
                nome.indexOf("..") >= 0 ||
                nome.indexOf("*") >= 0 ||
                nome.indexOf("?") >= 0 ||
                nome.indexOf("\\") >= 0 ||
                nome.indexOf("/") >= 0) ? null : nome);
        }
        static concatenarCaminhosRelativos(caminhoRelativo, caminhoRelativo2) {
            return path.join(caminhoRelativo, caminhoRelativo2);
        }
        static async criarDiretorio(caminhoRelativo) {
            caminhoRelativo = FS.ajustarCaminhoRelativo(caminhoRelativo, true);
            return new Promise((resolve, reject) => {
                try {
                    fs.mkdir(path.join(FS.appPath, caminhoRelativo), 0o777, (err) => {
                        if (err)
                            reject(err);
                        else
                            resolve();
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        }
        static async listarDiretorio(caminhoRelativo) {
            caminhoRelativo = FS.ajustarCaminhoRelativo(caminhoRelativo, true);
            return new Promise((resolve, reject) => {
                try {
                    let dir = path.join(FS.appPath, caminhoRelativo);
                    fs.readdir(dir, (err, files) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (!files || !files.length) {
                            resolve([]);
                            return;
                        }
                        let arquivos = new Array();
                        function processarProximo(i) {
                            try {
                                if (i >= files.length) {
                                    resolve(arquivos);
                                    return;
                                }
                                fs.stat(path.join(dir, files[i]), (err, stats) => {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    if (!stats.isDirectory()) {
                                        let a = new Arquivo();
                                        a.nome = files[i];
                                        a.tamanho = stats.size;
                                        a.modificacaoMs = stats.mtimeMs;
                                        // http://momentjs.com/docs/#/displaying/
                                        a.modificacao = moment(stats.mtime).locale("pt-br").format("DD/MM/YYYY HH:mm");
                                        arquivos.push(a);
                                    }
                                    processarProximo(i + 1);
                                });
                            }
                            catch (e) {
                                reject(e);
                            }
                        }
                        processarProximo(0);
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        }
        static async excluirArquivosEDiretorio(caminhoRelativo) {
            caminhoRelativo = FS.ajustarCaminhoRelativo(caminhoRelativo, true);
            return new Promise((resolve, reject) => {
                try {
                    let dir = path.join(FS.appPath, caminhoRelativo);
                    fs.readdir(dir, (err, files) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        function excluirProximo(i) {
                            try {
                                if (!files || i >= files.length) {
                                    fs.rmdir(dir, (err) => {
                                        if (err)
                                            reject(err);
                                        else
                                            resolve();
                                    });
                                    return;
                                }
                                fs.unlink(path.join(dir, files[i]), (err) => {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    excluirProximo(i + 1);
                                });
                            }
                            catch (e) {
                                reject(e);
                            }
                        }
                        excluirProximo(0);
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        }
        static async renomearArquivo(caminhoRelativoAtual, caminhoRelativoNovo) {
            caminhoRelativoAtual = FS.ajustarCaminhoRelativo(caminhoRelativoAtual, true);
            caminhoRelativoNovo = FS.ajustarCaminhoRelativo(caminhoRelativoNovo, true);
            return new Promise((resolve, reject) => {
                try {
                    fs.rename(path.join(FS.appPath, caminhoRelativoAtual), path.join(FS.appPath, caminhoRelativoNovo), (err) => {
                        if (err)
                            reject(err);
                        else
                            resolve();
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        }
        static async excluirArquivo(caminhoRelativo) {
            caminhoRelativo = FS.ajustarCaminhoRelativo(caminhoRelativo, true);
            return new Promise((resolve, reject) => {
                try {
                    fs.unlink(path.join(FS.appPath, caminhoRelativo), (err) => {
                        if (err)
                            reject(err);
                        else
                            resolve();
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        }
        static async existeArquivo(caminhoRelativo) {
            caminhoRelativo = FS.ajustarCaminhoRelativo(caminhoRelativo, true);
            return new Promise((resolve, reject) => {
                try {
                    fs.exists(path.join(FS.appPath, caminhoRelativo), (exists) => {
                        resolve(exists);
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        }
    },
    // Não funciona no Azure, porque require.main.filename não é nosso app.js... :(
    //public static readonly appPath = path.dirname(require.main.filename);
    _a.appPath = _a.descobrirAppPath(),
    _a.barra = /\//g,
    _a.barraInvertida = /\\/g,
    _a);
//# sourceMappingURL=fs.js.map