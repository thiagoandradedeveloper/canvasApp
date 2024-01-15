window.onload = function(event){
    
    const canvas = document.getElementById("canvas");
    const reset = document.getElementById("reset");
    const ctx = canvas.getContext('2d');
    const ctx2 = canvas.getContext('2d');
    const img = new Image();
    let sizeOriginal, areaCanvas, imagemBase64;
    let modification = false;
    let firstLoader = true;

    function carregar(){
        // Sua imagem base64
        imagemBase64 = localStorage.getItem('urlBase64');

        img.onload = function() {

            // Ajustar o tamanho do canvas ao tamanho da imagem
            canvas.width  = img.width;
            canvas.height = img.height;
            canvas.style.width  = img.width;
            canvas.style.height = img.height;

            if(firstLoader){
                altAntes.textContent  = img.height + "px";
                largAntes.textContent = img.width + "px";
                sizeAntes.textContent = (imagemBase64.length * 0.75 - 2) + " Bytes";
                firstLoader = false;
            }

            altApos.textContent  = img.height + "px";
            largApos.textContent = img.width + "px";
            sizeOriginal = (imagemBase64.length * 0.75 - 2);
            sizeApos.textContent = (imagemBase64.length * 0.75 - 2) + " Bytes";

            areaCanvas = img.width * img.height;

            // Desenhar a imagem no canvas
            ctx.drawImage(img, 0, 0);

            modification = true;
        };

        // Carregar a imagem base64 na instância de Image
        img.src = imagemBase64;
    }
    carregar();

    function urlBase64(){
        let type = 'image/png'; 
        if(localStorage.getItem('nome').indexOf(".jpg") != -1){
            type = 'image/jpeg';
        }
        let proporcao = (canvas.width * canvas.height / areaCanvas).toFixed(2) + "";
        let base64Image = canvas.toDataURL(type, proporcao);

        if((base64Image.length * 0.75 - 2) > (localStorage.getItem("sizeOriginal")*1)){
            base64Image = canvas.toDataURL(type);
        }
        return base64Image;
    }

    save.addEventListener("click",function(){
        localStorage.setItem('urlBase64', urlBase64());
        window.location.href = "index.html";
    });
    reset.addEventListener("click",function(){

        // Carregar a imagem base64 na instância de Image
        img.src = imagemBase64;

        ctx .clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    });

    // Variáveis para rastrear o estado do desenho
    let desenhando = false;
    let pontoInicial = { x: 0, y: 0 };
    let pontoFinal = { x: 0, y: 0 };
    document.addEventListener('mouseup', function(event) {

        if(desenhando){

            const scrollTopValue = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollLeftValue = document.documentElement.scrollLeft || document.body.scrollLeft;

            rect = canvas.getBoundingClientRect()
            distanciaXUP = event.clientX - canvas.offsetLeft + scrollLeftValue;
            distanciaYUp = event.clientY - canvas.offsetTop  + scrollTopValue;

            if(distanciaYUp > canvas.height) { distanciaYUp = canvas.height; }
            if(distanciaXUP > canvas.width)  { distanciaXUP = canvas.width;  }

            if(distanciaYUp < 0) { distanciaYUp = 0; }
            if(distanciaXUP < 0) { distanciaXUP = 0; }

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

            desenhando = false;
            apos.style.display = "inline-block";
            img.src = urlBase64();

            let time = setInterval(() => {

                altApos.textContent  = canvas.height + "px";
                largApos.textContent = canvas.width + "px";                
                let sizeFinal = urlBase64().length * 0.75 - 2;
                let porcentagem = ((sizeFinal / sizeOriginal) * 100).toFixed(2);
                sizeApos.textContent = sizeFinal + " Bytes (" + porcentagem + "%)";

                if(modification = true){
                    clearInterval(time);
                }

            }, 100);
        }
    });
    canvas.addEventListener('mousedown', function(event) {

        const scrollTopValue = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollLeftValue = document.documentElement.scrollLeft || document.body.scrollLeft;

        rect = canvas.getBoundingClientRect()
        distanciaXDOWN = event.clientX - canvas.offsetLeft + scrollLeftValue;
        distanciaYDOWN = event.clientY - canvas.offsetTop  + scrollTopValue;
        desenhando = true;
        pontoInicial = { x: event.clientX - canvas.offsetLeft + scrollLeftValue, y: event.clientY - canvas.offsetTop + scrollTopValue};
    });
    // Adiciona um ouvinte de evento para o movimento do mouse
    canvas.addEventListener('mousemove', function(event) {

        if (!desenhando) return;

        ctx.save();

        const scrollTopValue = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollLeftValue = document.documentElement.scrollLeft || document.body.scrollLeft;

        pontoFinal = { x: event.clientX - canvas.offsetLeft + scrollLeftValue, y: event.clientY - canvas.offsetTop + scrollTopValue };

        // Limpa o canvas
        ctx2.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Desenha o retângulo atual
        ctx2.strokeRect(pontoInicial.x, pontoInicial.y, pontoFinal.x - pontoInicial.x, pontoFinal.y - pontoInicial.y);
    });
}