window.onload = function(){
    const valorTransparencia = document.getElementById("valorTransparencia");
    const inputTransparencia = document.getElementById("inputTransparencia");
    const canvas = document.getElementById("canvas");
    const color = document.getElementById("color");
    const ctx  = canvas.getContext('2d');
    const img  = new Image();

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
        changeMask();
    });
    inputTransparencia.addEventListener("change",function(){
        localStorage.setItem('urlBase64', canvas.toDataURL("image/png"));
    });
    color.addEventListener("change",function(){
        changeMask();
        localStorage.setItem('urlBase64', canvas.toDataURL("image/png"));
    });
    function changeMask(){
        let valoresRgb = hexToRgb(color.value);
        valorTransparencia.textContent = inputTransparencia.value + "%";
        let cor = 'rgba(' + valoresRgb.r + ',' + valoresRgb.g + ',' + valoresRgb.b + ','+ (inputTransparencia.value/100) +')';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = cor;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
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
}
