/*
=========================================
CONFIGURAÇÕES DO PDF
=========================================
*/

const PDF_CONFIG = {

    formato: "a4",

    orientacao: "portrait",

    unidade: "mm",

    /*
    Margens externas da página.
    Aproximadas do relatório de referência.
    */

    margemX: 6,

    margemSuperior: 6,

    margemInferior: 6,

    /*
    Espaço entre os quatro retângulos.
    */

    espacoColunas: 2,

    espacoLinhas: 2,

    /*
    Espaço interno entre a borda da célula
    e a fotografia.
    */

    paddingCelula: 2,

    /*
    Espessura da borda dos retângulos.
    */

    espessuraBordaCelula: 0.25,

    qualidadeJPEG: 0.92,

    /*
        Evita inserir imagens gigantescas no PDF.

        A foto continua com resolução mais do que
        suficiente para o tamanho físico em A4,
        mas sem gerar PDFs absurdamente pesados.
    */

    larguraMaximaImagemPx: 1800

};




// async function gerarPDF() {

//     if (
//         !Array.isArray(fotografias) ||
//         fotografias.length === 0
//     ) {
//         return;
//     }


//     if (
//         !window.jspdf ||
//         !window.jspdf.jsPDF
//     ) {
//         console.error("jsPDF não foi carregado.");
//         return;
//     }


//     const { jsPDF } = window.jspdf;


//     const pdf = new jsPDF({
//         orientation: PDF_CONFIG.orientacao,
//         unit: PDF_CONFIG.unidade,
//         format: PDF_CONFIG.formato,
//         compress: true
//     });


//     /*
//     =========================================
//     DIMENSÕES DA PÁGINA
//     =========================================
//     */

//     const larguraPagina =
//         pdf.internal.pageSize.getWidth();

//     const alturaPagina =
//         pdf.internal.pageSize.getHeight();


//     /*
//     =========================================
//     DUAS COLUNAS
//     =========================================
//     */

//     const larguraUtil =
//         larguraPagina
//         -
//         PDF_CONFIG.margemX * 2;


//     const larguraColuna =
//         (
//             larguraUtil
//             -
//             PDF_CONFIG.espacoColunas
//         ) / 2;


//     /*
//     =========================================
//     DUAS LINHAS

//     Divide a altura útil exatamente em duas
//     regiões.

//     Isso garante até 4 fotos por página.
//     =========================================
//     */

//     const alturaUtil =
//         alturaPagina
//         -
//         PDF_CONFIG.margemSuperior
//         -
//         PDF_CONFIG.margemInferior;


//     const alturaCelula =
//         (
//             alturaUtil
//             -
//             PDF_CONFIG.espacoLinhas
//         ) / 2;


//     /*
//     =========================================
//     PROCESSA 4 FOTOS POR PÁGINA
//     =========================================
//     */

//     for (
//         let indice = 0;
//         indice < fotografias.length;
//         indice += 4
//     ) {

//         /*
//         Adiciona nova página depois
//         das primeiras quatro fotografias.
//         */

//         if (indice > 0) {
//             pdf.addPage();
//         }


//         /*
//         -----------------------------------------
//         FOTOS DESTA PÁGINA
//         -----------------------------------------
//         */

//         const fotosPagina =
//             fotografias.slice(
//                 indice,
//                 indice + 4
//             );


//         for (
//             let posicao = 0;
//             posicao < fotosPagina.length;
//             posicao++
//         ) {

//             const fotografia =
//                 fotosPagina[posicao];


//             /*
//             =====================================
//             POSIÇÃO NA GRADE

//             0 = superior esquerda
//             1 = superior direita
//             2 = inferior esquerda
//             3 = inferior direita
//             =====================================
//             */

//             const coluna =
//                 posicao % 2;


//             const linha =
//                 Math.floor(
//                     posicao / 2
//                 );


//             /*
//             -------------------------------------
//             PREPARA A FOTO
//             -------------------------------------
//             */

//             const preparada =
//                 await prepararFotografiaPDF(
//                     fotografia,
//                     larguraColuna
//                 );


//             /*
//             =====================================
//             FAZ A FOTO OCUPAR O MAIOR ESPAÇO
//             POSSÍVEL DENTRO DO RETÂNGULO

