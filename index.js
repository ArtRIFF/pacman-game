sample1 = () => {
    const vector = new Vector(0, 0);
    createPixiApplication();
    // let container = new PIXI.Container();
    const circle = new PIXI.Graphics()
        .beginFill(0xff0000, 0.7)
        .drawCircle(0, 0, 25);
    const frame = new PIXI.Graphics().lineStyle(2, 0x00FF00, 0.4).drawRect(2, 2, 800 - 4, 600 - 4);
    const title = new PIXI.Text("Game Title", {
        fill: [
            "#53b512",
            "#c70000"
        ],
        fillGradientStops: [
            0.2
        ],
        stroke: "white",
        strokeThickness: 1
    });
    /*title.position.set(
        800 / 2 - title.width / 2,
        0
    );*/
    title.anchor.x = 0.5;
    title.position.set(
        800 / 2,
        0
    );
    // title.text += " Hello World";
    circle.position.x += 100;
    circle.position.y += 100;
    // circle.scale.x = 2;
    // circle.scale.y = 4;
    // circle.scale.set(1, 1);
    // circle.angle += 10;
    // container.position.set(300, 400);
    let counter = 0;
    let date = Date.now();
    /*setInterval(()=>{
        let dt = Date.now() - date;
        console.log("dt", dt);
        date = Date.now();
        // circle.alpha = 1
        circle.position.x = Math.sin(counter)*100;
        circle.position.y = Math.cos(counter)*100;
        counter +=0.1;
    }, 1000/60);*/
    // container.
    const mainContainer = new PIXI.Container();
    app.stage.addChild(mainContainer);
    mainContainer.addChild(circle, frame, title);
    window.document.onkeydown = (e) => {
        console.log(e.type, e.key);
        let offset = 3;
        switch (e.key) {
            case "ArrowLeft":
                vector.x -= offset;
                break;
            case "ArrowRight":
                vector.x += offset;
                break;
            case "ArrowUp":
                vector.y -= offset;
                break;
            case "ArrowDown":
                vector.y += offset;
                break;
        }
        // vector.normalize();
    };

    const ticker = new PIXI.Ticker();
    ticker.add((dtFactor) => {
        console.log(dtFactor);
        // circle.position.x = Math.sin(counter)*100;
        // circle.position.y = Math.cos(counter)*100;
        // counter +=0.1*dtFactor;
        circle.position.x += vector.x;
        circle.position.y += vector.y;

        vector.mult(0.98);
        circle.position.x = (800 + circle.position.x) % 800;
        circle.position.y = (600 + circle.position.y) % 600;
    });
    ticker.start();
}
sample2 = async () => {
    const dotRadius = 5;
    let diraction = "right";
    let scoresCounter = 0;
    let isGameStart = false;
    const vector = new Vector(0, 0);
    const mainContainer = new PIXI.Container();
    const gameContainer = new PIXI.Container();
    const finishContainer = new PIXI.Container();
    const emptySprite = new PIXI.Sprite();
    const loader = PIXI.Loader.shared;
    const createDot = (position) => {
        const dot = new PIXI.Graphics().beginFill(0xffff00).drawCircle(
            0,
            0,
            dotRadius
        );
        dot.position.set(position.x, position.y);
        return dot;
    };

    createPixiApplication();
    //loader stuff:
    loader.add('BG', 'images/game_bg.png');
    loader.add('PAC1', 'images/pack1.png');
    loader.add('PAC2', 'images/pack2.png');
    loader.add('ENEMY', 'images/blinky.png');
    loader.add('BOSS', 'images/enemyBoss.png');
    const loaderPromise = new Promise(resolve => {
        loader.onComplete.add((e) => {
            resolve();
        });
    });
    loader.load();
    await loaderPromise;
    //scene construct stuff:
    let style = {
        fill: [
            "#53b512",
            "#c70000"
        ],
        fillGradientStops: [
            0.2
        ],
        stroke: "white",
        strokeThickness: 1,
    };
    const title = new PIXI.Text("Game Pacman", style);
    const titleStart = new PIXI.Text("Click enter to start game!", style);
    const titleEnd = new PIXI.Text("Game Over", style);
    const scores = new PIXI.Text(`Scores: ${scoresCounter}`, style);
    const frame = new PIXI.Graphics().lineStyle(2, 0x00FF00, 0.4).drawRect(2, 2, 800 - 4, 600 - 4);
    const bgTexture = loader.resources.BG.texture;
    const pacmanTexture1 = loader.resources.PAC1.texture;
    const pacmanTexture2 = loader.resources.PAC2.texture;
    const enemyBossTexture = loader.resources.BOSS.texture;
    const enemyTexture = loader.resources.ENEMY.texture;
    const spriteBG = new PIXI.Sprite(bgTexture);
    const pacman = new PIXI.Sprite(pacmanTexture1);
    const enemyBoss = new PIXI.Sprite(enemyBossTexture);
    let dots = [];
    let enemyArray = [];

    spriteBG.scale.y = 1.25;
    spriteBG.scale.x = 1;

    title.anchor.x = 0.5;
    titleStart.anchor.x = 0.5;
    titleEnd.anchor.x = 0.5;
    title.position.set(
        800 / 2,
        0
    );
    titleEnd.position.set(
        800 / 2,
        600 / 2
    );
    titleStart.position.set(
        800 / 2,
        600 / 2
    );
    scores.anchor.x = 1;
    scores.position.set(
        800 - 4,
        0
    );

    app.stage.addChild(gameContainer);

    gameContainer.addChild(titleStart);

    //create enemy func 
    const createEnemy = (position) => {
        const enemy = new PIXI.Sprite(enemyTexture);
        enemy.anchor.x = 0.5;
        enemy.anchor.y = 0.5;
        enemy.scale.set(0.17);
        enemy.position.set(position.x, position.y);
        return enemy;
    };

    //pacman animation setup:
    setInterval(() => {
        pacman.texture = pacman.texture === pacmanTexture2 ? pacmanTexture1 : pacmanTexture2;
    }, 300);
    //game play setup:
    if (!isGameStart) {
        window.document.onkeydown = (e) => {
            if (e.key === 'Enter') {
                enemyBoss.anchor.x = 0.5;
                enemyBoss.anchor.y = 0.5;
                enemyBoss.scale.set(0.125);
                enemyBoss.position.set(400 / 2, 300 / 2);

                scoresCounter = 0;
                pacman.anchor.x = 0.5;
                pacman.anchor.y = 0.5;
                pacman.scale.set(0.125);
                pacman.position.set(800 / 2, 600 / 2);
                scores.text = `Scores: ${scoresCounter}`;
                isGameStart = true;
                app.stage.removeChild(gameContainer);
                app.stage.addChild(mainContainer);
                mainContainer.addChild(spriteBG, title, scores, pacman, enemyBoss);
                for (let i = 1; i < 10; i++) {
                    for (let j = 2; j < 10; j++) {
                        let offsets = 90;
                        let dot = createDot({ x: i * offsets, y: j * offsets });
                        mainContainer.addChild(dot);
                        dots.push(dot);
                    }
                }
                for (let n = 0; n < 4; n++) {
                    let enemy;
                    let dist;
                    do {
                        enemy = createEnemy({ x: Math.random() * (600 - n * 50) + (n * 20), y: Math.random() * (600 - n * 50) + (n * 20) });
                        dist = distance(pacman.position, enemy.position);
                    } while ((dist < pacman.width * 0.5 + 5));
                    mainContainer.addChild(enemy);
                    enemyArray.push(enemy);
                    enemy.scale.x *= -1;
                    animationEnemyWalk(enemy);
                }
                if (isGameStart) {
                    window.document.addEventListener('keydown', pacmanControl);
                }
            }
        };
    }

    const checkMath = () => {
        pacman.x;
        pacman.y;
        dots.slice().forEach(dot => {
            const dist = distance(pacman.position, dot.position);
            if (dist < pacman.width * .5 + dotRadius) {
                flyToScore(dot);
                scoresCounter++;
                if (scoresCounter <= 10) {
                    animationScore(scoresCounter);
                    dots.splice(dots.indexOf(dot), 1);
                } else {
                    endGame("win");
                }
            }
        });
    }

    const checkBite = () => {
        pacman.x;
        pacman.y;
        enemyArray.slice().forEach(enemy => {
            const dist = distance(pacman.position, enemy.position);
            if (dist < pacman.width * 0.5 + 5) {
                endGame("lose");
            }
        });

        const distBoss = distance(pacman.position, enemyBoss.position);

        if ((distBoss < pacman.width * 0.5 + 5) && isGameStart) {
            endGame("lose");
        }
    }

    const enemyBossWalk = () => {
        const offset = 1;

        const vectorEnemyPossibleX = new Vector(enemyBoss.position.x + offset, enemyBoss.position.y);
        const vectorEnemyPossibleNegativeX = new Vector(enemyBoss.position.x - offset, enemyBoss.position.y);
        const vectorEnemyPossibleY = new Vector(enemyBoss.position.x, enemyBoss.position.y + offset);
        const vectorEnemyPossibleNegativeY = new Vector(enemyBoss.position.x, enemyBoss.position.y - offset);

        const distanseEnemyPossibleX = distance(vectorEnemyPossibleX, pacman);
        const distanseEnemyPossibleNegativeX = distance(vectorEnemyPossibleNegativeX, pacman);
        const distanseEnemyPossibleY = distance(vectorEnemyPossibleY, pacman);
        const distanseEnemyPossibleNegativeY = distance(vectorEnemyPossibleNegativeY, pacman);

        const allEnemyPossibleMove = [
            {
                vector: vectorEnemyPossibleX,
                distance: distanseEnemyPossibleX
            },
            {
                vector: vectorEnemyPossibleNegativeX,
                distance: distanseEnemyPossibleNegativeX
            },
            {
                vector: vectorEnemyPossibleY,
                distance: distanseEnemyPossibleY
            },
            {
                vector: vectorEnemyPossibleNegativeY,
                distance: distanseEnemyPossibleNegativeY
            }
        ]
        let minDistObject = allEnemyPossibleMove[0];

        allEnemyPossibleMove.forEach(possibleMove => {
            if (possibleMove.distance < minDistObject.distance) {
                minDistObject = possibleMove;
            }
        })
        enemyBoss.position.x = minDistObject.vector.x;
        enemyBoss.position.y = minDistObject.vector.y;
        minDistObject.vector.mult(0.98);
        enemyBoss.position.x = (800 + enemyBoss.position.x) % 800;
        enemyBoss.position.y = (600 + enemyBoss.position.y) % 600;

    }

    const updatePositions = () => {
        pacman.position.x += vector.x * 3;
        pacman.position.y += vector.y * 3;
        vector.mult(0.98);
        pacman.position.x = (800 + pacman.position.x) % 800;
        pacman.position.y = (600 + pacman.position.y) % 600;
    }

    function pacmanControl(e) {
        console.log(e.type, e.key);
        let offset = 0.5;

        switch (e.key) {
            case "ArrowLeft":
                vector.x -= offset;
                break;
            case "ArrowRight":
                vector.x += offset;
                break;
            case "ArrowUp":
                vector.y -= offset;
                break;
            case "ArrowDown":
                vector.y += offset;
                break;
            default:
                return;
        }

        const orientationLeft = Math.abs(vector.angle()) > (Math.PI / 2);
        if (orientationLeft) {
            if (diraction === "right") {
                pacman.scale.y *= -1;
                diraction = "left";
            }
        }

        const orientationRight = Math.abs(vector.angle()) < (Math.PI / 2);
        if (orientationRight) {
            if (diraction === "left") {
                pacman.scale.y *= -1;
                diraction = "right";
            }
        }

        vector.normalize();
        pacman.rotation = vector.angle();
    }

    function endGame(resultText) {
        titleEnd.text = `Game over! You ${resultText}!Click Enter to retry.`;
        app.stage.removeChild(mainContainer);
        finishContainer.addChild(titleEnd);
        app.stage.addChild(finishContainer);
        window.document.removeEventListener('keydown', pacmanControl);
        dots = [];
        enemyArray = [];
        enemyBoss.rotation = 0;
        pacman.rotation = 0;
        vector.x = 0;
        vector.y = 0;
    }

    function animationScore(score) {
        let isBlink = false;
        let roundOffset = 0.01;
        const fillStandart = [
            "#53b512",
            "#c70000"
        ];
        const fillBlink = [
            "yellow",
            "red"
        ];

        const stopID = setInterval(() => {
            spriteBG.position.y = Math.cos(roundOffset * 0.2) * 5;
            spriteBG.position.x = Math.sin(roundOffset * 0.2) * 5;
            scores.position.y = Math.cos(roundOffset) * 10;
            roundOffset++;
        }, 900 / 24);

        const stopBlinkID = setInterval(() => {
            if (isBlink) {
                scores.style.fill = fillStandart;
                isBlink = false;
            } else {
                scores.style.fill = fillBlink;
                isBlink = true;
            }
        }, 1000 / 60);

        setTimeout(() => {
            clearInterval(stopID);
            clearInterval(stopBlinkID);
            scores.style.fill = fillStandart;
            spriteBG.scale.y = 1.25;
            spriteBG.scale.x = 1;
            scores.position.set(
                800 - 4,
                0
            );
            scores.text = `Scores: ${score}`;
        }, 3000);

        setTimeout(() => {
            scores.scale.y = 1;
            scores.scale.x = 1;
            scores.position.set(
                800 - 4,
                0
            );
        }, 4000);
    }
    
    function flyToScore (dot) {
        const offset = 2.5;
      
        ticker.add(() => {
            const vectorDotPossibleX = new Vector(dot.position.x + offset, dot.position.y);
            const vectorDotPossibleY = new Vector(dot.position.x, dot.position.y - offset);

    
            const distanseDotPossibleX = distance(vectorDotPossibleX, scores);
            const distanseDotPossibleY = distance(vectorDotPossibleY, scores);
            
            if (distanseDotPossibleX < distanseDotPossibleY) {
                dot.position.x = vectorDotPossibleX.x;
                dot.position.y = vectorDotPossibleX.y;
            } else {
                dot.position.x = vectorDotPossibleY.x;
                dot.position.y = vectorDotPossibleY.y;
            }

            if (distanseDotPossibleX < scores.width * .5 + dotRadius || distanseDotPossibleY < scores.width * .5 + dotRadius) {
                mainContainer.removeChild(dot);
            }
        });
    }

    function animationEnemyWalk(enemy) {
        const offset = 1;
        ticker.add(() => {
            enemy.position.x += offset;
            enemy.position.x = (800 + enemy.position.x) % 800;
        });
    }

    const ticker = new PIXI.Ticker();
    ticker.add(() => {
        updatePositions();
        enemyBossWalk();
    });
    ticker.add(() => {
        checkMath();
    });
    ticker.add(() => {
        checkBite();
    });
    ticker.start();
}

createPixiApplication = () => {
    const app = new PIXI.Application({
        width: 800,
        height: 600,
        backgroundColor: 0x000000,
        transparent: false,
    });
    document.body.appendChild(app.view);
    window.app = app;
}