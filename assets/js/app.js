;(function () {

  "use strict";

  //
  // Variables
  //

  // The Reef instance for the component
  var app = new Reef("#app", {
    data: { listItems: [] },
    template: template
  });


  //
  // Functions
  //

  /**
   * Return the markup for the UI based on the current state
   * @param {Object} props The state data
   */
  function template (props) {

    // If there are no list items, show a message
    if (props.listItems.length < 1) {
      return "<p>You haven't added any list items yet. Why not start now?</p>";
    }

  }


  //
  // Init
  //

  // Log the Reef instance to the console
  console.log(app);

  // Render the component
  app.render();

})();