//             SEM DISTORCER
//             SEM CORTAR
//             =====================================
//             */

//             let larguraFinal =
//                 larguraColuna;


//             let alturaFinal =
//                 larguraFinal
//                 *
//                 (
//                     preparada.alturaMM
//                     /
//                     preparada.larguraMM
//                 );


//             /*
//             Se ficou alta demais para a célula,
//             usamos a altura como limitador.
//             */

//             if (
//                 alturaFinal >
//                 alturaCelula
//             ) {

//                 alturaFinal =
//                     alturaCelula;


//                 larguraFinal =
//                     alturaFinal
//                     *
//                     (
//                         preparada.larguraMM
//                         /
//                         preparada.alturaMM
//                     );

//             }


//             preparada.larguraMM =
//                 larguraFinal;


//             preparada.alturaMM =
//                 alturaFinal;


//             /*
//             =====================================
//             POSIÇÃO DA CÉLULA
//             =====================================
//             */

//             const xCelula =
//                 PDF_CONFIG.margemX
//                 +
//                 coluna
//                 *
//                 (
//                     larguraColuna
//                     +
//                     PDF_CONFIG.espacoColunas
//                 );


//             const yCelula =
//                 PDF_CONFIG.margemSuperior
//                 +
//                 linha
//                 *
//                 (
//                     alturaCelula
//                     +
//                     PDF_CONFIG.espacoLinhas
//                 );


//             /*
//             =====================================
//             CENTRALIZA DENTRO DO RETÂNGULO
//             =====================================
//             */

//             const xFoto =
//                 xCelula
//                 +
//                 (
//                     larguraColuna
//                     -
//                     larguraFinal
//                 ) / 2;


//             const yFoto =
//                 yCelula
//                 +
//                 (
//                     alturaCelula
//                     -
//                     alturaFinal
//                 ) / 2;


//             /*
//             -------------------------------------
//             INSERE FOTO
//             -------------------------------------
//             */

//             adicionarFotografiaAoPDF(
//                 pdf,
//                 preparada,
//                 xFoto,
//                 yFoto
//             );

//         }

//     }


//     /*
//     =========================================
//     NOME DO PDF

//     Mantenha aqui o nome que você já escolheu.
//     =========================================
//     */

//     const agora =
//         new Date();


//     const nomeArquivo =
//         "Registro_Fotografico_"
//         +
//         String(
//             agora.getDate()
//         ).padStart(2, "0")
//         +
//         "-"
//         +
//         String(
//             agora.getMonth() + 1
//         ).padStart(2, "0")
//         +
//         "-"
//         +
//         agora.getFullYear()
//         +
//         "_"
//         +
//         String(
//             agora.getHours()
//         ).padStart(2, "0")
//         +
//         "-"
//         +
//         String(
//             agora.getMinutes()
//         ).padStart(2, "0")
//         +
//         ".pdf";


//     pdf.save(nomeArquivo);

// }

