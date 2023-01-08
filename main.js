//Enemy Canvas
let c1 = document.getElementById('my-canvas-enemy');
c1.width = (window.innerWidth - 10) / 2;
let enemyCtx = c1.getContext('2d');
enemyCtx.translate(400, 0);
enemyCtx.scale(-1, 1);

let martialActions = ["idle", "kick", "punch", "block", "forward", "backward"];

//Player Canvas
let c = document.getElementById("my-canvas");
c.width = (window.innerWidth - 10) / 2;
let ctx = c.getContext("2d");

let posX = 0;
let enemyPosX = 0;
let frames = {
    idle: [1, 2, 3, 4, 5, 6, 7, 8],
    kick: [1, 2, 3, 4, 5, 6, 7],
    punch: [1, 2, 3, 4, 5, 6, 7],
    forward: [1, 2, 3, 4, 5, 6],
    backward: [1, 2, 3, 4, 5, 6],
    block: [1, 2, 3, 4, 5, 6, 7, 8, 9],
};

//console.log(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);

//Image Container to load images
let loadImage = (src, callback) => {
    let img = document.createElement("img");
    img.onload = () => callback(img);
    img.src = src;
};

//Get and Set image paths
let imagePath = (frameNumber, animation) => {
    return `./images/${animation}/${frameNumber}.png`;
};

// Loop images for a single Martial Art action
let loadImages = (callback) => {
    let images = {};
    //Based on the frames object keys set image object keys
    martialActions.map(key => images[key] = []);
    let imagesToLoad = 0;

    martialActions.forEach((animation) => {
        let animationFrames = frames[animation];
        imagesToLoad += animationFrames.length;

        animationFrames.forEach((frameNumber) => {
            let path = imagePath(frameNumber, animation);

            loadImage(path, (image) => {
                images[animation][frameNumber - 1] = image;
                imagesToLoad = imagesToLoad - 1;

                if (imagesToLoad === 0) {
                    callback(images);
                }
            })
        });
    });
};

//Loo
let animate = (ctx, images, animation, isEnemy, callback) => {
    images[animation].forEach((image, index) => {
        setTimeout(() => {
            if (!isEnemy) {
                ctx.clearRect(posX, 0, 400, 400);
                if (animation === "forward") {
                    if (posX < c.width - posX / 2) {
                        posX += 20;
                    }
                } else if (animation === "backward") {
                    if (posX > 0) {
                        posX -= 20;
                    }
                }
                ctx.drawImage(image, posX, 0, 400, 400);
            } else {
                ctx.clearRect(enemyPosX, 0, 400, 400);
                if (animation === "forward") {
                    if ((-enemyPosX) < 0) {
                        enemyPosX += 20;
                    }
                } else if (animation === "backward") {
                    if (enemyPosX < (c1.width - (-enemyPosX)) / 2) {
                        enemyPosX -= 20;
                    }
                }
                ctx.drawImage(image, enemyPosX, 0, 400, 400);
            }
        }, index * 100);

    });
    setTimeout(callback, images[animation].length * 100);
};

loadImages((images) => {

    let queuedAnimations = [];

    let enemyAux = () => {
        let item = martialActions[Math.floor(Math.random() * martialActions.length)];
        animate(enemyCtx, images, item, true, () => {
            console.log("Enemy Action" + item)
        });
        setTimeout(enemyAux, 2000);
    };

    let aux = () => {
        let selectedAnimation;
        if (queuedAnimations.length === 0) {
            selectedAnimation = "idle";
        } else {
            selectedAnimation = queuedAnimations.shift();
        }
        animate(ctx, images, selectedAnimation, false, aux);
    };

    aux();
    enemyAux();

    document.getElementById("kick").onclick = () => {
        queuedAnimations.push("kick");
    };

    document.getElementById("punch").onclick = () => {
        queuedAnimations.push("punch");
    };

    document.getElementById("forward").onclick = () => {
        queuedAnimations.push("forward");
    };

    document.getElementById("backward").onclick = () => {
        queuedAnimations.push("backward");
    };

    document.getElementById("block").onclick = () => {
        queuedAnimations.push("block");
    };

    document.addEventListener("keyup", (event) => {
        const key = event.key;

        if (key === "Control") {
            queuedAnimations.push("kick");
        } else if (key === " ") {
            queuedAnimations.push("punch");
        } else if (key === "ArrowDown") {
            queuedAnimations.push("block");
        } else if (key === "ArrowLeft") {
            queuedAnimations.push("backward");
        } else if (key === "ArrowRight") {
            queuedAnimations.push("forward");
        }
    });

});