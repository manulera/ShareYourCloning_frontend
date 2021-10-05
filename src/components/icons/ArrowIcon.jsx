import React from 'react';

function ArrowIcon({ direction }) {
  let rotatingPath = null;

  if (direction === 'left') {
    rotatingPath = (
      <path
        id="Path_2"
        data-name="Path 2"
        d="M13,7V1L24,12,13,23V17H0V7Z"
        transform="translate(24 23) rotate(180)"
        fill="#fff"
      />
    );
  } else if (direction === 'right') {
    rotatingPath = <path d="M13 7v-6l11 11-11 11v-6h-13v-10z" />;
  }

  return (
    <span className="bp3-icon">
      <svg
        className="bp3-icon"
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="16px"
        height="16px"
        viewBox="0 0 24 24"
      >

        {rotatingPath}
      </svg>
    </span>
  );
}

export default ArrowIcon;