async function gerarPDF() {

    if (
        !Array.isArray(fotografias) ||
        fotografias.length === 0
    ) {
        return;
    }


    if (
        !window.jspdf ||
        !window.jspdf.jsPDF
    ) {

        console.error(
            "jsPDF não foi carregado."
        );

        return;
    }


    const { jsPDF } =
        window.jspdf;


    /*
    =========================================
    CRIA O DOCUMENTO
    =========================================
    */

    const pdf = new jsPDF({

        orientation:
            PDF_CONFIG.orientacao,

        unit:
            PDF_CONFIG.unidade,

        format:
            PDF_CONFIG.formato,

        compress:
            true

    });


    /*
    =========================================
    DIMENSÕES DA PÁGINA
    =========================================
    */

    const larguraPagina =
        pdf.internal.pageSize.getWidth();

    const alturaPagina =
        pdf.internal.pageSize.getHeight();


    /*
    =========================================
    ÁREA ÚTIL
    =========================================
    */

    const larguraUtil =
        larguraPagina
        -
        PDF_CONFIG.margemX * 2;


    const alturaUtil =
        alturaPagina
        -
        PDF_CONFIG.margemSuperior
        -
        PDF_CONFIG.margemInferior;


    /*
    =========================================
    TAMANHO DOS 4 RETÂNGULOS
    =========================================

       ┌──────────┐ ┌──────────┐
       │          │ │          │
       │    1     │ │    2     │
       │          │ │          │
       └──────────┘ └──────────┘

       ┌──────────┐ ┌──────────┐
       │          │ │          │
       │    3     │ │    4     │
       │          │ │          │
       └──────────┘ └──────────┘

    =========================================
    */

    const larguraCelula =
        (
            larguraUtil
            -
            PDF_CONFIG.espacoColunas
        )
        / 2;


    const alturaCelula =
        (
            alturaUtil
            -
            PDF_CONFIG.espacoLinhas
        )
        / 2;


    /*
    =========================================
    ÁREA DISPONÍVEL PARA A FOTO

    Deixamos um pequeno espaço entre
    a fotografia e a borda do retângulo.
    =========================================
    */

    const larguraFotoDisponivel =
        larguraCelula
        -
        PDF_CONFIG.paddingCelula * 2;


    const alturaFotoDisponivel =
        alturaCelula
        -
        PDF_CONFIG.paddingCelula * 2;


    /*
    =========================================
    PROCESSA 4 FOTOS POR PÁGINA
    =========================================
    */

    for (
        let indice = 0;
        indice < fotografias.length;
        indice += 4
    ) {


        /*
        -----------------------------------------
        NOVA PÁGINA
        -----------------------------------------
        */

        if (indice > 0) {

            pdf.addPage();

        }


        const fotosPagina =
            fotografias.slice(
                indice,
                indice + 4
            );


        /*
        =========================================
        DESENHA OS QUATRO RETÂNGULOS

        Mesmo que uma determinada célula ainda
        não possua fotografia, a grade permanece
        visualmente organizada.
        =========================================
        */

        for (
            let posicaoCelula = 0;
            posicaoCelula < 4;
            posicaoCelula++
        ) {

            const colunaCelula =
                posicaoCelula % 2;


            const linhaCelula =
                Math.floor(
                    posicaoCelula / 2
                );


            const xCelula =
                PDF_CONFIG.margemX
                +
                colunaCelula
                *
                (
                    larguraCelula
                    +
                    PDF_CONFIG.espacoColunas
                );


            const yCelula =
                PDF_CONFIG.margemSuperior
                +
                linhaCelula
                *
                (
                    alturaCelula
                    +
                    PDF_CONFIG.espacoLinhas
                );


            /*
            -----------------------------------------
            BORDA CINZA CLARA
            -----------------------------------------
            */

            pdf.setDrawColor(
                205,
                205,
                205
            );


            pdf.setLineWidth(
                PDF_CONFIG
                    .espessuraBordaCelula
            );


            pdf.rect(

                xCelula,

                yCelula,

                larguraCelula,

                alturaCelula

            );

        }


        /*
        =========================================
        INSERE AS FOTOGRAFIAS
        =========================================
        */

        for (
            let posicao = 0;
            posicao < fotosPagina.length;
            posicao++
        ) {

            const fotografia =
                fotosPagina[posicao];


            /*
            -----------------------------------------
            POSIÇÃO NA GRADE
            -----------------------------------------
            */

            const coluna =
                posicao % 2;


            const linha =
                Math.floor(
                    posicao / 2
                );


            /*
            -----------------------------------------
            POSIÇÃO DO RETÂNGULO
            -----------------------------------------
            */

            const xCelula =
                PDF_CONFIG.margemX
                +
                coluna
                *
                (
                    larguraCelula
                    +
                    PDF_CONFIG.espacoColunas
                );


            const yCelula =
                PDF_CONFIG.margemSuperior
                +
                linha
                *
                (
                    alturaCelula
                    +
                    PDF_CONFIG.espacoLinhas
                );


            /*
            =========================================
            PREPARA A FOTOGRAFIA
            =========================================
            */

            const preparada =
                await prepararFotografiaPDF(

                    fotografia,

                    larguraFotoDisponivel

                );


            /*
            =========================================
            DIMENSÕES DA FOTOGRAFIA
            =========================================

            Primeiro tentamos ocupar toda a
            largura disponível.
            */

            let larguraFinal =
                larguraFotoDisponivel;


            let alturaFinal =
                larguraFinal
                *
                (
                    preparada.alturaMM
                    /
                    preparada.larguraMM
                );


            /*
            Se a altura ultrapassar a área
            disponível, a altura passa a ser
            o fator limitante.

            A proporção original é sempre
            preservada.
            */

            if (
                alturaFinal >
                alturaFotoDisponivel
            ) {

                alturaFinal =
                    alturaFotoDisponivel;


                larguraFinal =
                    alturaFinal
                    *
                    (
                        preparada.larguraMM
                        /
                        preparada.alturaMM
                    );

            }


            preparada.larguraMM =
                larguraFinal;


            preparada.alturaMM =
                alturaFinal;


            /*
            =========================================
            CENTRALIZA A FOTO NO RETÂNGULO
            =========================================
            */

            const xFoto =
                xCelula
                +
                (
                    larguraCelula
                    -
                    larguraFinal
                )
                / 2;


            const yFoto =
                yCelula
                +
                (
                    alturaCelula
                    -
                    alturaFinal
                )
                / 2;


            /*
            =========================================
            INSERE A FOTO
            =========================================
            */

            adicionarFotografiaAoPDF(

                pdf,

                preparada,

                xFoto,

                yFoto

            );

        }

    }


    /*
    =========================================
    NOME DO ARQUIVO
    =========================================
    */

    const agora =
        new Date();


    const nomeArquivo =
        "Registro_Fotografico_"
        +
        String(
            agora.getDate()
        ).padStart(2, "0")
        +
        "-"
        +
        String(
            agora.getMonth() + 1
        ).padStart(2, "0")
        +
        "-"
        +
        agora.getFullYear()
        +
        "_"
        +
        String(
            agora.getHours()
        ).padStart(2, "0")
        +
        "-"
        +
        String(
            agora.getMinutes()
        ).padStart(2, "0")
        +
        ".pdf";


    /*
    =========================================
    SALVA O PDF
    =========================================
    */

    pdf.save(
        nomeArquivo
    );

}


