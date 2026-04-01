import * as readline from 'readline';

interface Position{
    x: number;
    y: number;
}


class Map{
    public grid: number[][] = [
       [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
        [1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    canMoveTo(x: number, y: number): boolean {
        const height = this.grid.length;
        const width = this.grid[0]?.length ?? 0;

        if (x < 0 || x >= width || y < 0 || y >= height) {
            console.log("Zunaj meja mape!");
            return false;
        }

        if (this.grid[y]?.[x] === 0) {
            return true;
        } else {
            console.log("Tam je zid!");
            return false;
        }
    }
}


class Player {
    
    public torches : number = 3;

    constructor(public position: Position, public symbol: string = "P") {}

    move(dx: number, dy: number, map: Map) {
        const nextX = this.position.x + dx;
        const nextY = this.position.y + dy;

        if (map.canMoveTo(nextX, nextY)) {
            this.position.x = nextX;
            this.position.y = nextY;
            return true;
        }
        return false;
    }

    placeTorch(){
       const index = placedTorches.findIndex(
        torch => torch.x === this.position.x && torch.y === this.position.y);
        if(this.torches > 0 && index === -1) 
        {
            placedTorches.push({x: this.position.x, y: this.position.y});
            this.torches--;
            return true;
        }
        else if(index !== -1)
        {
            placedTorches.splice(index, 1);
            this.torches++; 
            return true;
        }
        return false
    }

}
class Enemy {
    public moveCounter: number = 0;

    constructor(public position: {x: number, y: number}, public symbol: string = "M") {}

    update(playerPos: {x: number, y: number}, map: Map, placedTorches: {x: number, y: number}[]) {
        this.moveCounter++;
        
        if (this.moveCounter < 2) return;
        this.moveCounter = 0;

        const dx = playerPos.x - this.position.x;
        const dy = playerPos.y - this.position.y;

        let nextX = this.position.x;
        let nextY = this.position.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            nextX += dx > 0 ? 1 : -1;
        } else if (dy !== 0) {
            nextY += dy > 0 ? 1 : -1;
        }

        const isWall = (map.grid[nextY]?.[nextX] ?? 1) === 1;
        const isTorch = placedTorches.some(t => t.x === nextX && t.y === nextY);

        if (!isWall && !isTorch) {
            this.position.x = nextX;
            this.position.y = nextY;
        }
    }
}

const enemy = new Enemy({ x: 20, y: 10 });


const placedTorches: Position[] = [];
const map  = new Map();
const player = new Player({x: 5, y: 5});
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}


function draw(){
    console.clear();
    console.log("--- DUNGEON TYPE ---");
   
    const playerViewDistance = 3;
    const torchViewDistance = 3;
    for(let y = 0; y < map.grid.length; y++)
    {
        let rowStr="";
        for(let x = 0; x <(map.grid[0]?.length ?? 0); x++)
        {

            const distToPlayer = Math.sqrt((x - player.position.x) ** 2 + (y - player.position.y) ** 2);
            const isVisibleByPlayer = distToPlayer < playerViewDistance;

            const isVisibleByTorch = placedTorches.some(torch => {
                const distToTorch = Math.sqrt((x - torch.x) ** 2 + (y - torch.y) ** 2);
                return distToTorch < torchViewDistance;
            });
            if(isVisibleByPlayer || isVisibleByTorch) {

                const hasTorch = placedTorches.some(t => t.x === x && t.y === y);
                
                if (player.position.x === x && player.position.y === y) {
                    rowStr += player.symbol+ " "; 
                }else if (enemy.position.x === x && enemy.position.y === y) {
                    rowStr += "M ";
                }
                else if(hasTorch){
                    rowStr += "T ";
                } else if ((map.grid[y]?.[x] ?? 0) === 1) {
                    rowStr += "# ";
                
                }else  {
                    rowStr += ". ";
                }
            }else{
                rowStr += "  ";
            }
        }
        console.log(rowStr);

    }

}

process.stdin.on('keypress', (str, key) => {
    if(key.name === 'q') {
        process.exit();
    }
    let moved = false;
    switch(key.name) {
        case 'up':
            player.move(0, -1, map); moved = true; break;
        case 'down':
            player.move(0, 1, map); moved = true; break;
        case 'left':
            player.move(-1, 0, map); moved = true; break;
        case 'right':
            player.move(1, 0, map); moved = true; break;
        case 'space':
            player.placeTorch();
    }
    if (moved) {
        enemy.update(player.position, map, placedTorches);
        
        
        if (player.position.x === enemy.position.x && player.position.y === enemy.position.y) {
            draw();
            console.log("\n--- DUH TE JE UJEL! KONEC IGRE ---");
            process.exit();
        }
    }
    draw();

});

draw();