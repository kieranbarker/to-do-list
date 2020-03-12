;(function () {

  "use strict";

  //
  // Variables
  //

  // Get the form and input elements
  var form = document.querySelector("#add-todos");
  var input = form.querySelector("#new-todo");

  // Create a Reef instance for the component
  var app = new Reef(document.querySelector("#app"), {
    data: { listItems: [] },
    template: template
  });


  //
  // Functions
  //

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


  //
  // Init
  //

  // Render the component
  app.render();

  // Add list items
  form.addEventListener("submit", addItem);

  // Toggle list items' completion status
  app.elem.addEventListener("change", toggleItem);

  // Delete list items
  app.elem.addEventListener("click", deleteItem);

})();