/*
=========================================
PREPARAR FOTOGRAFIA
=========================================
*/

async function prepararFotografiaPDF(
    fotografia,
    larguraColuna
) {

    /*
    -----------------------------------------
    CARREGA IMAGEM ORIGINAL
    -----------------------------------------
    */

    const imagem =
        await carregarImagemArquivo(
            fotografia.arquivo
        );


    /*
    -----------------------------------------
    CORRIGE DIMENSÕES
    -----------------------------------------
    */

    const larguraOriginal =
        imagem.naturalWidth
        ||
        imagem.width;


    const alturaOriginal =
        imagem.naturalHeight
        ||
        imagem.height;


    /*
    -----------------------------------------
    DIMENSÕES FÍSICAS NO PDF
    -----------------------------------------

    A largura ocupa a coluna inteira.

    A altura é proporcional.
    */

    const larguraMM =
        larguraColuna;


    const alturaMM =
        larguraMM
        *
        (
            alturaOriginal
            /
            larguraOriginal
        );


    /*
    =========================================
    CANVAS FINAL
    =========================================

    Criamos uma versão adequada ao PDF.

    É aqui que também desenhamos o timestamp.

    A fotografia armazenada originalmente
    permanece intacta.
    */

    let larguraCanvas =
        larguraOriginal;


    let alturaCanvas =
        alturaOriginal;


    /*
        Evita colocar, por exemplo, uma imagem
        de 8000 px no PDF quando ela será exibida
        em aproximadamente 90 mm.
    */

    if (
        larguraCanvas >
        PDF_CONFIG.larguraMaximaImagemPx
    ) {

        const escala =
            PDF_CONFIG.larguraMaximaImagemPx
            /
            larguraCanvas;


        larguraCanvas =
            Math.round(
                larguraCanvas * escala
            );


        alturaCanvas =
            Math.round(
                alturaCanvas * escala
            );

    }


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        larguraCanvas;

    canvas.height =
        alturaCanvas;


    const contexto =
        canvas.getContext(
            "2d",
            {
                alpha: false
            }
        );


    /*
    -----------------------------------------
    QUALIDADE DE REDIMENSIONAMENTO
    -----------------------------------------
    */

    contexto.imageSmoothingEnabled =
        true;

    contexto.imageSmoothingQuality =
        "high";


    /*
    -----------------------------------------
    DESENHA A FOTO
    -----------------------------------------
    */

    contexto.drawImage(

        imagem,

        0,
        0,

        larguraCanvas,
        alturaCanvas

    );


    /*
    -----------------------------------------
    TIMESTAMP SOBRE A FOTO
    -----------------------------------------
    */

    const timestamp =
        desenharTimestamp(

            contexto,

            fotografia,

            larguraCanvas,

            alturaCanvas

        );


    /*
    -----------------------------------------
    CONVERTE PARA JPEG
    -----------------------------------------
    */

    const dadosImagem =
        canvas.toDataURL(

            "image/jpeg",

            PDF_CONFIG.qualidadeJPEG

        );


    return {

        fotografia:
            fotografia,

        dadosImagem:
            dadosImagem,

        larguraMM:
            larguraMM,

        alturaMM:
            alturaMM,

        larguraCanvas:
            larguraCanvas,

        alturaCanvas:
            alturaCanvas,

        /*
            Retângulo da coordenada dentro
            do Canvas.

            Será convertido depois para mm
            para criarmos o hyperlink.
        */

        coordenadasRect:
            timestamp.coordenadasRect

    };

}


