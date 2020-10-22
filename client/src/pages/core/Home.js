import React from 'react';
import Typewriter from 'typewriter-effect';

import HomeDisplay from '../../components/displays/HomeDisplay';

const Home = () => {
  return (
    <>
      <div className="jumbotron text-center text-danger h1 font-weight-bold">
        Check Out Our
        <Typewriter
          options={{
            strings: ['New Arrivals', 'Best Sellers', 'Recently Updated'],
            autoStart: true,
            loop: true
          }}
        />
      </div>
      <HomeDisplay
        name="New Arrivals"
        sort="createdAt"
        order="desc"
        limit={3}
      />
      <HomeDisplay name="Best Sellers" sort="sold" order="desc" limit={3} />
    </>
  );
};

export default Home;
