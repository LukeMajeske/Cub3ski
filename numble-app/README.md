This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

##Documentation
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


## Structure
## Components



