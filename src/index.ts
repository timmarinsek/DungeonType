import * as readline from 'readline';

interface Position{
    x: number;
    y: number;
}


class Map{
    public grid: number[][] = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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
                }else if(hasTorch){
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
    switch(key.name) {
        case 'up':
            player.move(0, -1, map); break;
        case 'down':
            player.move(0, 1, map); break;
        case 'left':
            player.move(-1, 0, map); break;
        case 'right':
            player.move(1, 0, map); break;
        case 'space':
            player.placeTorch();
    }
    draw();

});

draw();