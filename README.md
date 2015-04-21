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
Time complexity for BFS is O(|V|+|E|), where |V| is a number of nodes and 
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

In the next animation you can see how BFS traverse throught a maze.
Numbered cells are nodes in the queue (we take with the lowest number).
Grey cells are visited. Orange cells show the result route. 

## [Depth First Search](http://bryukh.com/labyrinth-algorithms/#dfs)

## [A\* Search](http://bryukh.com/labyrinth-algorithms/#astar)



Hi, CiO friends!

Today, let's try to find a path between two points in the maze. 
We will take a closer look at the ["Open Labyrinth"][open-labyrinth] mission.
In this mission you are given the map of a maze, and your task is to find a path from one corner to another.
The maze can be represented as a graph where empty cells are nodes and adjacent cells are connected.
Because we don't need find the shortest path, we can use various graph-traversal algorithms.
So let's see what algorithms the CheckiO community came up with. 

> "So, the Labyrinth is a piece of cake, is it? Well, let's see how you deal with this little slice..."
 
## Breadth(Depth)-First Search

[Breadth-first_search](http://en.wikipedia.org/wiki/Graph_traversal#Breadth-first_search)
and [Depth-first_search](http://en.wikipedia.org/wiki/Graph_traversal#Depth-first_search)
are similar to each other.
DFS visits the child nodes before visiting the sibling nodes;
that is, it traverses the depth of any particular path before exploring its breadth.
BFS visits the parent nodes before visiting the child nodes.
A stack is used for DFS and a queue for BFS. So you can easily "switch" DFS to BFS.

[@spoty's][spoty] solution ["BFS + deque"][bfs-spoty] is a classical BFS realisation, using a double ended queue. It's faster than using a list and also we can easily switch BFS to DFS by simply replacing "q.popleft()" => "q.popright()".

```
from collections import deque
​
​
def checkio(maze_map, start=(1, 1), goal=(10, 10)):
    def get_adjacent(n):
        x, y = n
        n = [(x - 1, y, "N"), (x, y - 1, "W"),
             (x + 1, y, "S"), (x, y + 1, "E")]
        return [((x, y), c) for x, y, c in n if maze_map[x][y] != 1]
​
    q, v = deque([(start, "")]), set()
​
    while q:
        cords, path = q.popleft()
        if cords == goal:
            return path + mark
        if cords in v:
            continue
        v.add(cords)
        for pos, mark in get_adjacent(cords):
            if pos in v:
                continue
            else:
                q.append((pos, path + mark))
```

> Sarah: "You don't by any chance know the way through this labyrinth, do you?"

> The Worm: "Who, me? No, I'm just a worm. Say, come inside, and meet the missus"

## A\* search algorithm

As A\* traverses the graph, it follows a path of the lowest expected total cost or distance,
keeping a sorted priority queue of alternate path segments along the way.
You can read more on [Wikipedia](http://en.wikipedia.org/wiki/A*_search_algorithm).

For priority queuing, Python has the _heapq_ module and [@PositronicLlama's][PositronicLlama] solution
["First"][first-PositronicLlama] takes advantage of it combined with _namedtuples_ to add readabilty here.

```
"""
Navigate a maze and return a route from the start to the finish.
Use A* to find a path in an efficient manner.
"""
import heapq
import collections
​
# The cardinal directions
DIRECTIONS = [
        (0, -1, 'N'),
        (0, 1, 'S'),
        (-1, 0, 'W'),
        (1, 0, 'E'),
    ]
​
Node = collections.namedtuple('Node', ['hist', 'ix', 'dist', 'pt', 'prev', 'direction'])
​
def heuristic(point, goal):
    """
    Return an admissible heuristic for the distance from point to goal.
    For the case of a grid with orthogonal movement, use the Manhattan distance.
    """
    return abs(point[0] - goal[0]) + abs(point[1] - goal[1])
​
def checkio(labyrinth):
    """
    Return a string of the characters [NSEW] describing a path through labyrinth.
    labyrinth: A list of lists.  '0' indicates a passable cell.
    """
    height, width = len(labyrinth), len(labyrinth[0])
    start = (1, 1)
    goal = (height - 2, width - 2)
    
    # Each node consists of (estimated path distance, ix, dist, (x, y), previous node, direction)
    # The ix field is a serial number to ensure that subsequent fields are
    # not compared.
    open = [Node(heuristic(start, goal), 0, 0, start, None, None)]
    
    # A set of all visited coordinates.
    explored = set()
    
    ix = 1
    while open:
        node = heapq.heappop(open)
        _, _, dist, point, prev, prev_d = node
        if point in explored:
            continue
        if point == goal:
            break
        explored.add(point)
        
        # Now consider moves in each direction.
        for dx, dy, d in DIRECTIONS:
            new_point = point[0] + dx, point[1] + dy
            if new_point not in explored and \
            not labyrinth[new_point[1]][new_point[0]]:
                h = dist + 1 + heuristic(new_point, goal)
                tie_break = 4 if prev_d != d else 0 # Prefer moving straight
                new_node = Node(h, ix + tie_break, dist + 1, new_point, node, d)
                heapq.heappush(open, new_node)
                ix = ix + 1
​
    # Return a path to node
    result = ''
    while node.prev is not None:
        result = node.direction + result
        node = node.prev
    return result
```

And look at ["Re-useable code'][macfreek-re-useable-code] by [@macfreek][macfreek].

> Sarah: That's not fair!

> Jareth: You say that so often, I wonder what your basis for comparison is?
