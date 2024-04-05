import { useEffect, useState } from "react";
import "./App.css";

export default function MazeGrid({width = 19, height = 19}) {
  const [maze, setMaze] = useState([]);
  const [timeOutIds, setTimeoutIds] = useState([]);

  useEffect((()=> {
    generateMaze(width, height)
  }), [width, height])
  
  function bfs(start) {
    let queue = [start];
    let visited = new Set(`${start[0]},${start[1]}`);

    function visitCell([x, y]) {

      
      setMaze((prevMaze) =>
        prevMaze.map((row, rowIndex) =>
          row.map((cell, cellIndex) => {
            if (rowIndex === y && cellIndex === x) {
              return cell === "end" ? "end" : "visited";
            }
            return cell;
          }),
        ),
      );
      
      if (maze[y][x] === "end") {
        console.log("path found");
        return true;
      }
      return false;
    }

    function step() {
      if (queue.length === 0) {
        return;
      }

      const [x, y] = queue.shift();
      console.log(`${x}, ${y}`);
      console.log("new step");

      const dirs = [
        [-1, 0], // up
        [0, 1], // right
        [1, 0], // down
        [0, -1], // left
      ];

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < height &&
          !visited.has(`${nx}, ${ny}`)
        ) {
          visited.add(`${nx}, ${ny}`);
          if (maze[ny][nx] === "path" || maze[ny][nx] === "end") {
            if (visitCell([nx, ny])) {
              return true;
            }
            queue.push([nx, ny]);
          }
        }
      }
      const timeoutId = setTimeout(step, 60);
      setTimeoutIds((prevTimeoutIds) => [...prevTimeoutIds, timeoutId]);
    }

    step();
    return false;
  }

  function dfs(start) {
    let stack = [start];
    let visited = new Set(`${start[0]},${start[1]}`);

    function visitCell([x, y]) {
      console.log(x, y);

      setMaze((prevMaze) =>
        prevMaze.map((row, rowIndex) =>
          row.map((cell, cellIndex) => {
            if (rowIndex === y && cellIndex === x) {
              return cell === "end" ? "end" : "visited";
            }
            return cell;
          }),
        ),
      );


      if (maze[y][x] === "end") {
        console.log("path found");
        return true;
      }
      return false;
    }

    function step() {
      if (stack.length === 0) {
        return;
      }

      const [x, y] = stack.pop();
      console.log("new step");

      const dirs = [
        [-1, 0], // up
        [0, 1], // right
        [1, 0], // down
        [0, -1], // left
      ];

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < height &&
          !visited.has(`${nx},${ny}`)
        ) {
          visited.add(`${nx},${ny}`);
          if (maze[ny][nx] === "path" || maze[ny][nx] === "end") {
            if (visitCell([nx, ny])) {
              return true;
            }
            stack.push([nx, ny]);
          }
        }
      }
      const timeoutId = setTimeout(step, 60);
      setTimeoutIds((prevTimeoutIds) => [...prevTimeoutIds, timeoutId]);
    }

    step();
    return false;
  }

  function generateMaze(height, width) {
    // Generate a random maze
    let matrix = [];

    for (let i = 0; i < height; i++) {
      let row = [];
      for (let j = 0; j < width; j++) {
        let cell = Math.random();
        row.push("wall");
      }
      matrix.push(row);
    }

    const dirs = [
      [-1, 0], // up
      [0, 1], // right
      [1, 0], // down
      [0, -1], // left
    ];

    function isCellValid(x, y) {
      return (
        y >= 0 && y < height && x >= 0 && x < width && matrix[y][x] === "wall"
      );
    }

    function carve(x, y) {
      matrix[y][x] = "path";

      const directions = dirs.sort(() => Math.random() - 0.5);

      for (const [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;
        if (isCellValid(nx, ny)) {
          matrix[y + dy][x + dx] = "path";
          carve(nx, ny);
        }
      }
    }

    carve(1, 1);

    matrix[1][0] = "start";
    matrix[height - 2][width - 1] = "end";

    setMaze(matrix);
  }

  function refreshMaze() {
    timeOutIds.forEach(clearTimeout);
    setTimeoutIds([]);
    generateMaze(width, height);
  }

  return (
    <main>
      <div className={"maze-grid"}>
        <div className={"buttons"}>
          <button
            className={"maze-button"}
            onClick={() => refreshMaze()}
          >
            {" "}
            Refresh Maze{" "}
          </button>
          <button className={"maze-button"} onClick={() => dfs([1, 0])}>
            {" "}
            Depth First Search Algo{" "}
          </button>
          <button className={"maze-button"} onClick={() => bfs([1, 0])}>
            {" "}
            Breadth First Search Algo{" "}
          </button>
        </div>
        <div className={"maze"}>
          {maze.map((row, rowIndex) => (
            <div className="row">
              {row.map((cell, cellIndex) => (
                <div className={`cell ${cell}`}></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
