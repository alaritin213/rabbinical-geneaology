// Function to find roots in the graph
function findRoots(nodes, edges) {
  const incoming = new Set(edges.map(edge => edge.target));

  return nodes.filter(node => !incoming.has(node.id)).map(node => node.id);
}

// Function to create an adjacency list
function makeAdjacencyList(nodes, edges) {
  const list = {};

  nodes.forEach((node) => {
    list[node.id] = [];
  });

  edges.forEach((edge) => {
    list[edge.source].push(edge.target);
  });

  return list;
}

// Function to perform BFS starting from all roots
function bfs(nodes, edges) {
  const adjacencyList = makeAdjacencyList(nodes, edges);
  const roots = findRoots(nodes, edges);

  const queue = [...roots];
  const levels = {};

  roots.forEach(root => {
    levels[root] = 0;
  });

  while (queue.length) {
    const node = queue.shift();

    adjacencyList[node].forEach((neighbor) => {
      if (levels[neighbor] === undefined) {
        queue.push(neighbor);
        levels[neighbor] = levels[node] + 1;
      }
    });
  }

  return levels;
}

// assign levels to avoid backwards edges 
// as much as possible, anyway
function bfs_avoid_up(nodes, edges) {
  const adjacencyList = makeAdjacencyList(nodes, edges);
  const roots = findRoots(nodes, edges);

  const queue = [...roots];
  const levels = {};

  roots.forEach(root => {
    levels[root] = 0;
  });

  while (queue.length) {
    const node = queue.shift();

    adjacencyList[node].forEach((neighbor) => {
      if (levels[neighbor] === undefined) {
        queue.push(neighbor);
        levels[neighbor] = levels[node] + 1;
      } else if (levels[neighbor] <= levels[node]) {
        levels[neighbor] = levels[node] + 1;
      }
    });
  }

  return levels;
}


export function positionByBfs(nodes, edges) {
  const levels = bfs_avoid_up(nodes, edges);
  
  // Get all unique levels and sort them
  const uniqueLevels = [...new Set(Object.values(levels))].sort((a, b) => a - b);

  // Prepare data structure for level-wise nodes
  const levelNodes = {};
  uniqueLevels.forEach(level => {
    levelNodes[level] = [];
  });

  // Fill the levelNodes object
  Object.entries(levels).forEach(([nodeId, level]) => {
    levelNodes[level].push(nodes.find(node => node.id === nodeId));
  });

  // Space between nodes and levels
  const dx = 200, dy = 200;

  // Adjust positions
  uniqueLevels.forEach((level, i) => {
    levelNodes[level].forEach((node, j) => {
      node.position.x = j * dx;
      node.position.y = i * dy;
    });
  });

  return nodes;
}
