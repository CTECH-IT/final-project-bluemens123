window.addEventListener('load', function () {
    const canvas = document.getElementById('MyCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 750;
    canvas.height = 350;
    let mikes = [];
    let score = 0;
    gameOver = false; 
    let speedofPlay = 9; 


    class Background {
        constructor(screenWidth, screenHeight) {
            this.screenHeight = screenHeight;
            this.screenWidth = screenWidth;
            this.image = document.getElementById('mountainbackground');
            this.x = 0;
            this.y = 0;
            this.width = 800;
            this.height = 390;
            this.speed = 5;


        }
        draw(context) {
          
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        }
        update() {
            this.x -= this.speed;
            if (this.x < 0 - this.width) {
                this.x = 0;
            }
        }
    }

    class JumpMan {
        constructor(screenWidth, screenHeight) {
            this.screenHeight = screenHeight;
            this.screenWidth = screenWidth;
            this.width = 50;
            this.height = 100;
            this.x = 0
            this.y = this.screenHeight - this.height;
            this.image = document.getElementById('JumpMan');
            this.frameX = 0; //0 for first, 8.5 for second, 16, 23
            this.frameY = 0;
            this.speed = 0;
            this.dy = 0;
            this.gravity = 1;
            this.maxFrame = 2;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
        }
        draw(context) {
            context.strokeStyle = 'white'; 
            context.strokeRect(this.x, this.y, this.width, this.height); 
            context.beginPath(); 
            context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI*2); 
            context.stroke(); 
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, 400, 550, this.x, this.y, this.width, this.height);
        }
        update(input, changeTime, mikes) {
            //collsion
            mikes.forEach(mike => {
                const dx = mike.x - this.x; 
                const vy = mike.y - this.y; 
                const distance = Math.sqrt(dx * dx + vy * vy); 
                if(distance < mike.width/2 + this.width/2){
                    gameOver = true; 
                }
            })

            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) {
                    this.frameX = 0;
                }
                else {
                    this.frameX += 16;
                }
                this.frameTimer = 0;
            } else {
                this.frameTimer += changeTime;
            }



            //x movement
            this.x += this.speed;
            if (this.x < 0) {
                this.x = 0;
            }
            else if (this.x > this.screenWidth - this.width) this.x = this.screenWidth - this.width;


            if (input.keys.indexOf('ArrowRight') > -1) {
                this.speed = 7;

            } else if (input.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -7;
            }
            else if (input.keys.indexOf('ArrowUp') > -1 && this.Grounded()) {
                this.dy -= 23;
            }
            else {
                this.speed = 0;
            }

            this.y += this.dy;

            if (!this.Grounded()) {
                this.dy += this.gravity;
                this.frameX = 8.5
            } else {
                this.dy = 0;
                this.frameX = 0;
            }

        }
        Grounded() {
            return this.y >= this.screenHeight - this.height;
        }

    }



    class Mike {
        constructor(screenHeight, screenWidth) {
            this.screenHeight = screenHeight;
            this.screenWidth = screenWidth;
            this.width = 60;
            this.height = 60;
            this.image = document.getElementById('monster');
            this.x = this.screenHeight;
            this.y = this.screenWidth - this.height;
            this.frameX = 0;
            this.speed = speedofPlay;
            this.deleteMike = false;

        }
        // frame values 0, 7, 14, 21
        draw(context) {
            context.strokeStyle = 'white'; 
            context.strokeRect(this.x, this.y, this.width, this.height); 
            context.beginPath(); 
            context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI*2); 
            context.stroke(); 
            context.drawImage(this.image, this.frameX * this.width, 0, 400, 450, this.x, this.y, this.width, this.height);
        }
        update() {
            this.x -= this.speed;


            if (this.x < 0 - this.width) {
                this.deleteMike = true;
                speedofPlay++; 
                score++;
                
            }
            
        }

    }
    class InputHander {
        //captures and removes information of which keys are pressed.
        constructor() {
            this.keys = [];
            window.addEventListener('keydown', k => {
                if ((k.key === 'ArrowDown' || k.key === 'ArrowUp' || k.key === 'ArrowLeft' || k.key === 'ArrowRight') && this.keys.indexOf(k.key) === -1) {
                    this.keys.push(k.key);
                }

            });
            window.addEventListener('keyup', k => {
                if (k.key === 'ArrowDown' || k.key === 'ArrowUp' || k.key === 'ArrowLeft' || k.key === 'ArrowRight') {
                    this.keys.splice(this.keys.indexOf(k.key), 1);
                }

            });
        }
    }



    function handleMikes(changeTime) {
        if (mikeTimer > mikeInterval + spawner) {
            mikes.push(new Mike(canvas.width, canvas.height));
            spawner = Math.random() * 1000 + 500;
            mikeTimer = 0;

        } else {
            mikeTimer += changeTime;
        }

        mikes.forEach(mike => {
            mike.draw(ctx);
            mike.update(changeTime);

        })
        mikes = mikes.filter(mike => !mike.deleteMike);
    }

    function displayStatus(context) {
        if(gameOver){
            context.textAlign = 'center'; 
            context.fillStyle = 'red'; 
            context.fillText('MIKE GOT YOU!', canvas.width/2, 200);    
        }
        context.fillStyle = 'white';
        context.font = '50px Helvetica';
        context.fillText('Score: ' + score, 100, 50);
        

    }

    let mikeTimer = 0;
    let mikeInterval = 1000;
    let spawner = Math.random() * 1000 + 500;

    const background = new Background(canvas.width, canvas.height);
    const input = new InputHander();
    const mrjump = new JumpMan(canvas.width, canvas.height);

    let last = 0;
    function animate(timeStamp) {
        const changeTime = timeStamp - last;
        last = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.draw(ctx);
        background.update(); 
        mrjump.draw(ctx);

        mrjump.update(input, changeTime, mikes);


        handleMikes(changeTime);
        displayStatus(ctx);
        if(!gameOver){
            requestAnimationFrame(animate);
        }
     

    }
    animate(0);
}); 