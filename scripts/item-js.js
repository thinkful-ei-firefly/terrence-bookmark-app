'use strict';
/* global cuid */

// eslint-disable-next-line no-unused-vars
const Item = (function(){

  const create = function(title,description,rating) {
    return {
      id: cuid(),
      title,
      description,
      rating,
      expanded: false
    };
  };

  return {
    create
  };
  
}());