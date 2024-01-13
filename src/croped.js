window.onload = function(event){
    
    const canvas = document.getElementById("canvas");
    const reset = document.getElementById("reset");
    const ctx = canvas.getContext('2d');
    const ctx2 = canvas.getContext('2d');
    const img = new Image();
    let newWidth, newHeight, areaCanvas;

    // Sua imagem base64
    const imagemBase64 = localStorage.getItem('urlBase64');

    img.onload = function() {
        // Ajustar o tamanho do canvas ao tamanho da imagem
        canvas.width  = img.width;
        canvas.height = img.height;
        canvas.style.width  = img.width;
        canvas.style.height = img.height;

        areaCanvas = img.width * img.height;

        // Desenhar a imagem no canvas
        ctx.drawImage(img, 0, 0);

        //document.body.zoom = 20;
    };

    // Carregar a imagem base64 na instância de Image
    img.src = imagemBase64;
   
    save.addEventListener("click",function(){
        
        let base64Image = canvas.toDataURL("image/png","0.75");
        localStorage.setItem('urlBase64', base64Image);
        
        window.location.href = "index.html";
    });
    reset.addEventListener("click",function(){

        // Carregar a imagem base64 na instância de Image
        img.src = imagemBase64;

        ctx .clearRect(0, 0, canvas.width, canvas.height);
        ctx2.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    });

    // Variáveis para rastrear o estado do desenho
    let desenhando = false;
    let pontoInicial = { x: 0, y: 0 };
    let pontoFinal = { x: 0, y: 0 };
    document.addEventListener('mouseup', function(event) {

        if(desenhando){
            rect = canvas.getBoundingClientRect()
            distanciaXUP = event.clientX - rect.left;
            distanciaYUp = event.clientY - rect.top;

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
            let type = 'image/png'; 
            if(localStorage.getItem('nome').indexOf(".jpg") != -1){
                type = 'image/jpeg';
            }
            let proporcao = (canvas.width * canvas.height / areaCanvas).toFixed(2) + "";
            let base64ImageNormal = canvas.toDataURL(type, proporcao);
            
            if((base64ImageNormal.length * 0.75 - 2) > (localStorage.getItem("sizeOriginal")*1)){
                base64ImageNormal = canvas.toDataURL(type);
            }
            
            img.src = base64ImageNormal;

            desenhando = false;
        }
    });
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
        ctx2.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Desenha o retângulo atual
        ctx2.strokeRect(pontoInicial.x, pontoInicial.y, pontoFinal.x - pontoInicial.x, pontoFinal.y - pontoInicial.y);
    });
}