/*
=========================================
CARREGAR IMAGEM
=========================================
*/

function carregarImagemArquivo(
    arquivo
) {

    return new Promise(
        function (resolve, reject) {

            const url =
                URL.createObjectURL(
                    arquivo
                );


            const imagem =
                new Image();


            imagem.onload =
                function () {

                    URL.revokeObjectURL(
                        url
                    );

                    resolve(
                        imagem
                    );

                };


            imagem.onerror =
                function () {

                    URL.revokeObjectURL(
                        url
                    );

                    reject(
                        new Error(
                            "Não foi possível carregar a fotografia."
                        )
                    );

                };


            imagem.src =
                url;

        }
    );

}


/*
=========================================
TIMESTAMP
=========================================
*/

function desenharTimestamp(
    contexto,
    fotografia,
    largura,
    altura
) {

    /*
    =========================================
    LINHAS
    =========================================
    */

    const linhas = [];


    /*
    -----------------------------------------
    DATA / HORA
    -----------------------------------------
    */

    linhas.push({

        tipo:
            "data",

        texto:
            formatarDataHoraTimestamp(
                fotografia.dataHora
            )

    });


    /*
    -----------------------------------------
    COORDENADAS
    -----------------------------------------
    */

    let textoCoordenadas =
        null;


    if (
        fotografia.gpsObtido &&
        fotografia.latitude !== null &&
        fotografia.longitude !== null
    ) {

        textoCoordenadas =
            formatarCoordenadas(

                fotografia.latitude,

                fotografia.longitude

            );


        linhas.push({

            tipo:
                "coordenadas",

            texto:
                textoCoordenadas

        });

    }


    /*
    -----------------------------------------
    MUNICÍPIO / UF
    -----------------------------------------
    */

    const local =
        formatarMunicipioUF(
            fotografia
        );


    if (local) {

        linhas.push({

            tipo:
                "local",

            texto:
                local

        });

    }


    /*
        Não existe informação para escrever.
    */

    if (linhas.length === 0) {

        return {
            coordenadasRect: null
        };

    }


    /*
    =========================================
    TAMANHO DA FONTE DO TIMESTAMP
    =========================================
    */

    const fotoVertical =
        altura > largura;


    let tamanhoFonte;


    if (fotoVertical) {

        /*
            Aumenta o timestamp das fotos em pé
            para manter aproximadamente o mesmo
            tamanho visual das fotos deitadas
            quando inseridas no PDF.
        */

        tamanhoFonte =
            Math.round(
                largura * 0.040
            );

    }
    else {

        /*
            Mantém o tamanho atual das fotos
            horizontais.
        */

        tamanhoFonte =
            Math.round(
                largura * 0.026
            );

    }


    tamanhoFonte =
        Math.max(
            20,
            Math.min(
                tamanhoFonte,
                60
            )
        );


    const espacamento =
        Math.round(
            tamanhoFonte * 1.28
        );


    const paddingX =
        Math.round(
            tamanhoFonte * 0.55
        );


    const paddingY =
        Math.round(
            tamanhoFonte * 0.42
        );


    /*
    =========================================
    CONFIGURA TEXTO
    =========================================
    */

    contexto.font =
        `600 ${tamanhoFonte}px Arial, sans-serif`;

    contexto.textAlign =
        "right";

    contexto.textBaseline =
        "alphabetic";


    /*
    =========================================
    DESCOBRE LARGURA DO MAIOR TEXTO
    =========================================
    */

    let maiorLargura =
        0;


    linhas.forEach(
        function (linha) {

            const medida =
                contexto.measureText(
                    linha.texto
                ).width;


            if (
                medida >
                maiorLargura
            ) {

                maiorLargura =
                    medida;

            }

        }
    );


    /*
    =========================================
    POSIÇÃO

    CANTO INFERIOR DIREITO
    =========================================
    */

    const margem =
        Math.max(
            12,
            Math.round(
                largura * 0.018
            )
        );


    const larguraCaixa =
        maiorLargura
        +
        paddingX * 2;


    const alturaCaixa =
        (
            linhas.length
            *
            espacamento
        )
        +
        paddingY * 2;


    const caixaX =
        largura
        -
        margem
        -
        larguraCaixa;


    const caixaY =
        altura
        -
        margem
        -
        alturaCaixa;


    /*
    =========================================
    FUNDO SEMITRANSPARENTE
    =========================================

    Melhora a leitura sobre fundos claros
    e escuros sem cobrir excessivamente a foto.
    */

    contexto.save();


    contexto.fillStyle =
        "rgba(0, 0, 0, 0.52)";


    /*
        Cantos discretamente arredondados.
    */

    desenharRetanguloArredondado(

        contexto,

        caixaX,
        caixaY,

        larguraCaixa,
        alturaCaixa,

        Math.max(
            6,
            tamanhoFonte * 0.25
        )

    );


    contexto.fill();


    /*
    =========================================
    TEXTO
    =========================================
    */

    contexto.fillStyle =
        "#FFFFFF";


    /*
        Sombra discreta para aumentar
        a legibilidade.
    */

    contexto.shadowColor =
        "rgba(0, 0, 0, 0.75)";

    contexto.shadowBlur =
        Math.max(
            1,
            tamanhoFonte * 0.08
        );

    contexto.shadowOffsetX =
        1;

    contexto.shadowOffsetY =
        1;


    const textoX =
        largura
        -
        margem
        -
        paddingX;


    let linhaY =
        caixaY
        +
        paddingY
        +
        tamanhoFonte;


    let coordenadasRect =
        null;


    linhas.forEach(
        function (linha) {

            contexto.fillText(

                linha.texto,

                textoX,

                linhaY

            );


            /*
            =====================================
            ÁREA CLICÁVEL DAS COORDENADAS
            =====================================
            */

            if (
                linha.tipo ===
                "coordenadas"
            ) {

                const larguraTexto =
                    contexto.measureText(
                        linha.texto
                    ).width;


                coordenadasRect = {

                    x:
                        textoX
                        -
                        larguraTexto,

                    y:
                        linhaY
                        -
                        tamanhoFonte,

                    largura:
                        larguraTexto,

                    altura:
                        espacamento

                };

            }


            linhaY +=
                espacamento;

        }
    );


    contexto.restore();


    return {

        coordenadasRect:
            coordenadasRect

    };

}


