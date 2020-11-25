/* Code for JS Library Icy */

/* icy.js */
"use strict";
console.log("----------");
console.log("SCRIPT: Creating and loading our JS libraries");

// Create an object constructor and add to its prototype

function IcyGenerator(slide, collide) {
  // Here should contain all the variables that each Icy elements should have a unique instance of
  // POTENTIALLY IN THE FUTURE, Icy elements from the same instance could be stored in an array to allow elements from that array to collide with each other
  this.icies = [];
  // indicates whether sliding and collision is enabled for Icy Elements generated from this function. Will probably move this property to be associated with individual Icy elements in the future
  this.slide = slide && slide == "slide" ? true : false;
  this.collide = collide && collide == "collide" ? true : false;

  this.stylePositions = []; // This should be a n by 2 array, each index containing an array of two values representing the on-screen location of the DOM this IcyElements is associated with
}

// Here we will implement all the functionalities for IcyGenerator
IcyGenerator.prototype = {
  makeIcy: function (shape) {
      
    // Mouse functions
    // Arrow functions do not count as a scope
    const mousedown = (e) => {
      e = e || window.event;
      e.preventDefault();

      // Variables for position of the cursor; remember e is an instance of MouseEvent
      let cursorX = e.clientX;
      let cursorY = e.clientY;

      let changeX = 0;
      let changeY = 0;

      // Function is called when the cursor moves
      // Find the change in cursor position
      const mousemove = (e) => {
        e = e || window.event;
        e.preventDefault();

        changeX = cursorX - e.clientX;
        changeY = cursorY - e.clientY;

        // Get the bounds of the element (the function returns the smallest rectangle which contains the entire element)
        const bounds = icy.getBoundingClientRect();

        // For some reason both values must be subtracted by 10??? I dont understand why. If a TA sees this, please comment
        icy.style.left = `${bounds.left - changeX - 10}px`;
        icy.style.top = `${bounds.top - changeY - 10}px`;

        // Update cursor positions
        cursorX = e.clientX;
        cursorY = e.clientY;
      }

      const mouseup = () => {
        // When sliding is enabled, do a timer-based sliding movement
        // TODO: Refine the sliding
        const bounds = icy.getBoundingClientRect(); // For some reason bounds are always 10 more than the element's styles
        if (this.slide) {
          log("left: " + icy.style.left + " " + bounds.left);
          log("top: " + icy.style.top + " " + bounds.top);
          for (let i = 1; i <= 50; i++) {
            // Possibly make 50 a slideDistance variable?
            setTimeout(function () {
              log("sliding");
              if (i <= 20) {
                icy.style.left = `${bounds.left - 10 - changeX * i * 0.3}px`;
                icy.style.top = `${bounds.top - 10 - changeY * i * 0.3}px`;
              } else {
                // Sliding slows down
                icy.style.left = `${bounds.left - 10 - changeX * 20 * 0.3 - changeX * (i - 20) * 0.1}px`;
                icy.style.top = `${bounds.top - 10 - changeY * 20 * 0.3 - changeY * (i - 20) * 0.1}px`;
              }
            }, 15 * i);
          }
        }
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);

        // If the DOM element is not in the viewport, then remove it.
        if (bounds.left - 10 < 0 || bounds.top - 10 < 0) {
          log("removing icy element");
          this.icies.splice(this.icies.indexOf(icy),1)
          $(icy).remove();
        }
      }

      // Adding EventListener on the window since we can't assume the mouse is always in the view window.
      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);
    };

    const icy = document.createElement("div");
    // The shape of the Icy element depends on the shape parameter
    // Currently only Circle and Rectangles are supported
    icy.style =
      "width: 60px; height: 60px; margin: 10px; background-color: Aqua; cursor: move; position: absolute;";
    if (shape == "circle") {
      icy.style.borderRadius = "50%";
    } else {
      icy.style.borderRadius = "0";
    }

    // if (sliding == "sliding") {
    //     sliEnabled = true
    // }

    // if (collision == "collision") {
    //     colEnabled = true
    // }

    // Three events must be taken care of: mouseover, mouseup, mousedown
    icy.addEventListener("mousedown", mousedown);

    const body = $("body"); // jQuery equivalent to: const body = document.querySelector('body')
    body.append(icy);

    this.icies.push(icy); // add to the icies list
  },

  // Set sliding attribute
  setSlide: function (slide) {
    this.slide = slide;
  },

  // Set colliding attribute
  setCollide: function (collide) {
    this.collide = collide;
  },
};
