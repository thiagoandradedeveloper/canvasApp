window.onload = function(){
    const valorTransparencia = document.getElementById("valorTransparencia");
    const inputTransparencia = document.getElementById("inputTransparencia");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // Sua imagem base64
    const imagemBase64 = localStorage.getItem('urlBase64');
    console.log(imagemBase64);

    img.onload = function() {
        // Ajustar o tamanho do canvas ao tamanho da imagem
        canvas.width  = img.width;
        canvas.height = img.height;
        canvas.style.width  = img.width;
        canvas.style.height = img.height;

        // Desenhar a imagem no canvas
        ctx.drawImage(img, 0, 0);
    };

    // Carregar a imagem base64 na instância de Image
    img.src = imagemBase64;

    inputTransparencia.addEventListener("input",function(){
        valorTransparencia.textContent = inputTransparencia.value + "%";
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.filter = 'sepia(' + inputTransparencia.value + '%)';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    });
    inputTransparencia.addEventListener("change",function(){
        localStorage.setItem('urlBase64', canvas.toDataURL("image/png"));
    });   
}