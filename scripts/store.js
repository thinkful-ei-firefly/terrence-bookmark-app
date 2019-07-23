'use strict';

const store = (function() {
  const setError = function(error) {
    this.error = error;
  };

  const addBookmark = function(bookmark) {
    const expand = { expand: false };
    Object.assign(bookmark, expand);
    this.bookmarks.push(bookmark);
  };

  const findById = function(id) {
    return this.bookmarks.find(bookmark => bookmark.id === id);
  };

  const findAndDelete = function(id) {
    return (this.bookmarks = this.bookmarks.filter(
      bookmark => bookmark.id !== id
    ));
  };

  const filterByRating = function(rating) {
    return this.bookmarks.filter(bookmark => bookmark.rating >= rating);
  };

  return {
    bookmarks: [],
    adding: false,
    showError: false,
    filterRating: 1,

    setError,
    addBookmark,
    findById,
    findAndDelete,
    filterByRating
  };
})();