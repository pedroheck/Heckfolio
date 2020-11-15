"use strict";
const fs = require("fs");
const FS = require("./fs");
module.exports = class Upload {
    static async gravarArquivo(arquivo, caminhoRelativoPasta, nomeArquivo) {
        return new Promise((resolve, reject) => {
            let caminhoAbsolutoArquivo;
            try {
                caminhoAbsolutoArquivo = FS.gerarCaminhoAbsolutoArquivo(caminhoRelativoPasta, nomeArquivo);
            }
            catch (e) {
                reject("Caminho inválido!");
                return;
            }
            fs.writeFile(caminhoAbsolutoArquivo, arquivo.buffer, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    static async criarArquivoVazio(caminhoRelativoPasta, nomeArquivo) {
        return new Promise((resolve, reject) => {
            let caminhoAbsolutoArquivo;
            try {
                caminhoAbsolutoArquivo = FS.gerarCaminhoAbsolutoArquivo(caminhoRelativoPasta, nomeArquivo);
            }
            catch (e) {
                reject("Caminho inválido!");
                return;
            }
            try {
                fs.exists(caminhoAbsolutoArquivo, (exists) => {
                    if (exists) {
                        reject("Arquivo já existe!");
                        return;
                    }
                    fs.writeFile(caminhoAbsolutoArquivo, [], (err) => {
                        if (err)
                            reject(err);
                        else
                            resolve();
                    });
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    static async adicionarAoFinalDoArquivo(arquivo, caminhoRelativoPasta, nomeArquivo) {
        return new Promise((resolve, reject) => {
            let caminhoAbsolutoArquivo;
            try {
                caminhoAbsolutoArquivo = FS.gerarCaminhoAbsolutoArquivo(caminhoRelativoPasta, nomeArquivo);
            }
            catch (e) {
                reject("Caminho inválido!");
                return;
            }
            try {
                fs.exists(caminhoAbsolutoArquivo, (exists) => {
                    if (!exists) {
                        reject("Arquivo inexistente!");
                        return;
                    }
                    fs.appendFile(caminhoAbsolutoArquivo, arquivo.buffer, (err) => {
                        if (err)
                            reject(err);
                        else
                            resolve();
                    });
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
};
//# sourceMappingURL=upload.js.map