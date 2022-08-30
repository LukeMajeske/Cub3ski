## Documentation
Cub3Ski is a tile matching game where players use basic math skills to match 3 or more of the same number in a row.

NextJS, a framework built on top of ReactJS, was chosen for this project for it's support for Server Side Rendering (SSR). SSR allows for faster load times for the user and allows for search engines to index and crawl content for better SEO performance.

This project is deployed to AWS Amplify. Amplify was chosen for it's ability to setup a simple backend environment. In this environment, a DynamoDB database is used to track Highscores for the game. 

## Dependencies
### Sound
Cub3Ski uses a variety of sounds during user interaction, adding an element of fun and to confirm certian events have occured correctly(ex. playing a sound when unmuting the game).

Different sounds will play during the following events:
-Selecting a cube
-Deselecting a cube
-After player swaps the position of two cubes
-After player completes a match
-Muting and unmuting the game


The dependency [use-sound](https://github.com/joshwcomeau/use-sound) allows audio to be prepared and played using a React Hook. This hook utilizes HowlerJS, a powerful audio library for playing and manipulating sounds in a web browser.


```
    const[playSound,sound] = useSound(soundSpriteMap,
        {volume:0.25,
        playbackRate:playbackRate,
        soundEnabled:soundEnable,
        sprite:spriteMap,interrupt:true
    });
```


### Icons

The dependency [react-icons](https://react-icons.github.io/react-icons/) is used to easily include icons.



### Animations

The dependency [react-spring](https://react-spring.dev/) is a spring-physics based animation library that is used to animate the cubes.

### Detecting User Device Screen Size

The dependency [react-responsive](https://github.com/yocontra/react-responsive) provides a React Hook to perform media queries. This is important for performing animations on mobile screens since cubes will travel a shorter distance than they would on a desktop screen. 

## Structure

![image](https://user-images.githubusercontent.com/29846872/187545757-633c4417-aa61-4864-97ad-583e762d3aa9.png)

## Components