/*
=========================================
DATA/HORA DO TIMESTAMP
=========================================
*/

function formatarDataHoraTimestamp(
    data
) {

    if (!(data instanceof Date)) {

        data =
            new Date(data);

    }


    /*
    -----------------------------------------
    DATA
    -----------------------------------------
    */

    const partesData =
        new Intl.DateTimeFormat(
            "pt-BR",
            {
                day:
                    "2-digit",

                month:
                    "short",

                year:
                    "numeric"
            }
        )
        .formatToParts(
            data
        );


    let dia =
        "";

    let mes =
        "";

    let ano =
        "";


    partesData.forEach(
        function (parte) {

            if (
                parte.type === "day"
            ) {

                dia =
                    parte.value;

            }


            else if (
                parte.type === "month"
            ) {

                mes =
                    parte.value
                        .replace(".", "")
                        .toLowerCase();

            }


            else if (
                parte.type === "year"
            ) {

                ano =
                    parte.value;

            }

        }
    );


    /*
    -----------------------------------------
    HORA
    -----------------------------------------
    */

    const hora =
        data.toLocaleTimeString(
            "pt-BR",
            {
                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit",

                hour12:
                    false
            }
        );


    return (
        `${dia} de ${mes}. de ${ano}  ${hora}`
    );

}


