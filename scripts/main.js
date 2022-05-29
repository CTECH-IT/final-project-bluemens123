

window.addEventListener('load', function () {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");

    class Player {

    }

    class Background{

    }

    class Spike{

    }
    class InputHander {
        constructor(){
            this.keys = []; 
            window.addEventListener('keydown', k => {
                if(e.key === 'ArrowDown' && this.keys.indexOf(e.key)=== -1){
                    this.keys.push(e.key); 
                }
                console.log(e.key, this.key)
            }); 
        }
    }



    function handleSpikes(){

    }
    function displayStatus(){

    }
    function animate(){

    }

}); 