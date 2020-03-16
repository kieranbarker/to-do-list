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

    // If there's a list ID, show that list
    if (props.listID !== null && props.listID !== undefined) {
      return getItemsTemplate(props);
    }

    // Otherwise, show all lists
    return getListsTemplate(props);

  }

  /**
   * Get the template for the items view
   * @param {Object} props The state data
   */
  function getItemsTemplate (props) {

    // Get the active list
    var index = getParams().list;
    var list = props.lists[index];

    // The "add items" form
    var form =
      "<form id='add-items'>" +
        "<label for='new-item'>What do you want to do?</label>" +
        "<div class='flex'>" +
          "<input id='new-item' type='text' autofocus>" +
          "<button type='submit'>Add Item</button>" +
        "</div>" +
      "</form>";

    // If there are no items, ask the user to add some
    if (list.items.length < 1) {
      return form + "<p>You haven't added any list items. Add some using the form above.</p>";
    }

    // Otherwise, show the list items
    return form + "<ul>" + list.items.map(function(item, index) {

      var inputID = "item-" + index;

      return (
        "<li>" +
          "<input id='" + inputID + "' type='checkbox'>" +
          "<label for='" + inputID + "'>" + item.name + "</label>" +
          "<button class='pa0 bn bg-transparent' type='button' aria-label='Edit' data-edit='" + index + "'>✏️</button>" +
          "<button class='pa0 bn bg-transparent' type='button' aria-label='Delete' data-delete-item='" + index + "'>🗑</button>" +
        "</li>"
      );

    }).join("") + "</ul>";

  }

  /**
   * Get the template for the lists view
   * @param {Object} props The state data
   */
  function getListsTemplate (props) {

    // The "add lists" form
    var form =
      "<form id='add-lists'>" +
        "<label for='new-list'>Create a new to-do list</label>" +
          "<div class='flex'>" +
            "<input id='new-list' type='text' autofocus>" +
            "<button type='submit'>Create List</button>" +
          "</div>" +
      "</form>";

    // If there are no lists, ask the user to add some
    if (props.lists.length < 1) {
      return form + "<p>You haven't created any lists. Add some using the form above.</p>";
    }

    // Otherwise, show the lists
    return form + "<ul>" + props.lists.map(function(list, index) {

      return (
        "<li>" +
          "<a href='?list=" + index + "'>" + list.name + "</a>" +
          "<button class='pa0 bn bg-transparent' type='button' aria-label='Edit' data-edit='" + index + "'>✏️</button>" +
          "<button class='pa0 bn bg-transparent' type='button' aria-label='Delete' data-delete-list='" + index + "'>🗑</button>" +
        "</li>"
      );

    }).join("") + "</ul>";

  }

  /**
   * Add a new list item or list
   * @param {Object} event The Event interface
   */
  function addItemOrList (event) {

    // Prevent the default submission behaviour
    event.preventDefault();

    // Get the input for this form
    var input = event.target.querySelector("input");

    // Do nothing if the input is empty
    if (!input.value.trim()) return;

    // Get an immutable clone of the current state
    var data = app.getData();

    if (event.target.id === "add-items") {
      // Add the list item to the list
      data.lists[data.listID].items.push({
        name: input.value,
      done: false
    });
    } else if (event.target.id === "add-lists") {
      // Add the list to the data
      data.lists.push({
        name: input.value,
        items: []
      });
    }

    // Update the state and render the UI
    app.setData(data.lists);

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
    data.lists[data.listID].items[index].done = event.target.checked;
    app.setData({ lists: data.lists });

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
    var data = saved ? JSON.parse(saved) : {};

    // Update the state and run an initial render
    app.setData(data);

  }


  //
  // Init
  //

  // Render the initial UI
  loadItems();

  // Add list items
  app.elem.addEventListener("submit", addItemOrList);

  // Toggle list items' completion status
  app.elem.addEventListener("change", toggleItem);

  // Delete list items
  app.elem.addEventListener("click", deleteItem);

  // Save list items
  app.elem.addEventListener("render", saveItems);

})();