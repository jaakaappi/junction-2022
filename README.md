# NEBILA
**Ne**w **B**usiness **I**nteractive **L**ocation **A**nalytics

<br>

Location is an important factor that can make or break the success of a
business. NEBILA helps the business owners to evaluate potential locations by
visualizing relevant geospatial data in an easily digestible form. Some of the
features include:

- Highlighting the distance from which the potential location can be reached
  within X minutes by using different travelling methods (e.g.
  walking/cycling/public transit/car)
- Size of the potential customer base around the location
- The potential services and competitors nearby
- Walking distance to the nearest city bike station

A custom algorithm is used to calculate the scores for individual categories.
These category scores are combined to an overall score, which the user can use
to compare different locations and discover the most lucrative one.

Potential future directions for this project include expanding the data sets to
include more business categories for better evaluation of competitors and
supporting services. One interesting approach would be to incorporate also
traffic flow into the app.

On the technical side, the app backend can be a bit slow with its responses,
especially when the geo-areas are large. The responsiveness can be improved by
paralleling and caching most used computations using smarter data structures for
intersection calculations, like quad trees. Easiest approach to accomplish this
is to move most of the datasets into a PostGIS database and do intersect
calculations there.

The client code can be found [here](https://github.com/ootsamo/junction-2022-client).

![IMG_0005](https://user-images.githubusercontent.com/1549989/200160379-a933a426-13df-4636-a976-20093ac6043a.PNG)
![IMG_0006](https://user-images.githubusercontent.com/1549989/200160426-b00ebe90-09b9-4574-a122-dbe6adfe13ac.jpg)
![IMG_0007](https://user-images.githubusercontent.com/1549989/200160429-86864fb7-d62c-4da1-b2aa-fbe7055db6c2.PNG)
![IMG_F8FB087D5F68-1](https://user-images.githubusercontent.com/1549989/200160436-b645914f-b3bc-46b7-9bbe-4d306c026c2b.jpeg)





