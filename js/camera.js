function abrirCamera() {

    const inputCamera = document.getElementById("input-camera");

    if (!inputCamera) {
        console.error("O campo da câmera não foi encontrado.");
        return;
    }

    /*
        Limpa a seleção anterior.

        Isso permite, por exemplo, selecionar novamente
        a mesma fotografia durante os testes.
    */
    inputCamera.value = "";

    inputCamera.click();
}


function configurarCamera() {

    const inputCamera = document.getElementById("input-camera");

    if (!inputCamera) {
        console.error("O campo da câmera não foi encontrado.");
        return;
    }

    inputCamera.addEventListener("change", function (event) {

        const arquivo = event.target.files[0];

        if (!arquivo) {
            return;
        }

        if (!arquivo.type.startsWith("image/")) {
            alert("O arquivo selecionado não é uma imagem.");
            return;
        }

        adicionarFotografia(arquivo);
    });
}