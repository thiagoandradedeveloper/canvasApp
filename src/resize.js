window.onload = function(){
    const canvas  = document.getElementById("canvas");
    const reducao = document.getElementById("reducao");
    const save    = document.getElementById("save");
    const tamanhoOriginal    = document.getElementById("tamanhoOriginal");
    const ctx = canvas.getContext('2d');
    const img = new Image();
    let widthOriginal, heightOriginal;
    let valorReducao = 1;

    // Sua imagem base64
    const imagemBase64 = localStorage.getItem('urlBase64');

    img.onload = function() {
        // Ajustar o tamanho do canvas ao tamanho da imagem
        canvas.width  = img.width;
        canvas.height = img.height;
        canvas.style.width  = img.width;
        canvas.style.height = img.height;

        widthOriginal  = canvas.width;
        heightOriginal = canvas.height;

        // Desenhar a imagem no canvas
        ctx.drawImage(img, 0, 0);
        
        let acrescimo = 6;
        tamanhoOriginal.style.minWidth  = widthOriginal   + acrescimo + "px";
        tamanhoOriginal.style.maxWidth  = widthOriginal   + acrescimo + "px";
        tamanhoOriginal.style.minHeight = heightOriginal  + acrescimo + "px";
        tamanhoOriginal.style.maxHeight = heightOriginal  + acrescimo + "px";
        tamanhoOriginal.width  = widthOriginal +acrescimo +"px";
        tamanhoOriginal.height = heightOriginal+acrescimo +"px";
    };

    // Carregar a imagem base64 na instância de Image
    img.src = imagemBase64;

    reducao.addEventListener("change",function(){
        canvas.width  = widthOriginal  * (reducao.value/100);
        canvas.height = heightOriginal * (reducao.value/100);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        valorReducao = reducao.value/100;
        save.style.display = "block";
    });
    save.addEventListener("click",function(){
        
        let type = "image/png"; 
        if(localStorage.getItem('nome').indexOf(".jpg") != -1){
            type = "'image/jpeg'";
        }
        let base64Image = canvas.toDataURL(type, valorReducao);
        if((base64Image.length * 0.75 - 2) > (localStorage.getItem("sizeOriginal")*1)){
            base64Image = canvas.toDataURL(type);
        }
        localStorage.setItem('urlBase64', base64Image);
        window.location.href = "index.html";
    });
}