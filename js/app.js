/*
=========================================
FOTOGRAFIAS DO REGISTRO ATUAL
=========================================
*/

let fotografias = [];


/*
=========================================
INICIALIZAÇÃO
=========================================
*/

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        const botaoCameraInicial =
            document.getElementById(
                "btn-camera"
            );

        const botaoCameraFinal =
            document.getElementById(
                "btn-camera-final"
            );

        const botaoReiniciar =
            document.getElementById(
                "btn-reiniciar"
            );

        const botaoGerarPDF =
            document.getElementById(
                "btn-pdf"
            );

        const botaoInformacoes =
            document.getElementById(
                "btn-informacoes"
            );

        const botaoFecharInformacoes =
            document.getElementById(
                "btn-fechar-informacoes"
            );

        const modalInformacoes =
            document.getElementById(
                "modal-informacoes"
            );


        /*
        -----------------------------------------
        CONFIGURA CÂMERA
        -----------------------------------------
        */

        configurarCamera();


        /*
        -----------------------------------------
        CÂMERA INICIAL
        -----------------------------------------
        */

        botaoCameraInicial.addEventListener(
            "click",
            function () {

                abrirCamera();

            }
        );


        /*
        -----------------------------------------
        CÂMERA APÓS AS FOTOS
        -----------------------------------------
        */

        botaoCameraFinal.addEventListener(
            "click",
            function () {

                abrirCamera();

            }
        );


        /*
        -----------------------------------------
        REINICIAR
        -----------------------------------------
        */

        botaoReiniciar.addEventListener(
            "click",
            async function () {

                await reiniciarRegistro();

            }
        );


        /*
        -----------------------------------------
        GERAR PDF
        -----------------------------------------
        */

        botaoGerarPDF.addEventListener(
            "click",
            async function () {

                await gerarPDF();

            }
        );


        /*
        =========================================
        MODAL DE INFORMAÇÕES
        =========================================
        */

        botaoInformacoes.addEventListener(
            "click",
            function () {

                modalInformacoes
                    .classList
                    .remove("oculto");

                document.body.style.overflow =
                    "hidden";

            }
        );


        /*
        -----------------------------------------
        FECHAR PELO X
        -----------------------------------------
        */

        botaoFecharInformacoes
            .addEventListener(
                "click",
                function () {

                    fecharModalInformacoes();

                }
            );


        /*
        -----------------------------------------
        FECHAR CLICANDO FORA
        -----------------------------------------
        */

        modalInformacoes.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    modalInformacoes
                ) {

                    fecharModalInformacoes();

                }

            }
        );


        /*
        -----------------------------------------
        FECHAR COM ESC
        -----------------------------------------
        */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    !modalInformacoes
                        .classList
                        .contains("oculto")
                ) {

                    fecharModalInformacoes();

                }

            }
        );


        /*
        =========================================
        RECUPERA AS FOTOGRAFIAS SALVAS
        =========================================

        Esta é a parte responsável por fazer
        com que as fotografias sobrevivam a:

        - F5;
        - atualização da página;
        - fechamento da aba;
        - fechamento do navegador;
        - abertura posterior da aplicação.

        Nada é apagado aqui.
        */

        fotografias =
            await carregarFotografiasLocais();


        /*
        Mantém a ordem original das fotos.
        */

        fotografias.sort(
            function (a, b) {

                return (
                    a.dataHora -
                    b.dataHora
                );

            }
        );


        atualizarInterface();

    }
);


/*
=========================================
FECHAR MODAL DE INFORMAÇÕES
=========================================
*/

function fecharModalInformacoes() {

    const modalInformacoes =
        document.getElementById(
            "modal-informacoes"
        );


    if (!modalInformacoes) {

        return;

    }


    modalInformacoes
        .classList
        .add("oculto");


    document.body.style.overflow = "";

}


/*
=========================================
ADICIONAR FOTOGRAFIA
=========================================
*/

