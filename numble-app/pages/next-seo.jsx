import {NextSeo} from 'next-seo';

const Page = () => (
    <>
      <NextSeo
        title="Cub3Ski"
        description="A fun number matching game!"
        openGraph={{
          url: 'https://www.cub3ski.com/',
          title: 'Cub3Ski - A fun number matching game!',
          description: 'Use your math skills to score the most points possible!',
          site_name: 'Cub3Ski',
        }}
      />
    </>
  );
  
  export default Page;