# Labyrinth algorithms

> Or how to find a path between two points in the maze. 
Base Algorithm review for
["Open Labyrinth"](http://www.checkio.org/mission/open-labyrinth/share/574bd1ded68c9705c5d6f07c6206be12/)
[Checkio](http://www.checkio.org/) mission.


This is an article about various sorts of algorithms which might be used
to solve the Checkio Mission "Open Labyrinth" with some interactive explanations.
You can see the result [here](http://bryukh.github.io/labyrinth-algorithms/).

## [Introduce](http://bryukh.com/labyrinth-algorithms/#introduce)

In a previous [article](http://www.checkio.org/blog/find-path/), I wrote
about solutions and algorithms for the mission "Open Labyrinth" on the CheckiO blog.
Since then, I've received many requests to learn a little more about schemas and for a more interactive explanation.
So, I've put together this more in-depth article with some visual labyrinth algorithm explanations.
You can see how BFS, DFS or A\* queue or stack and how they find a path for 
different labyrinths.

All of the examples here are based on the original ["Open Labyrinth"][open-labyrinth] mission.
In this mission, you are given the map of a maze 
and your task is to find a path from one corner to another.
The maze can be represented as a graph where empty cells are nodes and adjacent cells are connected.
Because we don't need to find the shortest path, we can use a variety of graph-traversal algorithms.

## [Maze to Graph](http://bryukh.com/labyrinth-algorithms/#maze2graph)

First I would like to change the representation of the maze.
This part is not necessary and we can detect "neighbors" while we search for a path.
But for newbies, it will be simpler to decompose the problem and first convert
a maze into a 2D array and into a graph as a dictionary.


Our graph will be represented as a dictionary, where keys are node coordinates, 
values are neighbor node coordinates and directions are how to get to it.
Node coordinates are represented as a tuple with two numbers. 
This way each cell has a unique name.
Directions will be useful to write the route when we search for a path inside the maze.

First, we collect all of the empty cells and write them as keys.
Then gather information about the neighbors. We could do this in one iteration through
a matrix with `defaultdict`, but I want to try a simpler method better suited for Python newbies.
For each cell, we only look at the "south" and "east" neighbors and add them as "connections".
And with these directions, we add the reverse "N" and "W" connection for neighboring cells.
This way we skip duplicate operations.
Don't forget to check for edge cases. 
Below you can see the simple code for it.

```python
def maze2graph(maze):
    height = len(maze)
    width = len(maze[0]) if height else 0
    graph = {(i, j): [] for j in range(width) for i in range(height) if not maze[i][j]}
    for row, col in graph.keys():
        if row < height - 1 and not maze[row + 1][col]:
            graph[(row, col)].append(("S", (row + 1, col)))
            graph[(row + 1, col)].append(("N", (row, col)))
        if col < width - 1 and not maze[row][col + 1]:
            graph[(row, col)].append(("E", (row, col + 1)))
            graph[(row, col + 1)].append(("W", (row, col)))
    return graph
```

In these animations, you can see how the recent function checks the neighbors.
But it's little difficult in a Python realization because py dictionaries are unordered.
This animation should show you how the maze changes to a "skeleton" form.

## [Breadth First Search](http://bryukh.com/labyrinth-algorithms/#bfs)

Breadth-first searching (BFS) is an algorithm for traversing or searching a path in a graph.
It starts at some arbitrary node of the graph and explores the neighboring nodes first,
before moving to the next level neighbors. For BFS we are using a queue to store the nodes which
will be exploring. This way we check the closest nodes first. 
It should look like we go level by level and before we move on to look at the next level, we should
check all nodes in the current level. For a graph search, it's very important to write all of the visited
nodes, or we can get ourselves into a loop.

BFS is optimal and is guaranteed to find the best solution that exists.
Time complexity for BFS (worst case) is O(|V|+|E|), where |V| is a number of nodes and 
|E| is a number of edges in the graph.

In Python, we can use "deque" as a queue, or even a simple list (but it's slower).
We put the initial node into the queue.
Then repeat this procedure until visiting the goal node or
visit all available nodes: take the first from the queue, check if it was visited or not,
check if it's the goal, put all neighbors at the end of the queue, repeat.
For each step, we track not only the nodes but directions and the path for the current node too.

```python
from collections import deque


def find_path_bfs(maze):
    start, goal = (1, 1), (len(maze) - 2, len(maze[0]) - 2)
    queue = deque([("", start)])
    visited = set()
    graph = maze2graph(maze)
    while queue:
        path, current = queue.popleft()
        if current == goal:
            return path
        if current in visited:
            continue
        visited.add(current)
        for direction, neighbour in graph[current]:
            queue.append((path + direction, neighbour))
    return "NO WAY!"
```

In the next animation, you can see how BFS traverse through a maze.
Numbered cells are nodes in the queue (we take with the lowest number).
Grey cells are visited. Orange cells show the resulting route. 

## [Depth First Search](http://bryukh.com/labyrinth-algorithms/#dfs)

Depth-first search (DFS) is an algorithm similar to BFS.
It starts at some arbitrary node of the graph like BFS, 
but explores as far as possible along each branch.
For a DFS non-recursive implementation, we are using a stack instead of a queue to store nodes
which will be exploring. This way we check the nodes first which were last added to the stack.

DFS is not optimal and it is not guaranteed to find the best solution.
This means DFS is not good choice to find a path in a maze, but it has other applications in 
finding connected components or maze generation.
 
The Python code for DFS has only a couple differences from BFS. We've renamed "queue" to "stack" for readability and "popleft()" to "pop()".

```python
from collections import deque


def find_path_dfs(maze):
    start, goal = (1, 1), (len(maze) - 2, len(maze[0]) - 2)
    stack = deque([("", start)])
    visited = set()
    graph = maze2graph(maze)
    while stack:
        path, current = stack.pop()
        if current == goal:
            return path
        if current in visited:
            continue
        visited.add(current)
        for direction, neighbour in graph[current]:
            stack.append((path + direction, neighbour))
    return "NO WAY!"
```

In the next animation, you can see how DFS traverse through a maze.
As we can see for the empty cell DFS works well, but not for "Snake and Short". 
Numbered cells are nodes in the queue (we take with the highest number).
Grey cells are visited. Orange cells show the resulting route.

## [A\* Search](http://bryukh.com/labyrinth-algorithms/#astar)

A\* is a widely used pathfinding algorithm and an extension of Edsger Dijkstra's 1959 algorithm.
A* uses a greedy search and finds a least-cost path
from the given initial node to one goal node out of one or more possibilities.
As A\* traverses the graph, it follows a path of the lowest expected total cost or distance,
keeping a sorted priority queue of alternate path segments along the way.
It uses a heuristic cost function of node to determine the order in which the 
search visits nodes in the graph.
For A\* we take the first node which has the lowest sum path cost and expected remaining cost.
But heuristics must be admissible, that is, it must not overestimate the distance to the goal.
The time complexity of A\* depends on the heuristic.

For Python, we can use "heapq" module for priority queuing and
add the cost part of each element.
For a maze, one of the most simple heuristics can be "Manhattan distance".

```python
from heapq import heappop, heappush


def heuristic(cell, goal):
    return abs(cell[0] - goal[0]) + abs(cell[1] - goal[1])


def find_path_astar(maze):
    start, goal = (1, 1), (len(maze) - 2, len(maze[0]) - 2)
    pr_queue = []
    heappush(pr_queue, (0 + heuristic(start, goal), 0, "", start))
    visited = set()
    graph = maze2graph(maze)
    while pr_queue:
        _, cost, path, current = heappop(pr_queue)
        if current == goal:
            return path
        if current in visited:
            continue
        visited.add(current)
        for direction, neighbour in graph[current]:
            heappush(pr_queue, (cost + heuristic(neighbour, goal), cost + 1, 
                                path + direction, neighbour))
    return "NO WAY!"
```

In this animation, you can see how A\* traverse through a maze.
As we can see, this algorithm finds the shortest path and uses fewer cells than BFS.
Numbered cells are nodes in the priority queue (as they were added, but not as will be taken).
Grey cells are visited. Orange cells show the resulting route.
