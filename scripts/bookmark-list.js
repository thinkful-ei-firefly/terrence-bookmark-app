'use strict';

/* global store */

const bookmarkList = (function() {
  function generateBookmarkElement(obj) {
    const { id, title, url, rating, desc } = obj;
    const bookmark = store.findById(id);
    if (bookmark.expand) {
      return `
      <li class="js-bookmark-element" data-bookmark-id="${id}">
        <span class="bookmark-title">${title}</span>
        <span class="bookmark-rating">${rating}</span>
        <span class="bookmark-url">
        <a href="${url}">${url}</a>
        </span>
        <span class="bookmark-url">${desc}</span>
        <button class="bookmark-toggle">COLLAPSE</button>
        <button class="bookmark-delete">REMOVE</button>
      </li>`;
    } else {
      return `
      <li class="js-bookmark-element" data-bookmark-id="${id}">
        <span class="bookmark-title">${title}</span>
        <span class="bookmark-rating">${rating}</span>
        <button class="bookmark-toggle">DETAILS</button>
        <button class="bookmark-delete">REMOVE</button>
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
          <label for="title">
            Title: 
            <input type="text" name="title" id="title" required>
            </label>
          <label for="url">
            URL: 
            <input type="url" name="url" id="url" required>
          </label>
          <label for="rating">
            Rating: 
            <input type="number" name="rating" id="rating" min="1" max="5" required>
          </label>
          <label for="description">
            Description: 
            <textarea name="description" id="description" required></textarea>
          </label>
          <button type="submit">ADD</button>
          </fieldset>
      `);
    } else {
      $('form').empty();
      $('.add-new').html(`<div class="add-new">
      <button class="add-new-button">Add New Bookmark</button>
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