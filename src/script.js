window.onload = function(){
    const blackSvgCanvas  = document.getElementById("blackSvgCanvas");
    const input  = document.getElementById("inputImage");
    const buttonsView  = document.getElementById("buttonsView");
    const canvas = document.getElementById("canvas");
    const salvar = document.getElementById("save");
    const reset  = document.getElementById("reset");
    const view   = document.getElementById("view");
    const apos   = document.getElementById("apos");
    const antes   = document.getElementById("antes");
    const alturaImg    = document.getElementById("alturaImg");
    const larguraImg   = document.getElementById("larguraImg");
    const tamanhoImg   = document.getElementById("tamanhoImg");
    const ctx = canvas.getContext('2d');
    const img = new Image();
    let newWidth, newHeight;
    apos.style.display  = "none";
    antes.style.display = "none";

    input.addEventListener("change",()=>{  
        
        img.src = URL.createObjectURL(input.files[0]);
        
        img.onload = function(){
            
            const file = new FileReader();
            file.onload = function(e){

                apos.style.display = "block";
                antes.style.display = "none";

                let urlBase64 = e.target.result;
                localStorage.setItem('urlBase64', urlBase64);
                localStorage.setItem('urlBase64Original', urlBase64);
                tamanhoImg.textContent = (urlBase64.length * 0.75 - 2) + " Bytes";
            
                localStorage.setItem('widthOriginal',  img.width);
                localStorage.setItem('heightOriginal', img.height);
                localStorage.setItem('sizeOriginal', (urlBase64.length * 0.75 - 2));

                nomeImg1.textContent    = input.files[0].name;
                alturaImg1.textContent  = localStorage.getItem('heightOriginal') + "px";
                larguraImg1.textContent = localStorage.getItem('widthOriginal')  + "px";
                tamanhoImg1.textContent = localStorage.getItem('sizeOriginal') + " Bytes";
            }
            localStorage.setItem('nome', input.files[0].name);
            file.readAsDataURL(input.files[0]);

            ajustar();

            view.style.display = "block";
            buttonsView.style.display = "block";
            
            // Ajustar o tamanho do canvas
            canvas.width  = newWidth;
            canvas.height = newHeight;
    
            // Desenhar a imagem no canvas
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            
            alturaImg.textContent  = img.height + "px";
            larguraImg.textContent = img.width + "px";         
            
            nomeImg1.textContent    = input.files[0].name;
            alturaImg1.textContent  = localStorage.getItem('heightOriginal') + "px";
            larguraImg1.textContent = localStorage.getItem('widthOriginal')  + "px";
            tamanhoImg1.textContent = localStorage.getItem('sizeOriginal')   + " Bytes";
        }         
    });

    function porcentagem(numerador, denominador){
        return ((numerador / denominador) * 100).toFixed(2);
    }
        
    reset.addEventListener("click",()=>{        
        localStorage.setItem('urlBase64',localStorage.getItem('urlBase64Original'))
        recarregarImagem();
    });

    // Adiciona um ouvinte de evento para a tecla "Esc" pressionada
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            fundo.style.display = "none";
        }            
    })
    blackSvgCanvas.onclick = function(){
        imgFull.src = localStorage.getItem('urlBase64');
        fundo.style.display = "block";
    }
    fundo.onclick = function(){
        fundo.style.display = "none";
    }
    closex.onclick = function(){
        fundo.style.display = "none";
    }
    salvar.onclick = ()=>{

        let nameImageForDownload = localStorage.getItem('nome');

        if(nameImageForDownload.indexOf("svg") != -1){
            
        alert(nameImageForDownload)
            
            //Conteúdo base64
            const imagemBase64 = localStorage.getItem('urlBase64');

            // Criar um elemento de contêiner SVG
            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svgElement.setAttribute("version", "1.1");
            svgElement.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
            svgElement.setAttribute("width", canvas.width);
            svgElement.setAttribute("height", canvas.height);

            // Criar um elemento de imagem no SVG
            const imageElement = document.createElementNS("http://www.w3.org/2000/svg", "image");
            imageElement.setAttribute("width", canvas.width);
            imageElement.setAttribute("height", canvas.height);
            imageElement.setAttribute("xlink:href", imagemBase64);

            // Adicionar o elemento de imagem ao SVG
            svgElement.appendChild(imageElement);

            // Criar um link para download
            const link = document.createElement("a");

            // Criar um Blob a partir do conteúdo SVG
            const blob = new Blob([new XMLSerializer().serializeToString(svgElement)], { type: "image/svg+xml" });

            // Criar uma URL para o Blob e definir como href do link
            link.href = URL.createObjectURL(blob);

            // Definir o nome do arquivo para download
            link.download = nameImageForDownload;

            // Simular um clique no link para iniciar o download
            link.click();

        } else { 

            //parte para app electron
            // Obter o conteúdo do Canvas como uma string base64
            const base64Image = localStorage.getItem('urlBase64');

            // Criar um link temporário
            const link = document.createElement('a');
            link.href = base64Image;

            //Nome
            link.download = localStorage.getItem('nome');

            // Simular um clique no link para iniciar o download
            document.body.appendChild(link);
            link.click();

            // Remover o link temporário do DOM
            document.body.removeChild(link);
        }
    }
    recarregarImagem();
    
    function ajustar(){

        const alturaViewport = window.innerHeight || document.documentElement.clientHeight;

        // Altura máxima desejada
        let alturaMaxima = alturaViewport;
        
        if(img.height > alturaMaxima){
            
            // Proporção da imagem
            let proporcao = img.width / img.height;

            // Calcular a nova largura com base na altura máxima
            newWidth  = alturaMaxima * proporcao;
            newHeight = alturaMaxima;

        } else {

            newWidth  = img.width;
            newHeight = img.height;

        }
    }
    function recarregarImagem(){

        if(localStorage.getItem('urlBase64') != ""){
            
            // Sua imagem base64
            const imagemBase64 = localStorage.getItem('urlBase64');

            img.onload = function() {
                
                ajustar();
                
                // Ajustar o tamanho do canvas
                canvas.width  = newWidth;
                canvas.height = newHeight;
                    
                view.style.display = "block";
                buttonsView.style.display = "block";

                // Desenhar a imagem no canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                apos.style.display = "block";
                antes.style.display = "block";

                let sizeAtual = (imagemBase64.length * 0.75 - 2);
                let porcent = porcentagem(sizeAtual,localStorage.getItem('sizeOriginal')*1);
                alturaImg.textContent  = img.height + "px (" + porcentagem(img.height,localStorage.getItem('heightOriginal')) + "%)";
                larguraImg.textContent = img.width  + "px (" + porcentagem(img.width,localStorage.getItem('widthOriginal')) + "%)";
                tamanhoImg.textContent = sizeAtual + " Bytes ("+ porcent +"%)";

                nomeImg1.textContent    = localStorage.getItem('nome');
                alturaImg1.textContent  = localStorage.getItem('heightOriginal') + "px";
                larguraImg1.textContent = localStorage.getItem('widthOriginal')  + "px";
                tamanhoImg1.textContent = localStorage.getItem('sizeOriginal') + " Bytes";
            };

            // Carregar a imagem base64 na instância de Image
            img.src = imagemBase64;
        }
    }
    console.log(localStorage.getItem('urlBase64Original'))
}