/*
=========================================
MUNICÍPIO / UF
=========================================
*/

function formatarMunicipioUF(
    fotografia
) {

    if (
        fotografia.municipio &&
        fotografia.uf
    ) {

        return (
            fotografia.municipio
            +
            " - "
            +
            fotografia.uf
        );

    }


    if (
        fotografia.municipio
    ) {

        return fotografia.municipio;

    }


    if (
        fotografia.uf
    ) {

        return fotografia.uf;

    }


    return null;

}


/*
=========================================
APLICAR ESCALA
=========================================
*/

function aplicarEscalaFotografia(
    fotografiaPreparada,
    escala
) {

    fotografiaPreparada.larguraMM *=
        escala;

    fotografiaPreparada.alturaMM *=
        escala;

}


/*
=========================================
ADICIONAR FOTOGRAFIA AO PDF
=========================================
*/

function adicionarFotografiaAoPDF(
    pdf,
    preparada,
    x,
    y
) {

    /*
    =========================================
    ADICIONA A FOTOGRAFIA
    =========================================
    */

    pdf.addImage(

        preparada.dadosImagem,

        "JPEG",

        x,
        y,

        preparada.larguraMM,
        preparada.alturaMM,

        undefined,

        "FAST"

    );


    /*
    =========================================
    TODA A FOTOGRAFIA ABRE O GOOGLE MAPS
    =========================================
    */

    const fotografia =
        preparada.fotografia;


    if (
        fotografia.gpsObtido &&
        fotografia.latitude !== null &&
        fotografia.longitude !== null
    ) {

        /*
        -----------------------------------------
        LINK DO GOOGLE MAPS
        -----------------------------------------
        */

        const urlMaps =
            "https://www.google.com/maps/search/?api=1&query="
            +
            encodeURIComponent(
                fotografia.latitude
                +
                ","
                +
                fotografia.longitude
            );


        /*
        -----------------------------------------
        ÁREA CLICÁVEL

        O link ocupa exatamente toda a área
        da fotografia no PDF.
        -----------------------------------------
        */

        pdf.link(

            x,
            y,

            preparada.larguraMM,
            preparada.alturaMM,

            {
                url: urlMaps
            }

        );

    }

}


/*
=========================================
RETÂNGULO ARREDONDADO
=========================================
*/

function desenharRetanguloArredondado(
    contexto,
    x,
    y,
    largura,
    altura,
    raio
) {

    const r =
        Math.min(
            raio,
            largura / 2,
            altura / 2
        );


    contexto.beginPath();


    contexto.moveTo(
        x + r,
        y
    );


    contexto.lineTo(
        x + largura - r,
        y
    );


    contexto.quadraticCurveTo(
        x + largura,
        y,
        x + largura,
        y + r
    );


    contexto.lineTo(
        x + largura,
        y + altura - r
    );


    contexto.quadraticCurveTo(
        x + largura,
        y + altura,
        x + largura - r,
        y + altura
    );


    contexto.lineTo(
        x + r,
        y + altura
    );


    contexto.quadraticCurveTo(
        x,
        y + altura,
        x,
        y + altura - r
    );


    contexto.lineTo(
        x,
        y + r
    );


    contexto.quadraticCurveTo(
        x,
        y,
        x + r,
        y
    );


    contexto.closePath();

}