async function adicionarFotografia(
    arquivo
) {

    /*
    -----------------------------------------
    MOMENTO DA CAPTURA
    -----------------------------------------
    */

    const agora =
        new Date();


    /*
    -----------------------------------------
    OBTÉM GPS
    -----------------------------------------
    */

    const localizacao =
        await obterLocalizacaoGPS();


    /*
    -----------------------------------------
    CRIA O REGISTRO
    -----------------------------------------
    */

    const fotografia = {

        id:
            gerarId(),

        arquivo:
            arquivo,

        url:
            URL.createObjectURL(
                arquivo
            ),

        dataHora:
            agora,

        latitude:
            localizacao.latitude,

        longitude:
            localizacao.longitude,

        precisao:
            localizacao.precisao,

        gpsObtido:
            localizacao.sucesso,

        municipio:
            null,

        uf:
            null

    };


    /*
    -----------------------------------------
    SALVA PRIMEIRO NO INDEXEDDB
    -----------------------------------------

    A fotografia é persistida antes de
    considerarmos o registro concluído.

    Dessa forma, uma atualização ou
    fechamento posterior da página não
    elimina a fotografia.
    */

    try {

        await salvarFotografiaLocal(
            fotografia
        );

    }

    catch (erro) {

        URL.revokeObjectURL(
            fotografia.url
        );

        console.error(
            "Erro ao armazenar a fotografia:",
            erro
        );

        alert(
            "Não foi possível armazenar a fotografia no dispositivo."
        );

        return;

    }


    /*
    -----------------------------------------
    ADICIONA À MEMÓRIA
    -----------------------------------------
    */

    fotografias.push(
        fotografia
    );


    /*
    -----------------------------------------
    ATUALIZA INTERFACE
    -----------------------------------------
    */

    atualizarInterface();


    /*
    -----------------------------------------
    ROLA ATÉ O FINAL
    -----------------------------------------
    */

    setTimeout(
        function () {

            window.scrollTo({

                top:
                    document
                        .documentElement
                        .scrollHeight,

                behavior:
                    "smooth"

            });

        },
        300
    );


    /*
    =========================================
    MUNICÍPIO / UF
    =========================================

    A foto já está armazenada.

    Portanto, demora ou ausência de internet
    nesta consulta não afeta a persistência
    da fotografia.
    */

    if (fotografia.gpsObtido) {

        const local =
            await buscarMunicipioUF(

                fotografia.latitude,
                fotografia.longitude

            );


        /*
        O usuário pode ter excluído a foto
        enquanto a consulta estava sendo
        realizada.
        */

        const fotografiaAindaExiste =
            fotografias.find(
                function (foto) {

                    return (
                        foto.id ===
                        fotografia.id
                    );

                }
            );


        if (!fotografiaAindaExiste) {

            return;

        }


        fotografia.municipio =
            local.municipio;

        fotografia.uf =
            local.uf;


        /*
        Persiste também município/UF.
        */

        try {

            await atualizarFotografiaLocal(
                fotografia
            );

        }

        catch (erro) {

            console.error(
                "Não foi possível atualizar município/UF:",
                erro
            );

        }


        if (
            fotografia.municipio ||
            fotografia.uf
        ) {

            atualizarInterface();

        }

    }

}


/*
=========================================
GERAR IDENTIFICADOR
=========================================
*/

function gerarId() {

    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID ===
            "function"
    ) {

        return crypto.randomUUID();

    }


    return (
        Date.now().toString()
        +
        "-"
        +
        Math.random()
            .toString(16)
            .slice(2)
    );

}


/*
=========================================
ATUALIZAR INTERFACE
=========================================
*/

function atualizarInterface() {

    atualizarContadores();

    atualizarBotoes();

    renderizarHistorico();

}


/*
=========================================
CONTADORES
=========================================
*/

function atualizarContadores() {

    const contadorFotos =
        document.getElementById(
            "contador-fotos"
        );

    const quantidadeFotos =
        document.getElementById(
            "quantidade-fotos"
        );

    const quantidade =
        fotografias.length;


    /*
    -----------------------------------------
    NENHUMA FOTO
    -----------------------------------------
    */

    if (quantidade === 0) {

        contadorFotos.textContent =
            "Nenhuma fotografia registrada";

        quantidadeFotos.textContent =
            "0 fotos";

        quantidadeFotos.classList.add(
            "oculto"
        );

        return;

    }


    /*
    -----------------------------------------
    UMA FOTO
    -----------------------------------------
    */

    if (quantidade === 1) {

        contadorFotos.textContent =
            "1 fotografia registrada";

        quantidadeFotos.textContent =
            "1 foto";

    }


    /*
    -----------------------------------------
    VÁRIAS FOTOS
    -----------------------------------------
    */

    else {

        contadorFotos.textContent =
            `${quantidade} fotografias registradas`;

        quantidadeFotos.textContent =
            `${quantidade} fotos`;

    }


    quantidadeFotos.classList.remove(
        "oculto"
    );

}


/*
=========================================
BOTÕES
=========================================
*/

