import React from 'react';
import './MeowLoader.scss';
export function MeowLoader(props) {
  return (
    <div className='meow-loader' hidden={props.hidden}>
      <img />
    </div>
  );
}
