# Labyrinth algorithms

> Or how to find a path between two points in the maze. 
Base Algorithm review for
["Open Labyrinth"](http://www.checkio.org/mission/open-labyrinth/share/574bd1ded68c9705c5d6f07c6206be12/)
[Checkio](http://www.checkio.org/) mission.


This is an article about various algorithms 
to solve Checkio Mission "Open Labyrinth" with interactive explanations.
You can see the result [here](http://bryukh.com/labyrinth-algorithms/).

## [Introduce](http://bryukh.com/labyrinth-algorithms/#introduce)

Early I've written an [article](http://www.checkio.org/blog/find-path/)
about solutions and algorithms for mission "Open Labyrinth" for CheckiO blog.
But readers asked about more schemas and interactive explanation.
And I made this page with labyrinth algorithm explanations.
You can see how BFS, DFS or A\* queue or stack and how they find a path for 
various labyrinths.

All examples are based on original ["Open Labyrinth"][open-labyrinth] mission.
In this mission you are given the map of a maze, 
and your task is to find a path from one corner to another.
The maze can be represented as a graph where empty cells are nodes and adjacent cells are connected.
Because we don't need find the shortest path, we can use various graph-traversal algorithms.

## [Maze to Graph](http://bryukh.com/labyrinth-algorithms/#maze2graph)

First I would like to change a representation for a maze.
This part is not necessary and we can detect "neighbours" while search path.
But for newbies it will be simpler to decompose the problem and first convert
a maze as 2D array to a graph as a dictionary.


Our graph will be represented as a dictionary, where keys are node coordinates and
values are neighbour node coordinates and direction how to get in it.
Node coordinates are represented as a tuple with two numbers. 
This way each cell has unique name.
Directions will be useful to write route when we will search a path inside the maze.

First we collect all empty cells and write them as a keys.
Then gather information about neighbours. Of course we can do this in one iteration through
a matrix with defaultdict, for example, but I want to show it with simpler for python newbie way.
For each cell we look ar "south" and "east" neighbours only and add them as "connections".
And with these "S" and "E" directions we add reverse "N" and "W" connection for neighbour cells.
This way we will skip duplicate operations.
Don't forget to check edge cases. And as result we will get our maze to graph convertor.
Below you can see simple code for it.

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

In these animation you can see how the recent function check neighbours.
But it's little difficult from Python realisation because py dictionary are unordered.
But this animation should show you how maze change to "skeleton" form.

## [Breadth First Search](http://bryukh.com/labyrinth-algorithms/#bfs)

Breadth-first search (BFS) is an algorithm for traversing or searching a path in a graph.
It starts at some arbitrary node of the graph and explores the neighbor nodes first,
before moving to the next level neighbors. For BFS we are using queue to store nodes which
will be exploring. This way we check the nearest nodes first. 
For tree it looks like we look level by level and before "to down" at the next level we should
check all nodes in current level. For graph search it's very important to write all visited
nodes or we can get to a loop.

BFS is an optimal and it is guaranteed to find the best solution that exists.
Time complexity for BFS (worst case) is O(|V|+|E|), where |V| is a number of nodes and 
|E| is a number of edges in the graph.

In Python we can use "deque" as queue or simple list (but it's slower).
We put the initial node to the queue.
Then repeat the next procedure until visit the goal node or
visit all available nodes: take the first from the queue, check was it visited or not,
check is it goal, put all neighbours in the end of the queue, repeat.
For each step we track not only nodes, but directions and a path to the current node too.

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

In the next animation you can see how BFS traverse through a maze.
Numbered cells are nodes in the queue (we take with the lowest number).
Grey cells are visited. Orange cells show the result route. 

## [Depth First Search](http://bryukh.com/labyrinth-algorithms/#dfs)

Depth-first search (DFS) is an algorithm similar to BFS.
It starts at some arbitrary node of the graph as BFS, 
but explores as far as possible along each branch.
For DFS non-recursive implementation we are using stack instead queue as in BFS to store nodes
which will be exploring. This way we check nodes first which were added in stack last.

DFS is not an optimal and it is not guaranteed to find the best solution that exists.
So DFS is not good choice to find a path in a maze, but it has another applications as 
finding connected components or maze generation.
 
Python code for DFS has only one difference from BFS "queue" to "stack" renaming (for readability)
and "popleft()" to "pop()".

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

In the next animation you can see how DFS traverse through a maze.
As we can see for the empty cell DFS works well, but not for "Snake and Short". 
Numbered cells are nodes in the queue (we take with the highest number).
Grey cells are visited. Orange cells show the result route.

## [A\* Search](http://bryukh.com/labyrinth-algorithms/#astar)

A\* widely used pathfinding algorithm and it's an extension of Edsger Dijkstra's 1959 algorithm.
A* uses a greedy search and finds a least-cost path
from a given initial node to one goal node (out of one or more possible goals).
As A\* traverses the graph, it follows a path of the lowest expected total cost or distance,
keeping a sorted priority queue of alternate path segments along the way.
It uses a heuristic cost function of node to determine the order in which the 
search visits nodes in the graph.
For A\* we take first node which have the lowest sum of path cost and expected remaining cost.
But heuristic must be admissible, that is, it must not overestimate the distance to the goal.
The time complexity of A\* depends on the heuristic.

For python we can use "heapq" module for priority queue and
add cost part for each element.
For maze one of the simple heuristic can be manhattan distance.

```python
from heapq import heappop, heappush


def heuristic(cell, goal):
    return abs(cell[0] - goal[0]) + abs(cell[1] - goal[1])


def find_path_astar(maze):
    start, goal = (1, 1), (len(maze) - 2, len(maze[0]) - 2)
    pr_queue = []
    heappush((0 + heuristic(start, goal), "", start))
    visited = set()
    graph = maze2graph(maze)
    while pr_queue:
        cost, path, current = heappop(pr_queue)
        if current == goal:
            return path
        if current in visited:
            continue
        visited.add(current)
        for direction, neighbour in graph[current]:
            heappush((cost + heuristic(neighbour, goal), path + direction, neighbour))
    return "NO WAY!"
```

In the next animation you can see how A\* traverse through a maze.
As we can see this algorithm find the shortest path and expand less cells than BFS.
Numbered cells are nodes in the priority queue (as they was added, but not as will taken).
Grey cells are visited. Orange cells show the result route.