'use strict';

/* global store,$,api */

const bookmarkList = (function() {
  function generateBookmarkElement(obj) {
    const { id, title, url, rating, desc } = obj;
    const bookmark = store.findById(id);
    if (bookmark.expand) {
      return `
      <li class="js-bookmark-element" data-bookmark-id="${id}">
        <span class="bookmark-title">${title}</span>
        <span class="bookmark-rating">Rating: ${rating} of 5</span>
        <span class="bookmark-url">
        <a href="${url}">Visit Site</a>
        </span>
        <span class="bookmark-url">${desc}</span>
        <button class="bookmark-toggle">COLLAPSE</button>
        <button class="bookmark-delete">Delete</button>
      </li>`;
    } else {
      return `
      <li class="js-bookmark-element" data-bookmark-id="${id}">
        <span class="bookmark-title">${title}</span>
        <span class="bookmark-rating">Rating: ${rating} of 5</span>
        <button class="bookmark-toggle">DETAILS</button>
        <button class="bookmark-delete">Delete</button>
      </li>`;
    }
  }

  function generateBookmarksString(bookmarksList) {
    const bookmarks = bookmarksList.map(bookmark =>
      generateBookmarkElement(bookmark)
    );
    return bookmarks.join('');
  }

  function render() {
    const bookmarks = store.filterByRating(store.filterRating);
    const bookmarksString = generateBookmarksString(bookmarks);
    if (store.adding) {
      $('.add-new').empty();
      $('form').html(`
        <fieldset>
          <legend>Add A New Bookmark</legend>
          <div>
          <label for='title'> Title:</label>            
            <input type='text' name='title' id='title' required>
          </div>
          <div>
          <label for='url'> URL:</label>            
            <input type='url' name='url' id='url' required>
          </div>
          <div>
          <label for="rating"> Rating:</label>            
            <input type='number' name='rating' id='rating' min='1' max='5' required>
          </div>
          <div>
          <label for='description'> Description: </label>            
            <textarea name='description' id='description' required></textarea>
         </div>
         <div> <button class='add-new-button' type='submit'>ADD</button></div>
          </fieldset>
      `);
    } else {
      $('form').empty();
      $('.add-new').html(`<div class='add-new'>
      <button class='add-new-button'>Add New Bookmark</button>
    </div>`);
    }
    $('.js-bookmark-list').html(bookmarksString);
  }

  function handleAddNewBookmarkClick() {
    $('.add-new').on('click', '.add-new-button', () => {
      store.adding = !store.adding;
      render();
    });
  }

  function handleNewBookmarkSubmit() {
    $('form').submit(event => {
      event.preventDefault();
      const title = $(event.currentTarget)
        .find('input[id="title"]')
        .val();
      const url = $(event.currentTarget)
        .find('input[id="url"]')
        .val();
      const rating = $(event.currentTarget)
        .find('input[id="rating"]')
        .val();
      const desc = $(event.currentTarget)
        .find('textarea')
        .val();
      const newBookmark = { title, url, rating, desc };
      $('form')
        .find('input, textarea')
        .val('');
      store.adding = !store.adding;
      api.createBookmark(newBookmark).then(bookmark => {
        store.addBookmark(bookmark);
        render();
      });
    });
  }

  function getBookmarkIdFromElement(element) {
    return $(element)
      .closest('li')
      .data('bookmark-id');
  }

  function handleBookmarkDetailClick() {
    $('ul').on('click', '.bookmark-toggle', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      const bookmark = store.findById(id);
      bookmark.expand = !bookmark.expand;
      render();
    });
  }

  function handleRemoveBookmarkClick() {
    $('ul').on('click', '.bookmark-delete', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      api.deleteBookmark(id).then(() => {
        store.findAndDelete(id);
        render();
      });
    });
  }

  function handleFilterByRating() {
    $('#filter').change(() => {
      const rating = $(event.currentTarget).val();
      store.filterRating = rating;
      render();
    });
  }

  function bindEventListeners() {
    handleAddNewBookmarkClick();
    handleNewBookmarkSubmit();
    handleBookmarkDetailClick();
    handleRemoveBookmarkClick();
    handleFilterByRating();
  }

  return {
    render,
    bindEventListeners
  };
})();