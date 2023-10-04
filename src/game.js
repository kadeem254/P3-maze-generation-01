import "./style.css";
import Phaser from "phaser";

function generateMaze(rowCount, columnCount) {
    const mazeData = {};
    const frontiers = {};
    const visitedCells = {};
    const startX = 1;
    const startY = 1;

    const markAsOpen = (x, y) => {
        mazeData[generateCoordinate(x, y)] = false;
    };

    /**
     * Generate an (x,y) coordinate for a cell, ensures all coordinates generated are uniform and have the same format and whitespace.
     * @param {number} x - x coordinate of a cell
     * @param {number} y - y coordinate of a cell
     * @returns
     */
    const generateCoordinate = (x, y) => {
        return `${x},${y}`;
    };

    /**
     * Adds the given cell to the hashtable containing visited cells
     * @param {number} x - x coordinate of the cell
     * @param {number} y - y coordinate of the cell
     */
    const addToVisited = (x, y) => {
        visitedCells[generateCoordinate(x, y)] = { x, y };
    };

    /**
     * Generates all valid cells that can be expanded to from the given cell coordinates, and adds all valid coordinates to the frontiers hash table.
     * @param {number} x - x coordinate of the cell
     * @param {number} y - y coordinate of the cell
     * @returns
     */
    const getFrontiers = (x, y) => {
        // check top
        if (y >= 2 && mazeData[generateCoordinate(x, y - 2)] === true) {
            frontiers[generateCoordinate(x, y - 2)] = {
                x: x,
                y: y - 2,
            };
        }
        // check left
        if (x >= 2 && mazeData[generateCoordinate(x - 2, y)] === true) {
            frontiers[generateCoordinate(x - 2, y)] = {
                x: x - 2,
                y: y,
            };
        }
        // check right
        if (x <= columnCount - 2 && mazeData[generateCoordinate(x + 2, y)] === true) {
            frontiers[generateCoordinate(x + 2, y)] = {
                x: x + 2,
                y: y,
            };
        }
        // check bottom
        if (y <= rowCount - 2 && mazeData[generateCoordinate(x, y + 2)] === true) {
            frontiers[generateCoordinate(x, y + 2)] = {
                x: x,
                y: y + 2,
            };
        }
        return;
    };

    /**
     * Returns an array of all cells that can be explored from a given cell, only returns visited nodes
     * @param {number} x - x coordinate of the cell
     * @param {number} y - y coordinate of the cell
     * @returns
     */
    const getNeighbours = (x, y) => {
        const neightbours = [];

        // top
        if (y - 2 >= 1) {
            let key = generateCoordinate(x, y - 2);
            if (key in visitedCells) neightbours.push(key);
        }
        // left
        if (x - 2 >= 1) {
            let key = generateCoordinate(x - 2, y);
            if (key in visitedCells) neightbours.push(key);
        }
        // right
        if (x + 2 <= columnCount - 2) {
            let key = generateCoordinate(x + 2, y);
            if (key in visitedCells) neightbours.push(key);
        }
        // bottom
        if (y + 2 <= rowCount - 2) {
            let key = generateCoordinate(x, y + 2);
            if (key in visitedCells) neightbours.push(key);
        }

        return neightbours;
    };

    const connectCells = (x1, y1, x2, y2) => {
        // get cells between the two points
        let inBetween = {
            x: (x1 + x2) / 2,
            y: (y1 + y2) / 2,
        };

        // console.log( `Fills is ${inBetween.x},${inBetween.y}` );
        markAsOpen(inBetween.x, inBetween.y);
        return;
    };

    // create default maze data
    for (let y = 0; y < rowCount; y++) {
        for (let x = 0; x < columnCount; x++) {
            mazeData[generateCoordinate(x, y)] = true;
        }
    }

    markAsOpen(startX, startY);
    addToVisited(startX, startY);
    getFrontiers(startX, startY);

    console.log(frontiers);

    // runs as long as there are existing frontiers
    while (Object.keys(frontiers).length > 0) {
        // pick an existing frontier at random
        const frontierKeys = Object.keys(frontiers);
        const randomFrontierIndex = Math.floor(
            Math.random() * frontierKeys.length
        );
        const { x: frontier_X, y: frontier_Y } =
            frontiers[frontierKeys[randomFrontierIndex]];

        // get neighbours belonging to the visited set
        const visitedNeighbours = getNeighbours(frontier_X, frontier_Y);

        // pick a random neighbour to connect to
        let index = Math.floor(Math.random() * visitedNeighbours.length);
        const { x: visited_X, y: visited_Y } =
            visitedCells[visitedNeighbours[index]];

        // connect to selected neighbour
        connectCells(visited_X, visited_Y, frontier_X, frontier_Y);

        // remove the frontier from the frontier list and add it to
        // the visited hash table,
        delete frontiers[frontierKeys[randomFrontierIndex]];
        addToVisited(frontier_X, frontier_Y);

        // make it open|corridor
        markAsOpen(frontier_X, frontier_Y);

        // add new frontiers from it
        getFrontiers(frontier_X, frontier_Y);
    }
    return {
        data: Object.values(mazeData),
        cols: columnCount,
        rows: rowCount,
    };
}

/**
 *
 * @param {Object} maze
 * @param {Array} maze.data
 * @param {number} maze.cols
 * @param {number} maze.rows
 */
function drawMaze(maze) {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    grid.style.setProperty("--rows", `${maze.rows}`);
    grid.style.setProperty("--cols", `${maze.cols}`);

    const data = maze.data;
    for (let i = 0; i < data.length; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");

        if (false === data[i]) {
            cell.classList.add("open");
        }

        grid.append(cell);
    }
}

window.addEventListener("load", (e) => {
    let maze = generateMaze(999,99);
    drawMaze( maze )
});
