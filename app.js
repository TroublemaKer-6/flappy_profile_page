document.addEventListener('DOMContentLoaded', () => {
    const bird = document.querySelector('.bird');
    const gameDisplay = document.querySelector('.game-container');
    const ground = document.querySelector('.ground-moving');
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const gameOverScreen = document.getElementById('game-over-screen');
    const restartButton = document.getElementById('restart-button');
    const countdownEl = document.getElementById('countdown');

    let birdLeft = 220;
    let birdBottom = 250;
    let gravity = 3;
    let isGameOver = false;
    let gamePaused = false;
    let gameStarted = false;
    let gap = 500;
    let questionBoxPlaced = false;
    let hobbiesBoxPlaced = false;
    let contactBoxPlaced = false;
    let gameTimerId;

    const groundHeight = 150;
    const obstacleHeight =300;
    const hobbiesRandomIndex = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
    const contactRandomIndex = Math.floor(Math.random() * 3) + 6;
    const introPopup = document.getElementById('intro-popup');
    const closeIntroButton = document.getElementById('close-intro');

    closeIntroButton.addEventListener('click', () => {
        introPopup.style.display = 'none';
    });
    
    function startGame() {
        if (!isGameOver && gameStarted) {
            birdBottom -= gravity;
            bird.style.bottom = birdBottom + 'px';
            bird.style.left = birdLeft + 'px';
        }
    }

    function control(e) {
        if ((e.keyCode === 32 || e.type === "touchstart") && gameStarted) {
            jump();
        }
    }

    function jump() {
        if (birdBottom < 500) birdBottom += 60; // Increased jump height for better control
        bird.style.bottom = birdBottom + 'px';
    }

    let obstacleCount = 0;

    function generateObstacle() {
        if (isGameOver || gamePaused) return;
    
        let obstacleLeft = 500;
        let randomHeight = Math.random() * 60;
        let obstacleBottom = randomHeight;
        const obstacle = document.createElement('div');
        const topObstacle = document.createElement('div');
        let questionBox = null;
        let hobbiesBox = null;
        let contactBox = null;
    
        obstacle.classList.add('obstacle');
        topObstacle.classList.add('topObstacle');
    
        gameDisplay.appendChild(obstacle);
        gameDisplay.appendChild(topObstacle);
    
        obstacle.style.left = obstacleLeft + 'px';
        topObstacle.style.left = obstacleLeft + 'px';
        obstacle.style.bottom = obstacleBottom + 'px';
        topObstacle.style.bottom = obstacleBottom + gap + 'px';

        obstacleCount++;
        console.log("Obstacle count:", obstacleCount);

        if (!questionBoxPlaced && obstacleCount === 1) {
            questionBoxPlaced = true;
            questionBox = document.createElement('div');
            questionBox.classList.add('question-box');
            gameDisplay.appendChild(questionBox);
            questionBox.innerText = "?"; 
            questionBox.style.left = obstacleLeft + 'px';
            questionBox.style.bottom = (obstacleBottom + gap - 120) + 'px';
        }

        if (!hobbiesBoxPlaced && obstacleCount === hobbiesRandomIndex) {
            hobbiesBoxPlaced = true;
            hobbiesBox = document.createElement('div');
            hobbiesBox.classList.add('hobbies-box');
            hobbiesBox.innerText = "?"; 
            hobbiesBox.style.left = obstacleLeft + 'px';
            hobbiesBox.style.bottom = (obstacleBottom + gap - 120) + 'px';
            gameDisplay.appendChild(hobbiesBox); // Append to the game area
        }

        if (!contactBoxPlaced && obstacleCount === contactRandomIndex) {
            contactBoxPlaced = true;
            contactBox = document.createElement('div');
            contactBox.classList.add('contact-box');
            contactBox.innerText = "?"; 
            contactBox.style.left = obstacleLeft + 'px';
            contactBox.style.bottom = (obstacleBottom + gap - 120) + 'px';
            gameDisplay.appendChild(contactBox); // Append to the game area
        }
    
        function moveObstacle() {
            if (isGameOver || gamePaused) return;
    
            obstacleLeft -= 2;
            obstacle.style.left = obstacleLeft + 'px';
            topObstacle.style.left = obstacleLeft + 'px';
            if (questionBox) questionBox.style.left = obstacleLeft + 'px';
            if (hobbiesBox) hobbiesBox.style.left = obstacleLeft + 'px';
            if (contactBox) contactBox.style.left = obstacleLeft + 'px';
    
            if (obstacleLeft === -60) {
                clearInterval(timerId);
                gameDisplay.removeChild(obstacle);
                gameDisplay.removeChild(topObstacle);
                if (questionBox) gameDisplay.removeChild(questionBox);
                if (hobbiesBox) gameDisplay.removeChild(hobbiesBox);
                if (contactBox) gameDisplay.removeChild(contactBox);
            }

            if (questionBox && obstacleLeft > 220 && obstacleLeft < 260 && birdLeft === 220 &&
                birdBottom > parseInt(questionBox.style.bottom) - 47 - groundHeight &&
                birdBottom < parseInt(questionBox.style.bottom) + 62 - groundHeight) {
                showAboutMePopup(); // Show ABOUT ME popup
                clearInterval(timerId);
            }

            if (hobbiesBox && obstacleLeft > 220 && obstacleLeft < 260 && birdLeft === 220 &&
                birdBottom > parseInt(hobbiesBox.style.bottom) - 47 - groundHeight &&
                birdBottom < parseInt(hobbiesBox.style.bottom) + 62 - groundHeight) {
                showHobbiesPopup();
                clearInterval(timerId);
            }

            if (contactBox && obstacleLeft > 220 && obstacleLeft < 260 && birdLeft === 220 &&
                birdBottom > parseInt(contactBox.style.bottom) - 47 - groundHeight &&
                birdBottom < parseInt(contactBox.style.bottom) + 62 - groundHeight) {
                showContactPopup();
                clearInterval(timerId);
            }

            if (
                obstacleLeft > 180 && obstacleLeft < 280 && birdLeft === 220 &&
                (birdBottom + groundHeight < obstacleBottom + obstacleHeight || birdBottom + groundHeight > obstacleBottom + gap - 45)
                || birdBottom <= 0
            ) {
                gameOver();
                clearInterval(timerId);
            }
        }
    
        let timerId = setInterval(moveObstacle, 20);
        if (!isGameOver) {
            setTimeout(() => {
                if (!gamePaused) {
                    generateObstacle();
                }
            }, 3000);
        }
    }

    function moveObstacle(obstacle) {
        let obstacleLeft = parseFloat(obstacle.style.left);
    
        function updateObstacle() {
            if (gamePaused) return; // Stop moving when paused
    
            obstacleLeft -= 2;
            obstacle.style.left = obstacleLeft + 'px';
    
            if (obstacleLeft <= -60) {
                clearInterval(timerId);
                gameDisplay.removeChild(obstacle);
            } else {
                requestAnimationFrame(updateObstacle);
            }
        }
    
        let timerId = requestAnimationFrame(updateObstacle);
    }

    function gameOver() {
        clearInterval(gameTimerId);
        isGameOver = true;
        gameStarted = false;
        document.removeEventListener('keyup', control);

        ground.style.animation = "none";

        gameOverScreen.classList.remove('hidden');
    }

    function restartGame() {
        location.reload();
    }

    function startCountdown() {
        let countdown = 3;
        countdownEl.innerText = countdown;
        countdownEl.classList.remove('hidden');

        const countdownInterval = setInterval(() => {
            countdown--;
            countdownEl.innerText = countdown;

            if (countdown === 0) {
                clearInterval(countdownInterval);
                countdownEl.classList.add('hidden');
                gameStarted = true;
                gameTimerId = setInterval(startGame, 20);
                generateObstacle();
            }
        }, 1000);
    }

    startButton.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        startCountdown();
    });

    restartButton.addEventListener('click', restartGame);
    document.addEventListener('keyup', control);
    

    function showAboutMePopup() {
        document.getElementById('about-me-popup').style.display = 'block';
        clearInterval(gameTimerId);
        gamePaused = true;
        document.removeEventListener('keyup', control);
    
        // Pause all moving obstacles instead of stopping them
        const allObstacles = document.querySelectorAll('.obstacle, .topObstacle');
        allObstacles.forEach(obstacle => {
            obstacle.dataset.paused = "true"; // Mark as paused
        });
    
        // Pause the question box's obstacle instead of freezing it
        const questionBox = document.querySelector('.question-box');
        if (questionBox) {
            questionBox.remove();
        }
    }

    document.getElementById('keep-playing').addEventListener('click', () => {
        document.getElementById('about-me-popup').style.display = 'none';
        gamePaused = false;
        gameTimerId = setInterval(startGame, 20);
        document.addEventListener('keyup', control);
    
        // Resume all paused obstacles
        const allObstacles = document.querySelectorAll('.obstacle, .topObstacle');
        allObstacles.forEach(obstacle => {
            if (obstacle.dataset.paused === "true") {
                moveObstacle(obstacle); // Continue moving this obstacle
                delete obstacle.dataset.paused; // Remove paused state
            }
        });
    
        if (!isGameOver) {
            generateObstacle();
        }
    });

    function showHobbiesPopup() {
        document.getElementById('hobbies-popup').style.display = 'block';
        clearInterval(gameTimerId);
        gamePaused = true;
        document.removeEventListener('keyup', control);
    
        // Pause all moving obstacles instead of stopping them
        const allObstacles = document.querySelectorAll('.obstacle, .topObstacle');
        allObstacles.forEach(obstacle => {
            obstacle.dataset.paused = "true"; // Mark as paused
        });
    
        const hobbiesBox = document.querySelector('.hobbies-box');
        if (hobbiesBox) {
            hobbiesBox.remove();
        }
    }

    document.getElementById('keep-playing-hobbies').addEventListener('click', () => {    
        document.getElementById('hobbies-popup').style.display = 'none';
        gamePaused = false;
        gameTimerId = setInterval(startGame, 20);
        document.addEventListener('keyup', control);
    
        // Resume all paused obstacles
        const allObstacles = document.querySelectorAll('.obstacle, .topObstacle');
        allObstacles.forEach(obstacle => {
            if (obstacle.dataset.paused === "true") {
                moveObstacle(obstacle);
                delete obstacle.dataset.paused;
            }
        });
    
        // Resume generating new obstacles if needed
        if (!isGameOver) {
            generateObstacle();
        }
    });

    function showContactPopup() {
        document.getElementById('contact-popup').style.display = 'block';
        clearInterval(gameTimerId);
        gamePaused = true;
        document.removeEventListener('keyup', control);
    
        // Pause all moving obstacles instead of stopping them
        const allObstacles = document.querySelectorAll('.obstacle, .topObstacle');
        allObstacles.forEach(obstacle => {
            obstacle.dataset.paused = "true"; // Mark as paused
        });
    
        const contactBox = document.querySelector('.contact-box');
        if (contactBox) {
            contactBox.remove();
        }
    }

    document.getElementById('keep-playing-contact').addEventListener('click', () => {    
        document.getElementById('contact-popup').style.display = 'none';
        gamePaused = false;
        gameTimerId = setInterval(startGame, 20);
        document.addEventListener('keyup', control);
    
        // Resume all paused obstacles
        const allObstacles = document.querySelectorAll('.obstacle, .topObstacle');
        allObstacles.forEach(obstacle => {
            if (obstacle.dataset.paused === "true") {
                moveObstacle(obstacle);
                delete obstacle.dataset.paused;
            }
        });
    
        // Resume generating new obstacles if needed
        if (!isGameOver) {
            generateObstacle();
        }
    });

    document.getElementById('back-to-start').addEventListener('click', () => {
        location.reload(); // Reloads the page, bringing the user back to the start screen
    });
});