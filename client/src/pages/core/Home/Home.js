import React from 'react';
import Typewriter from 'typewriter-effect';

import HomeDisplay from '../../../components/displays/HomeDisplay/HomeDisplay';
import CategoryDisplay from '../../../components/displays/CategoryDisplay/CategoryDisplay';

import './Home.css';

const Home = () => {
  return (
    <>
      <div className="jumbotron text-center text-primary h1 font-weight-bold m-0">
        Check Out Our
        <Typewriter
          options={{
            strings: ['New Arrivals', 'Best Sellers', 'Popular Products'],
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
      <HomeDisplay
        name="Popular Products"
        sort="averageRating"
        order="1"
        limit={3}
      />
      <CategoryDisplay name="Categories" />
      <CategoryDisplay name="Subcategories" />
    </>
  );
};

export default Home;
