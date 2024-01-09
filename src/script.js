window.onload = function(){

    const valueSepia = document.getElementById('valueSepia');
    const sepia = document.getElementById('sepia');
    const valorEscalaCinza = document.getElementById('valorEscalaCinza');
    const reset = document.getElementById('reset');
    const escalaCinza = document.getElementById('escalaCinza');
    const opacity1 = document.getElementById('opacity1');
    const valueOpacity = document.getElementById('valueOpacity');
    const corFundo = document.getElementById('corFundo');
    const blur = document.getElementById('blur');
    const valueBlur = document.getElementById('valueBlur');
    //const newNameSave = document.getElementById('newNameSave');
    const imgPreview = document.getElementById('imgPreview');
    const input = document.getElementById('imageInput');
    const canvas = document.getElementById('outputCanvas');
    const downloadButton = document.getElementById('downloadButton');
    const img = new Image();
    const ctx = canvas.getContext('2d');
    const nomeImg = document.getElementById("nomeImg");
    const tamanhoImg = document.getElementById("tamanhoImg");
    const alturaImg = document.getElementById("alturaImg");
    const larguraImg = document.getElementById("larguraImg");

    input.addEventListener('change', applyFilterAndDraw);
    sepia.addEventListener('change', applyFilter);
    escalaCinza.addEventListener('change', applyFilter);
    opacity1.addEventListener('change', applyFilter);
    blur.addEventListener('change', applyFilter);

    const canvasPrincial = document.createElement('canvas');
    const ctx2 = canvasPrincial.getContext('2d');
    
    reset.addEventListener("click",()=>{
        opacity1.value = 100;
        escalaCinza.value = 0;
        sepia.value = 0;
        blur.value = 0;
        corFundo.value = "#ffffff";
        canvas.style.background = "#fff";
        imgPreview.style.background = "#fff";
        applyFilter();
    });
    
    corFundo.addEventListener("change",()=>{
        canvas.style.background = corFundo.value;
        imgPreview.style.background = corFundo.value;
    })
    
    function applyFilter(){

        valueOpacity.textContent = opacity1.value;
        valorEscalaCinza.textContent = escalaCinza.value;
        valueBlur.textContent  = blur.value;
        valueSepia.textContent = sepia.value;

        // Limpar o canvas antes de desenhar a nova imagem
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx2.clearRect(0, 0, canvasPrincial.width, canvasPrincial.height);
        
        // Filtros
        ctx.filter = 'sepia(' + sepia.value + '%) grayscale(' + escalaCinza.value + '%) blur(' + blur.value + 'px)';        
        ctx.globalAlpha = opacity1.value / 100;
        ctx2.filter = 'sepia(' + sepia.value + '%) grayscale(' + escalaCinza.value + '%) blur(' + blur.value + 'px)';        
        ctx2.globalAlpha = opacity1.value / 100;

        // Desenhar a imagem no canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx2.drawImage(img, 0, 0, canvasPrincial.width, canvasPrincial.height);
    }

    function applyFilterAndDraw() {
        
        img.src = URL.createObjectURL(input.files[0]);

        img.onload = function() {

            canvasPrincial.width  = img.width;
            canvasPrincial.height = img.height;

            escalaCinza.value = 0;
            escalaCinza.disabled = false;
            blur.disabled = false;
            downloadButton.disabled = false;
            //newNameSave.disabled = false;
            opacity1.disabled = false;
            reset.disabled = false;
            sepia.disabled = false;

            // Limitar o width e height ao máximo de 500 pixels
            const maxWidth = window.innerWidth * 0.75;
            const maxHeight = window.innerHeight * 0.9;

            let newWidth, newHeight;

            if (img.width > img.height) {
                
                newWidth = Math.min(img.width, maxWidth);
                newHeight = (newWidth / img.width) * img.height;
            
            } else if (img.width < img.height) {
                
                newHeight = Math.min(img.height, maxHeight);
                newWidth = (newHeight / img.height) * img.width;
            
            } else {
                
                // Se width e height são iguais, limitar ambos a 500
                newWidth = newHeight = Math.min(img.width, img.height, maxWidth, maxHeight);
            
            }

            imgPreview.style.width  = newWidth   + "px";
            imgPreview.style.height = newHeight  + "px";
            imgPreview.src = img.src;

            canvas.width = newWidth;
            canvas.height= newHeight;

            nomeImg.textContent    = imageInput.files[0].name;
            larguraImg.textContent = img.width + "px";
            alturaImg.textContent  = img.height + "px";
            tamanhoImg.textContent = imageInput.files[0].size + " Bytes";

            applyFilter();
        };
    }

    downloadButton.addEventListener('click', function() {

        //parte para app electron
        // Obter o conteúdo do Canvas como uma string base64
        const base64Image = canvasPrincial.toDataURL("image/png");

        // Criar um link temporário
        const link = document.createElement('a');
        link.href = base64Image;

        //Nome
        link.download = imageInput.files[0].name;

        // Simular um clique no link para iniciar o download
        document.body.appendChild(link);
        link.click();

        // Remover o link temporário do DOM
        document.body.removeChild(link);

        //parte para navegadores
        /*
        // Obter o conteúdo do Canvas como uma string base64
        const base64Image = canvasPrincial.toDataURL("image/png");

        // Criar um link temporário
        const link = document.createElement('a');
        link.href = base64Image;

        if(newNameSave.checked){
            
            let newName = prompt("Qual nome de salvamento da imagem?",imageInput.files[0].name);
            
            if(newName != null){
                
                //nome
                link.download = newName;

                // Simular um clique no link para iniciar o download
                document.body.appendChild(link);
                link.click();

                // Remover o link temporário do DOM
                document.body.removeChild(link);
            }

        } else {

            //Nome
            link.download = imageInput.files[0].name;

            // Simular um clique no link para iniciar o download
            document.body.appendChild(link);
            link.click();

            // Remover o link temporário do DOM
            document.body.removeChild(link);
        }*/
    });
}