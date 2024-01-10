window.onload = function(){
    const { ipcRenderer } = require('electron');

    //const newNameSave = document.getElementById('newNameSave');
    //const imgPreview = document.getElementById('imgPreview');showHidenControls
    const showHidenControls = document.getElementById('showHidenControls');
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
    const input = document.getElementById('imageInput');
    const canvas = document.getElementById('outputCanvas');
    const downloadButton = document.getElementById('downloadButton');
    const nomeImg = document.getElementById("nomeImg");
    const tamanhoImg = document.getElementById("tamanhoImg");
    const alturaImg = document.getElementById("alturaImg");
    const larguraImg = document.getElementById("larguraImg");
    const colorMask = document.getElementById("colorMask");
    const opacityMask = document.getElementById("opacityMask");
    const resetarMask = document.getElementById("resetarMask");
    const imglogo = document.getElementById("imglogo");
    const larguraViewport = window.innerWidth || document.documentElement.clientWidth;
    const alturaViewport = window.innerHeight || document.documentElement.clientHeight;
    let newWidth, newHeight, copiedCtx, copiedCtx2, proporcaoX, proporcaoY;
    
    let img = new Image();
    const ctx = canvas.getContext('2d');  
    const ctx3 = canvas.getContext('2d'); 
    let originalSRC; 

    input.addEventListener('change', applyFilterAndDraw);
    sepia.addEventListener('change', applyFilter);
    escalaCinza.addEventListener('change', applyFilter);
    opacity1.addEventListener('change', applyFilter);
    blur.addEventListener('change', applyFilter);

    const canvasPrincial = document.createElement('canvas');
    const ctx2 = canvasPrincial.getContext('2d');

    resetarMask.onclick = function(){
        opacityMask.value = 0;
        colorMask.value = "#ffff00"
        ctx.putImageData(copiedCtx, 0, 0);
        ctx2.putImageData(copiedCtx2, 0, 0);
    }
    
    reset.addEventListener("click",()=>{

        canvasPrincial.width = img.width;
        canvasPrincial.height = img.height;

        opacity1.value = 100;
        escalaCinza.value = 0;
        sepia.value = 0;
        blur.value = 0;
        opacityMask.value = 0;
        colorMask.value = "#ffff00";
        corFundo.value = "#ffffff";
        canvas.style.background = "#fff";

        ipcRenderer.send('ler-arquivo', './url.txt');

        ipcRenderer.on('ler-arquivo-resposta', (event, resposta) => {
            if (resposta.erro) {
                console.error(resposta.mensagem);
            } else {
                
                let imgNova = new Image();

                imgNova.onload = function() {
                    let altura  = imgNova.height;
                    let largura = imgNova.width;

                    canvas.width  = img.width  = largura;
                    canvas.height = img.height = altura;

                    img.src = resposta.conteudo;
                };
                imgNova.src = resposta.conteudo;
            }
        });

        applyFilter();
    });
    
    corFundo.addEventListener("change",()=>{
        canvas.style.background = corFundo.value;
    });

    function mudarMascara(){

        ctx.putImageData(copiedCtx, 0, 0);
        ctx2.putImageData(copiedCtx2, 0, 0);

        let valoresRgb = hexToRgb(colorMask.value);
        let cor = 'rgba(' + valoresRgb.r + ',' + valoresRgb.g + ',' + valoresRgb.b + ',' + (opacityMask.value/100) + ')';
        ctx.fillStyle = cor;
        ctx2.fillStyle = cor;

        // Desenhe um retângulo preenchido com a cor amarela
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx2.fillRect(0, 0, canvasPrincial.width, canvasPrincial.height);
    }
    opacityMask.addEventListener("change",()=>{
        mudarMascara();
    });
    colorMask.addEventListener("change",()=>{
        mudarMascara();
    });

    function hexToRgb(hex) {
        // Remova o possível sinal de # do início, se existir
        hex = hex.replace(/^#/, '');
      
        // Use uma expressão regular para dividir os componentes em grupos de dois
        const match = hex.match(/.{1,2}/g);
      
        // Verifique se há correspondências e retorne os valores RGB
        return match ? {
          r: parseInt(match[0], 16),
          g: parseInt(match[1], 16),
          b: parseInt(match[2], 16)
        } : null;
    }
    
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

        if(opacityMask.value*1 != 0){
    
            let valoresRgb = hexToRgb(colorMask.value);
            let cor = 'rgba(' + valoresRgb.r + ',' + valoresRgb.g + ',' + valoresRgb.b + ',' + (opacityMask.value/100) + ')';
            ctx.fillStyle = cor;
            ctx2.fillStyle = cor;
    
            // Desenhe um retângulo preenchido com a cor amarela
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx2.fillRect(0, 0, canvasPrincial.width, canvasPrincial.height);
        }

        // Desenhar a imagem no canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx2.drawImage(img, 0, 0, canvasPrincial.width, canvasPrincial.height);

        copiedCtx = ctx.getImageData(0, 0, canvas.width, canvas.height);
        copiedCtx2 = ctx2.getImageData(0, 0, canvasPrincial.width, canvasPrincial.height);
   
    }
    function applyFilterAndDraw() {

        
        img.src = URL.createObjectURL(input.files[0]);

        img.onload = function() {

            const leitor = new FileReader();
            leitor.onload = function(e) {
                const urlBase64 = e.target.result;
                
                // Enviar a URL base64 para o processo principal usando IPC
                ipcRenderer.send('salvar-arquivo', urlBase64);
            };
            leitor.readAsDataURL(input.files[0]);

            outputCanvas.style.display = "block";
            showHidenControls.style.display = "block";

            canvasPrincial.width  = img.width; 
            canvasPrincial.height = img.height;

            // Limitar a largura e altura do canvas
            const maxWidth = larguraViewport * 0.7;
            const maxHeight = alturaViewport * 0.9;

            // Verificar a proporção da imagem
            if (img.width / maxWidth > img.height / maxHeight) {
              newWidth = maxWidth;
              newHeight = (img.height * maxWidth) / img.width;
            } else {
              newHeight = maxHeight;
              newWidth = (img.width * maxHeight) / img.height;
            }

            if(newWidth > img.width) newWidth = img.width;
            if(newHeight > img.height) newHeight = img.height;

            // Atualizar as dimensões do canvas
            canvas.width = newWidth;
            canvas.height = newHeight;

            proporcaoX = canvasPrincial.width / canvas.width;
            proporcaoY = canvasPrincial.height / canvas.height;
            
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

    });
    let distanciaYDOWN, distanciaXDOWN, distanciaXUP, distanciaYUp, rect;


    canvas.addEventListener('mouseup', function(event) {

        rect = canvas.getBoundingClientRect()
        distanciaXUP = event.clientX - rect.left;
        distanciaYUp = event.clientY - rect.top;

        let trocaY, trocaX;

        if(distanciaYUp < distanciaYDOWN){
            trocaY = distanciaYUp;
            distanciaYUp = distanciaYDOWN;
            distanciaYDOWN = trocaY;
        }
        if(distanciaXUP < distanciaXDOWN){
            trocaX = distanciaXUP;
            distanciaXUP = distanciaXDOWN;
            distanciaXDOWN = trocaX;
        }
       
        // Limpar o canvas antes de desenhar a nova imagem
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx2.clearRect(0, 0, canvasPrincial.width, canvasPrincial.height);

        // Desenha a parte recortada da imagem no canvas
        let sH = dH = distanciaYUp - distanciaYDOWN;
        let sW = dW = distanciaXUP - distanciaXDOWN;

        canvas.width  = sW;
        canvas.height = sH;

        ctx.drawImage(img,  
            distanciaXDOWN, distanciaYDOWN, // distanciaXDOWN, distanciaYDOWN
            sW, sH, //
            0, 0, //
            dW, dH //
        );

        canvasPrincial.width  = sW * proporcaoX;
        canvasPrincial.height = sH * proporcaoY;

        ctx2.drawImage(img,  
            distanciaXDOWN*proporcaoX, distanciaYDOWN*proporcaoY, // distanciaXDOWN, distanciaYDOWN
            sW*proporcaoX, sH*proporcaoY, //
            0, 0, //
            dW*proporcaoX, dH*proporcaoY //imagemOrigem
        );

        copiedCtx = ctx.getImageData(0, 0, canvas.width, canvas.height);
        copiedCtx2 = ctx2.getImageData(0, 0, canvasPrincial.width, canvasPrincial.height);

        const base64ImageNormal = canvas.toDataURL("image/png");
        img.src = base64ImageNormal;

        desenhando = false;
    });
    // Variáveis para rastrear o estado do desenho
    let desenhando = false;
    let pontoInicial = { x: 0, y: 0 };
    let pontoFinal = { x: 0, y: 0 };
    canvas.addEventListener('mousedown', function(event) {
        rect = canvas.getBoundingClientRect()
        distanciaXDOWN = event.clientX - rect.left;
        distanciaYDOWN = event.clientY - rect.top;
        desenhando = true;
        pontoInicial = { x: event.clientX - canvas.offsetLeft, y: event.clientY - canvas.offsetTop };
    });

    // Adiciona um ouvinte de evento para o movimento do mouse
    canvas.addEventListener('mousemove', function(event) {
        if (!desenhando) return;

        ctx.save();

        pontoFinal = { x: event.clientX - canvas.offsetLeft, y: event.clientY - canvas.offsetTop };

        // Limpa o canvas
        ctx3.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Desenha o retângulo atual
        ctx3.strokeRect(pontoInicial.x, pontoInicial.y, pontoFinal.x - pontoInicial.x, pontoFinal.y - pontoInicial.y);
    
    });
}