function atualizarBotoes() {

    const acoesIniciais =
        document.getElementById(
            "acoes-iniciais"
        );

    const acoesFinais =
        document.getElementById(
            "acoes-finais"
        );

    const botaoReiniciar =
        document.getElementById(
            "btn-reiniciar"
        );


    /*
    -----------------------------------------
    EXISTEM FOTOGRAFIAS
    -----------------------------------------
    */

    if (fotografias.length > 0) {

        /*
        Esconde a câmera inicial.
        */

        acoesIniciais.classList.add(
            "oculto"
        );


        /*
        Mostra câmera + PDF abaixo
        da última fotografia.
        */

        acoesFinais.classList.remove(
            "oculto"
        );


        /*
        Mostra Reiniciar.
        */

        botaoReiniciar.classList.remove(
            "oculto"
        );

    }


    /*
    -----------------------------------------
    NÃO EXISTEM FOTOGRAFIAS
    -----------------------------------------
    */

    else {

        /*
        Mostra câmera inicial.
        */

        acoesIniciais.classList.remove(
            "oculto"
        );


        /*
        Esconde botões inferiores.
        */

        acoesFinais.classList.add(
            "oculto"
        );


        /*
        Esconde Reiniciar.
        */

        botaoReiniciar.classList.add(
            "oculto"
        );

    }

}


/*
=========================================
HISTÓRICO
=========================================
*/

function renderizarHistorico() {

    const listaFotos =
        document.getElementById(
            "lista-fotos"
        );

    const historicoVazio =
        document.getElementById(
            "historico-vazio"
        );


    /*
    Limpa somente a representação HTML.

    Isto NÃO apaga nenhuma fotografia
    do IndexedDB.
    */

    listaFotos.innerHTML = "";


    /*
    -----------------------------------------
    HISTÓRICO VAZIO
    -----------------------------------------
    */

    if (fotografias.length === 0) {

        historicoVazio.classList.remove(
            "oculto"
        );

        return;

    }


    /*
    -----------------------------------------
    EXISTEM FOTOS
    -----------------------------------------
    */

    historicoVazio.classList.add(
        "oculto"
    );


    fotografias.forEach(
        function (
            fotografia,
            indice
        ) {

            const item =
                criarItemFotografia(
                    fotografia,
                    indice
                );


            listaFotos.appendChild(
                item
            );

        }
    );

}


/*
=========================================
CRIAR ITEM DO HISTÓRICO
=========================================
*/

function criarItemFotografia(
    fotografia,
    indice
) {

    /*
    -----------------------------------------
    CONTAINER
    -----------------------------------------
    */

    const item =
        document.createElement(
            "article"
        );

    item.className =
        "foto-item";


    /*
    -----------------------------------------
    IMAGEM
    -----------------------------------------
    */

    const imagem =
        document.createElement(
            "img"
        );

    imagem.className =
        "foto-imagem";

    imagem.src =
        fotografia.url;

    imagem.alt =
        `Fotografia ${indice + 1}`;


    /*
    -----------------------------------------
    BOTÃO EXCLUIR
    -----------------------------------------
    */

    const botaoExcluir =
        document.createElement(
            "button"
        );

    botaoExcluir.className =
        "btn-excluir";

    botaoExcluir.type =
        "button";

    botaoExcluir.innerHTML =
        "✕";

    botaoExcluir.setAttribute(
        "aria-label",
        `Excluir fotografia ${indice + 1}`
    );


    botaoExcluir.addEventListener(
        "click",
        function () {

            excluirFotografia(
                fotografia.id
            );

        }
    );


    /*
    -----------------------------------------
    INFORMAÇÕES
    -----------------------------------------
    */

    const informacoes =
        document.createElement(
            "div"
        );

    informacoes.className =
        "foto-informacoes";


    /*
    -----------------------------------------
    TÍTULO
    -----------------------------------------
    */

    const titulo =
        document.createElement(
            "strong"
        );

    titulo.className =
        "foto-titulo";

    titulo.textContent =
        `Fotografia ${String(
            indice + 1
        ).padStart(2, "0")}`;


    /*
    -----------------------------------------
    DATA / HORA
    -----------------------------------------
    */

    const dataHora =
        document.createElement(
            "span"
        );

    dataHora.className =
        "foto-data";

    dataHora.textContent =
        formatarDataHora(
            fotografia.dataHora
        );


    informacoes.appendChild(
        titulo
    );

    informacoes.appendChild(
        dataHora
    );


    /*
    =========================================
    GPS
    =========================================
    */

    if (fotografia.gpsObtido) {

        /*
        -----------------------------------------
        COORDENADAS
        -----------------------------------------
        */

        const coordenadas =
            document.createElement(
                "span"
            );

        coordenadas.className =
            "foto-coordenadas";

        coordenadas.textContent =
            formatarCoordenadas(
                fotografia.latitude,
                fotografia.longitude
            );


        informacoes.appendChild(
            coordenadas
        );


        /*
        -----------------------------------------
        MUNICÍPIO / UF
        -----------------------------------------
        */

        if (
            fotografia.municipio ||
            fotografia.uf
        ) {

            const local =
                document.createElement(
                    "span"
                );

            local.className =
                "foto-local";


            if (
                fotografia.municipio &&
                fotografia.uf
            ) {

                local.textContent =
                    fotografia.municipio
                    +
                    " - "
                    +
                    fotografia.uf;

            }

            else if (
                fotografia.municipio
            ) {

                local.textContent =
                    fotografia.municipio;

            }

            else {

                local.textContent =
                    fotografia.uf;

            }


            informacoes.appendChild(
                local
            );

        }


        /*
        -----------------------------------------
        PRECISÃO DO GPS
        -----------------------------------------
        */

        if (
            fotografia.precisao !== null &&
            fotografia.precisao !== undefined
        ) {

            const precisao =
                document.createElement(
                    "span"
                );

            precisao.className =
                "foto-precisao";

            precisao.textContent =
                "Precisão do GPS: ± "
                +
                Math.round(
                    fotografia.precisao
                )
                +
                " m";


            informacoes.appendChild(
                precisao
            );

        }

    }


    /*
    =========================================
    GPS INDISPONÍVEL
    =========================================
    */

    else {

        const gpsIndisponivel =
            document.createElement(
                "span"
            );

        gpsIndisponivel.className =
            "foto-gps-indisponivel";

        gpsIndisponivel.textContent =
            "Localização não disponível";


        informacoes.appendChild(
            gpsIndisponivel
        );

    }


    /*
    -----------------------------------------
    MONTAGEM FINAL
    -----------------------------------------
    */

    item.appendChild(
        imagem
    );

    item.appendChild(
        botaoExcluir
    );

    item.appendChild(
        informacoes
    );


    return item;

}


