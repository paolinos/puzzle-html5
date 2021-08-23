const onInit = async () => {
    
    const canvas = document.getElementById('drawArea');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.rect(100, 50, 140, 74);
    ctx.stroke();
}   
onInit();