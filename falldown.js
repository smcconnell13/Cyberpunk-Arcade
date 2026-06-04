(function() {
    "use strict";

    const config = {
        gravity: 0.5,
        moveSpeed: 8,
        initialFloorSpeed: 1.5,
        speedIncreaseRate: 0.05,
        floorHeight: 25,
        floorGap: 110,
        minHoleSize: 50,    // Minimum hole width
        maxHoleSize: 150,   // Maximum hole width (4x larger)
        ballRadius: 12,
        colors: {
            bg: '#1a1a1a',
            ball: '#00ff99',
            floor: '#ff6666',
            text: '#ffffff'
        }
    };

    let canvas = null;
    let ctx = null;
    let state = {
        running: false,
        gameOver: false,
        score: 0,
        currentSpeed: config.initialFloorSpeed
    };

    let player = {
        x: 0,
        y: 50,
        vx: 0,
        vy: 0,
        radius: config.ballRadius
    };

    let floors = [];
    let keys = { ArrowLeft: false, ArrowRight: false };

    function init() {
        try {
            if (canvas) document.body.removeChild(canvas);
            
            canvas = document.createElement('canvas');
            canvas.id = 'FalldownConsoleGame';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.zIndex = '999999';
            canvas.style.pointerEvents = 'none';
            document.body.appendChild(canvas);

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx = canvas.getContext('2d');

            state.running = true;
            state.gameOver = false;
            state.score = 0;
            state.currentSpeed = config.initialFloorSpeed;

            player.x = canvas.width / 2;
            player.y = 50;
            player.vx = 0;
            player.vy = 0;

            floors = [];
            for (let i = 0; i < 4; i++) {
                createFloor(canvas.height - (i * config.floorGap));
            }

            if (!state.running) {
                state.running = true;
                loop();
            }
        } catch (e) {
            console.error("Falldown Init Error:", e);
        }
    }

    function createFloor(yPos) {
        const margin = 50;
        
        // Generate random hole width for this floor
        const holeWidth = Math.random() * (config.maxHoleSize - config.minHoleSize) + config.minHoleSize;
        
        // Adjust maxHoleX based on the actual hole width
        const maxHoleX = canvas.width - margin * 2 - holeWidth;
        const holeX = Math.random() * maxHoleX + margin;

        floors.push({
            y: yPos,
            holeX: holeX,
            holeWidth: holeWidth,  // Random width per floor
            active: true
        });
    }

    function handleKey(e, isDown) {
        if (e.code === 'ArrowLeft') keys.ArrowLeft = isDown;
        if (e.code === 'ArrowRight') keys.ArrowRight = isDown;
        
        if (e.code === 'Enter' && state.gameOver) init();
    }

    window.addEventListener('keydown', (e) => handleKey(e, true));
    window.addEventListener('keyup', (e) => handleKey(e, false));

    function update() {
        if (!state.running || state.gameOver) return;

        if (keys.ArrowLeft) player.x -= config.moveSpeed;
        if (keys.ArrowRight) player.x += config.moveSpeed;

        if (player.x < player.radius) player.x = player.radius;
        if (player.x > canvas.width - player.radius) player.x = canvas.width - player.radius;

        player.vy += config.gravity;
        player.y += player.vy;

        for (let f of floors) {
            f.y -= state.currentSpeed;
        }

        if (floors.length > 0) {
            const bottomFloor = floors[0];
            if (bottomFloor.y < canvas.height - config.floorGap - 50) {
                createFloor(bottomFloor.y + config.floorGap);
            }
        }

        floors.sort((a, b) => b.y - a.y); 

        if (floors.length > 0 && floors[floors.length - 1].y < -config.floorHeight) {
            floors.pop(); 
            state.score++;
            state.currentSpeed += config.speedIncreaseRate;
        }

        for (let f of floors) {
            const floorTop = f.y;
            const playerBottom = player.y + player.radius;

            if (playerBottom >= floorTop && playerBottom <= floorTop + 15 && player.vy >= 0) {
                
                const playerLeft = player.x - player.radius;
                const playerRight = player.x + player.radius;
                const holeLeft = f.holeX;
                const holeRight = f.holeX + f.holeWidth;

                const inHole = (playerLeft > holeLeft - 5 && playerRight < holeRight + 5);

                if (!inHole) {
                    player.y = floorTop - player.radius;
                    player.vy = 0;
                    player.y -= state.currentSpeed;
                }
            }
        }

        if (player.y - player.radius < 0) {
            state.gameOver = true;
        }
        
        if (player.y > canvas.height + 100) {
            state.gameOver = true;
        }
    }

    function draw() {
        if (!ctx || !canvas) return;

        ctx.fillStyle = config.colors.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (state.gameOver) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = config.colors.text;
            ctx.font = 'bold 40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('SQUISHED!', canvas.width / 2, canvas.height / 2 - 20);

            ctx.font = '24px Arial';
            ctx.fillText('Final Score: ' + state.score, canvas.width / 2, canvas.height / 2 + 20);
            
            ctx.font = '18px Arial';
            ctx.fillText('Press Enter to Restart', canvas.width / 2, canvas.height / 2 + 60);
            return;
        }

        ctx.fillStyle = config.colors.floor;
        for (let f of floors) {
            ctx.fillRect(0, f.y, f.holeX, config.floorHeight);
            ctx.fillRect(f.holeX + f.holeWidth, f.y, canvas.width - (f.holeX + f.holeWidth), config.floorHeight);
        }

        ctx.fillStyle = config.colors.ball;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = config.colors.ball;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = config.colors.text;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Score: ' + state.score, 30, 40);
        
        ctx.font = '16px Arial';
        ctx.fillText('Speed: ' + state.currentSpeed.toFixed(1), 30, 70);
    }

    function loop() {
        if (state.running) {
            update();
            draw();
            requestAnimationFrame(loop);
        }
    }

    console.log("Falldown Loaded. Arrows to Move. Enter to Restart.");
    init();
    loop();

})();