/*
=========================================
FORMATAR DATA E HORA
=========================================
*/

function formatarDataHora(data) {

    if (!(data instanceof Date)) {

        data =
            new Date(data);

    }


    const dataFormatada =
        data.toLocaleDateString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );


    const horaFormatada =
        data.toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );


    return (
        `${dataFormatada}  ${horaFormatada}`
    );

}


/*
=========================================
EXCLUIR FOTOGRAFIA
=========================================
*/

async function excluirFotografia(id) {

    const fotografia =
        fotografias.find(
            function (foto) {

                return foto.id === id;

            }
        );


    if (!fotografia) {

        return;

    }


    /*
    -----------------------------------------
    CONFIRMAÇÃO
    -----------------------------------------
    */

    const confirmar =
        window.confirm(
            "Deseja excluir esta fotografia?"
        );


    if (!confirmar) {

        return;

    }


    /*
    Primeiro removemos do IndexedDB.

    Assim, se ocorrer algum erro de
    armazenamento, não removemos apenas
    visualmente uma foto que ainda está salva.
    */

    try {

        await excluirFotografiaLocal(
            id
        );

    }

    catch (erro) {

        console.error(
            "Não foi possível excluir a fotografia:",
            erro
        );

        alert(
            "Não foi possível excluir a fotografia."
        );

        return;

    }


    /*
    Libera a URL temporária somente depois
    que a exclusão persistente foi concluída.
    */

    URL.revokeObjectURL(
        fotografia.url
    );


    /*
    Remove da memória.
    */

    fotografias =
        fotografias.filter(
            function (foto) {

                return foto.id !== id;

            }
        );


    atualizarInterface();

}


/*
=========================================
REINICIAR REGISTRO
=========================================
*/

async function reiniciarRegistro() {

    if (fotografias.length === 0) {

        return;

    }


    /*
    -----------------------------------------
    CONFIRMAÇÃO
    -----------------------------------------
    */

    const confirmar =
        window.confirm(
            "Deseja reiniciar o registro?\n\n"
            +
            "Todas as fotografias serão excluídas."
        );


    if (!confirmar) {

        return;

    }


    /*
    -----------------------------------------
    LIMPA O INDEXEDDB PRIMEIRO
    -----------------------------------------

    Esta é a única operação que remove
    todo o relatório armazenado.

    Atualizar ou fechar a página nunca
    executa esta função.
    */

    try {

        await limparFotografiasLocais();

    }

    catch (erro) {

        console.error(
            "Não foi possível reiniciar o registro:",
            erro
        );

        alert(
            "Não foi possível reiniciar o registro."
        );

        return;

    }


    /*
    -----------------------------------------
    LIBERA URLs TEMPORÁRIAS
    -----------------------------------------
    */

    fotografias.forEach(
        function (fotografia) {

            URL.revokeObjectURL(
                fotografia.url
            );

        }
    );


    /*
    -----------------------------------------
    LIMPA MEMÓRIA
    -----------------------------------------
    */

    fotografias = [];


    /*
    -----------------------------------------
    ATUALIZA INTERFACE
    -----------------------------------------
    */

    atualizarInterface();

}