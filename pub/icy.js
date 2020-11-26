/* Code for JS Library Icy */

/* icy.js */
"use strict";
console.log("----------");
console.log("SCRIPT: Loaded Icy JS");

let iW, iH, iX, iY, tW, tH, tX, tY

// Create an object constructor and add to its prototype

function IcyGenerator(slide, collide) {
  // Here should contain all the variables that each Icy elements should have a unique instance of
  // POTENTIALLY IN THE FUTURE, Icy elements from the same instance could be stored in an array to allow elements from that array to collide with each other
  this.icies = [];
  // indicates whether sliding and collision is enabled for Icy Elements generated from this function. Will probably move this property to be associated with individual Icy elements in the future
  this.slide = (slide && slide == "slide") ? true : false;
  this.collide = (collide && collide == "collide") ? true : false;
  this.randomTimerVel = []; // stores the [timer, xVelocity, yVelocity] for each icy element
  this.randomEnabled = false;
}

// Here we will implement all the functionalities for IcyGenerator
IcyGenerator.prototype = {

  // Creates and returns a div that represents the icy element
  makeIcy: function (shape, startPos) {

    const icy = document.createElement("div");
    // The shape of the Icy element depends on the shape parameter
    // Currently only Circle and Rectangles are supported
    icy.style =
      `width: ${(startPos) ? startPos[2] : 50}px; 
        height: ${(startPos) ? startPos[3] : 50}px; 
        left: ${(startPos) ? startPos[0] : 0}px; 
        top: ${(startPos) ? startPos[1] : 0}px;
        cursor: move; 
        position: absolute;`;
    if (shape && shape == "circle") {
      icy.style.borderRadius = "50%";
      icy.style.backgroundColor = "Gray";
    } else if (shape && shape == "rectangle") {
      icy.style.borderRadius = "0";
      icy.style.backgroundColor = "Gray";
    } else if (shape && shape == "triangle") {
      icy.style.width = "0px"
      icy.style.height = "0px"
      icy.style.borderLeft = `${(startPos) ? startPos[2] : 25}px solid transparent`
      icy.style.borderRight = `${(startPos) ? startPos[3] : 25}px solid transparent`
      icy.style.borderBottom = `${(startPos) ? (parseInt(startPos[2])+parseInt(startPos[3])) : 50}px solid gray`
    }

    // Mouse functions
    // Arrow functions do not count as a scope
    const mousedown = (e) => {
        e = e || window.event;
        e.preventDefault();
  
        // Pause all the random movements
        this.setRandomMovement(false)
  
        // Variables for position of the cursor; remember e is an instance of MouseEvent
        let cursorX = e.clientX;
        let cursorY = e.clientY;
  
        let changeX = 0;
        let changeY = 0;
  
        // Collision Detection Function
        const collisionDetection = () => {
  
          for (let i = 0; i <this.icies.length; i++) {
              iW = icy.offsetWidth
              iH = icy.offsetHeight
              iX = icy.offsetLeft
              iY = icy.offsetTop
              tW = this.icies[i].offsetWidth
              tH = this.icies[i].offsetHeight
              tX = this.icies[i].offsetLeft
              tY = this.icies[i].offsetTop
  
              //log(iW + ' ' + iH + ' ' + iX + ' ' + iY)
  
              // Rudimentary Detection Math
              // TODO: expand upon this!!!!!!!!!!!!!!!
              if ((iX+iW) > tX && iX < (tX+tW) && (iY+iH) > tY && iY < (tY+tH) && this.icies.indexOf(icy) != i) {
                  log("Collision Detected")
                  this.icies[i].style.left = `${this.icies[i].offsetLeft - changeX}px`;
                  this.icies[i].style.top = `${this.icies[i].offsetTop - changeY}px`;
              }
          }  
          
          // window.requestAnimationFrame(collisionDetection)
        }
  
        // Function is called when the cursor moves
        // Find the change in cursor position
        const mousemove = (e) => {
          e = e || window.event;
          e.preventDefault();
  
          changeX = cursorX - e.clientX;
          changeY = cursorY - e.clientY;
  
          // Get the bounds of the element (the function returns the smallest rectangle which contains the entire element)
          const bounds = icy.getBoundingClientRect();
  
          icy.style.left = `${bounds.left - changeX}px`;
          icy.style.top = `${bounds.top - changeY}px`;
  
          // Update cursor positions
          cursorX = e.clientX;
          cursorY = e.clientY;
  
          // Collision check
          if (this.collide) {
              collisionDetection();
          }
        }
  
        const mouseup = () => {
          // When sliding is enabled, do a timer-based sliding movement
          // TODO: Refine the sliding
          const bounds = icy.getBoundingClientRect(); // NOTE THAT THIS TAKES INTO CONSIDERATION OF MARGIN AND PADDING AND IS DIFFERENT FROM STYLE.___
          if (this.slide) {  
            log("sliding");
            for (let i = 1; i <= 50; i++) {
              // Possibly make 50 a slideDistance variable?
              setTimeout(() => {
                if (i <= 20) {
                  icy.style.left = `${bounds.left - changeX * i * 0.3}px`;
                  icy.style.top = `${bounds.top - changeY * i * 0.3}px`;
                } else {
                  // Sliding slows down
                  icy.style.left = `${bounds.left - changeX * 20 * 0.3 - changeX * (i - 20) * 0.1}px`;
                  icy.style.top = `${bounds.top - changeY * 20 * 0.3 - changeY * (i - 20) * 0.1}px`;
                }
                // Collision check
                if (this.collide) {
                  collisionDetection();
                }
              }, 15 * i);
            }
          }
          window.removeEventListener("mousemove", mousemove);
          window.removeEventListener("mouseup", mouseup);
  
          // If the DOM element is not in the viewport, then remove it.
          if (bounds.left < 0 || bounds.top < 0 || bounds.left > window.innerWidth || bounds.top > window.innerHeight) {
            log("removing icy element");
            this.icies.splice(this.icies.indexOf(icy),1)
            $(icy).remove();
          }
        }
  
        // Adding EventListener on the window since we can't assume the mouse is always in the view window.
        window.addEventListener("mousemove", mousemove);
        window.addEventListener("mouseup", mouseup);
      };

    // Three events must be taken care of: mouseover, mouseup, mousedown
    icy.addEventListener("mousedown", mousedown);

    const body = $("body"); // jQuery equivalent to: const body = document.querySelector('body')
    body.append(icy);

    this.icies.push(icy); // add to the icies list
    return icy
  },

  // Remove an Icy Element from the DOM and the list
  // If an icy element is not given, remove all icy elements from the DOM and the list
  removeIcy: function(icy) {
    this.setRandomMovement(false) // First, disable randomMovement's loop
    if(icy && this.icies.includes(icy)) {
        log("removing icy element")
        if (this.randomTimerVel.length === this.icies.length) {
            window.clearInterval(this.randomTimerVel[this.icies.indexOf(icy)][0])
            this.randomTimerVel.splice(this.icies.indexOf(icy),1)
        }
        this.icies.splice(this.icies.indexOf(icy),1)
        $(icy).remove();
    } else if (!icy) {
        log("removing all icy elements")
        for (let i = 0; i < this.icies.length; i++) {
            if (this.randomTimerVel.length === this.icies.length) {
                window.clearInterval(this.randomTimerVel[i][0])
            }
            $(this.icies[i].remove())
        }
        if (this.randomTimerVel.length === this.icies.length) {
            this.randomTimerVel.splice(0,this.randomTimerVel.length)
        }
        this.icies.splice(0,this.icies.length)
    }
  },

  // Enables random movement all over the screen for the given icy element, 
  //   or, if no icy element is given, all icy elements of the target icy generator
  //   such random movement is terminated by user inputing
  // This feature lends itself well for egregiously invasive ads on a website
  // No collision detection between ads for current implementation
  RandomMovement: function() {
    let xVel, yYel;
    if (this.randomEnabled) {
        for (let i = 0; i < this.icies.length; i++) {
            xVel = Math.floor(Math.random() * 3 + 1)
            yYel = Math.floor(Math.random() * 3 + 1)
            this.randomTimerVel.push([setInterval(() => {
                // If hitting top or bottom edge,
                if (this.icies[i].offsetTop < 0 || this.icies[i].offsetTop + this.icies[i].offsetHeight > window.innerHeight) {
                    log('Switching y velocity direction')
                    this.randomTimerVel[i][2] *= -1 // Switch yVelocity Direction
                }
                // If hitting left or right edge,
                if (this.icies[i].offsetLeft < 0 || this.icies[i].offsetLeft + this.icies[i].offsetWidth > window.innerWidth) {
                    log('Switching x velocity direction')
                    this.randomTimerVel[i][1] *= -1 // Switch xVelocity Direction
                }
                this.icies[i].style.left = `${this.icies[i].offsetLeft - this.randomTimerVel[i][1]}px`
                this.icies[i].style.top = `${this.icies[i].offsetTop - this.randomTimerVel[i][2]}px`
                // if (this.icies[i].offsetLeft < 0 || this.icies[i].offsetTop < 0 || (this.icies[i].offsetLeft + this.icies[i].offsetWidth) > window.innerWidth || (this.icies[i].offsetTop + this.icies[i].offsetHeight) > window.innerHeight) {
                //     log("BONK")
                //     sign = sign * -1
                //     this.icies[i].style.left = `${this.icies[i].offsetLeft - rand*5*sign}px`
                //     this.icies[i].style.top = `${this.icies[i].offsetTop - rand*5*sign}px`;
                // }
                // this.icies[i].style.left = `${this.icies[i].offsetLeft - rand*sign}px`
                // this.icies[i].style.top = `${this.icies[i].offsetTop - rand*sign}px`;
            }, 20), xVel, yYel])
        }
    } else {
        for (let i = 0; i < this.randomTimerVel.length; i++) {
            log("purging all randomMovement timers")
            window.clearInterval(this.randomTimerVel[i][0])
        }
        this.randomTimerVel.splice(0,this.randomTimerVel.length)
    }
  },

  setRandomMovement: function (random) {
    this.randomEnabled = random
    this.RandomMovement()
  },

  // Set sliding attribute
  setSlide: function (slide) {
    this.slide = slide;
  },

  // Set collide attribute
  setCollide: function (collide) {
    this.collide = collide;
  },

  // Get randomEnabled attribute
  getRandomEnabled: function () {
    return this.randomEnabled
  },

  // Get collide attribute
  getSlide: function () {
    return this.slide
  },

  // Get slide attribute
  getCollide: function () {
    return this.collide
  }
};
