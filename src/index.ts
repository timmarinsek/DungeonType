import * as readline from 'readline';

interface Position{
    x: number;
    y: number;
}

class Player {


    constructor(public position: Position, public symbol: string = "P") {}

    move(dx : number, dy : number) {
        this.position.x += dx;
        this.position.y += dy;
    }

}

const player = new Player({x: 5, y: 5});
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}


function draw(){
    console.clear();
    console.log("--- DUNGEON TYPE ---");
    console.log("Premikaj se s PUŠČICAMI, napadaj s SPACE, 'q' za izhod.");
    console.log(`Pozicija: x:${player.position.x}, y:${player.position.y}`);
    console.log("\n".repeat(player.position.y));
    console.log(" ".repeat(player.position.x) + player.symbol); 
}

process.stdin.on('keypress', (str, key) => {
    if(key.name === 'q') {
        process.exit();
    }
    switch(key.name) {
        case 'up':
            player.move(0, -1); break;
        case 'down':
            player.move(0, 1); break;
        case 'left':
            player.move(-1, 0); break;
        case 'right':
            player.move(1, 0); break;
        case 'space':
            player.symbol = player.symbol === "P" ? "X" : "P";
            setTimeout(() => {player.symbol = "P"; draw();},200);
            break;
    }
    draw();

});

draw();