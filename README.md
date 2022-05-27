TRUCKER

Premise =>
 You're driving to an interview for the job of your dreams. As you're envisioning how great you're going to be as the next Software Engineer at your favorite company, tragedy strikes! Your truck runs over a frog crossing the road.

The frogs have gone mad over this. They seek revenge!

Drive your truck through different levels, avoiding the larger frogs and smashing through the smaller ones.

Make it to the job interview in one piece to land your dream job!!!


As a user I want to =>
.Experience different levels featuring completely different gameplay

.Level 1: Dodge large frogs while accumulating points by hitting smaller ones. The large frogs speed up as your points go up

.Level 2: Navigate through a twisty-turny tunnel, avoiding bumping into the sides

.Level 3: Cross the flooded highway by using frogs as platforms

Technologies Used =>

HTML
CSS
Vanilla Javascript
Canvas


Logic and Obstacles =>

The majority of this game relies on objects being created, put into arrays, and then having intervals ran on the arrays. Objects are randomly deployed from an array of potential 'lanes.' An immediate obstacle was balancing how to clear the intervals, as every single item in the array had its own interval assigned to it and had to have that interval removed to clear the screen or prevent that object from moving and re-creating itself. In each level, as gold frogs are accumulated, things speed up

The hit test for the second level proved to be tricky, as I had to create multiple canvases stacked on top of each other to prevent objects from carving into others and to mess with the z-index of each canvas. I figured I could do a hit test for the water when the truck was not on a platform, but by having water cover the entire area of the platforms, that hit test always came back true and killed the player. So I had to create a bool where if the player is on any of the platforms, the bool returns true and prevents a hit test for the water. Once the player crosses a certain Y coordinate (where the water begins) and is not in contact with a platform, then a hit test on water is performed and player dies. Then the game got to the point where platforms were just randomly being generated for any of the lanes, so there would be times where one lane would get 5 platforms in a row and it was almost unplayable. So I created a second array and a boolean assigned to each array. As platforms get randomly selected, they are removed from the first array and put in the second. Once the first array is completely depleted, it becomes false and the second becomes true. The same process happens for the second array.

The third level has canvas-width rows of bricks falling down, with 'openings' on top of them. The openings are deployed from an array of 25px increments. I have a variable, 'i', that starts at 16 (so chooses the opening lane that is in the middle of the screen). After the opening is created, 'i' is randomly chosen to increment by -1, 0, or 1 the next time an opening is made. If the openings get too far left or right they are adjusted to keep them on the screen. There is a counter that goes up by one every time an opening is made. Once that counter reaches 15, a gold frog is made at the same lane value that the opening was made.
