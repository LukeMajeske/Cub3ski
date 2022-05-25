from math import floor
import random

numblock_grids = []


test_grid = [5, 2, 10, 4, 2, 4, 6, 7, 2, 4, 9, 4, 6, 5, 4, 3, 4, 2, 2, 2, 10, 2, 3, 10, 1]

file = open("cub3ski_grids.txt", "w")
def find_matches(index,grid,grid_width,grid_height):
    #Return true if this number has match within the grid, if so pick a different number.
    searchIndex = index
    numberToMatch = grid[index]
    upOne = -grid_width
    direction = [-1,upOne]
    xPos = (index) % grid_width
    yPos = floor(index/grid_width)
    for dir in direction:
        matchLength = 1
        xDir = -1 if dir == -1 else 0
        yDir = -1 if dir == upOne else 0
        for x in range(0,3):
            if(xPos + xDir) < 0 or (yPos + yDir) < 0:
                #print("OUT OF BOUNDS")
                break
            if grid[searchIndex + dir] == numberToMatch:
                #print(grid[searchIndex + dir],"Index:",searchIndex)
                matchLength += 1
                searchIndex += dir
                if matchLength >= 3:
                    #print("match found!")
                    return True
    
    return False

def generate_grids(grid_width, grid_height, number_to_generate):
    file.write("{\n")
    for x in range(number_to_generate):
        grid_length = grid_width * grid_height
        grid = [0 for y in range(grid_length)]
        
        for i in range(grid_length):
            match = True
            xpos = i % 5
            ypos = floor(i/5)
            while(match):
                grid[i] = random.randrange(1,8)
                if(xpos >= 2 or ypos >= 2):
                    match = find_matches(i,grid,grid_width,grid_height)
                else:
                    match = False
        
        write_grid(grid)
    file.write("}")
    file.close()
    print("Done!")
    numblock_grids.append(grid)


def write_grid(grid):
    file.write("\t[")
    for x in range(len(grid)):
        file.write(str(grid[x]))
        if(x == len(grid)-1):
            file.write("],\n")
        else:
            file.write(",")
        

generate_grids(5,5,100)


#find_matches(19,test_grid,5,5)

