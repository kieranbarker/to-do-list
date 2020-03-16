;(function () {

  "use strict";

  //
  // Variables
  //

  // Create a Reef instance for the component
  var app = new Reef(document.querySelector("#app"), {
    data: { listItems: [] },
    template: template
  });

  // The ID to use with localStorage
  var storageID = "todos";


  //
  // Functions
  //

  /**
   * Get the URL parameters
   * source: https://css-tricks.com/snippets/javascript/get-url-variables/
   * @param  {String} url The URL
   * @return {Object}     The URL parameters
   */
  function getParams (url) {

    var params = {};
    var parser = document.createElement("a");

    parser.href = url ? url : window.location.href;

    var query = parser.search.substring(1);
    var vars = query.split("&");

    if (vars.length < 1 || vars[0].length < 1) return params;

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }

    return params;

  }

  /**
   * Return the markup for the UI based on the current state
   * @param  {Object} props The state data
   * @return {String}       An HTML string
   */
  function template (props) {

    // If there are no list items, show a message
    if (props.listItems.length < 1) {
      return "<p>You haven't added any list items yet. Why not start now?</p>";
    }

    // Otherwise, show the list items
    return "<ul>" + props.listItems.map(buildListItem).join("") + "</ul>";

  }

  /**
   * Build an HTML string for a list item
   * @param  {String}      item  The list item
   * @param  {Number}      index The item's index in the array
   * @return {String}            An HTML string
   */
  function buildListItem (item, index) {

    // The ID for the input
    var inputID = "item-" + index;

    // Return an HTML string for the list item
    return (
      "<li>" +
        "<input id='" + inputID + "' type='checkbox'" + (item.done ? " checked" : "") + ">" +
        "<label for='" + inputID + "'>" + item.description + "</label>" +
        "<button type='button' aria-label='Delete' data-delete='" + index + "'>🗑</button>" +
      "</li>"
    );

  }

  /**
   * Add a new list item
   * @param {Object} event The Event interface
   */
  function addItem (event) {

    // Prevent the default submission behaviour
    event.preventDefault();

    // Do nothing if the input is empty
    if (!input.value.trim()) return;

    // Get an immutable clone of the current state
    var data = app.getData();

    // Add the list item to the data
    data.listItems.push({
      description: input.value,
      done: false
    });

    // Update the state and render the UI
    app.setData({ listItems: data.listItems });

    // Clear the input and return focus to it
    input.value = "";
    input.focus();

  }

  /**
   * Toggle a list item's completion status
   * @param {Object} event The Event interface
   */
  function toggleItem (event) {

    // Get an immutable clone of the current state
    var data = app.getData();

    // Get the index of the toggled list item
    var index = event.target.id.slice(-1);

    // Update the state and render the UI
    data.listItems[index].done = event.target.checked;
    app.setData({ listItems: data.listItems });

  }

  /**
   * Delete an old list item
   * @param {Object} event The Event interface
   */
  function deleteItem (event) {

    // Get the index of the item to be removed
    var index = event.target.getAttribute("data-delete");
    if (!index) return;

    // Get an immutable clone of the current state
    var data = app.getData();

    // Confirm with the user before deleting
    if (!confirm("Are you sure you want to delete this item? This cannot be reversed.")) return;

    // Remove this list item from the data
    data.listItems.splice(index, 1);

    // Update the state and render the UI
    app.setData({ listItems: data.listItems });

  }

  /**
   * Save the current state of the app to localStorage
   */
  function saveItems () {
    localStorage.setItem(storageID, JSON.stringify(app.getData()));
  }

  /**
   * Render saved list items when the page loads
   */
  function loadItems () {

    // Check for saved data in localStorage
    var saved = localStorage.getItem(storageID);
    var data = saved ? JSON.parse(saved) : { listItems: [] };

    // Update the state and run an initial render
    app.setData(data);

  }


  //
  // Init
  //

  // Render the initial UI
  loadItems();

  // Add list items
  app.elem.addEventListener("submit", addItem);

  // Toggle list items' completion status
  app.elem.addEventListener("change", toggleItem);

  // Delete list items
  app.elem.addEventListener("click", deleteItem);

  // Save list items
  app.elem.addEventListener("render", saveItems);

})();