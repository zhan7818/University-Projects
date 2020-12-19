/* Code for JS Library Icy */

/* icy.js */
"use strict";
console.log("----------");
console.log("SCRIPT: Loaded Icy JS");

// Create an object constructor and add to its prototype

(function (global, document, $) {
  function IcyGenerator(slide, collide, sound) {
    // Here should contain all the variables that each Icy elements should have a unique instance of
    // Icy elements from the same instance could be stored in an array to allow elements from that array to collide with each other
    this.icies = [];
    // indicates whether sliding and collision is enabled for Icy Elements generated from this function. Will probably move this property to be associated with individual Icy elements in the future
    this.slide = slide && slide == "slide" ? true : false;
    this.collide = collide && collide == "collide" ? true : false;
    this.randomTimerVel = []; // stores the [timer, xVelocity, yVelocity] for each icy element
    this.shapes = []; // stores the string representation of each shape for each corresponding icy element (eg. 'circle', 'rectangle'). Defaults to rectangle
    this.clickRedirectURL = []; // A list that stores the URLs to take the user to when they click the corresponding Icy element. Defaults to "null", which means no click actions
    this.randomEnabled = false;
    this.soundEffectClick = new Audio(); // The variable for the sound effect to play when clicked
    this.soundEffectSlide = new Audio(); // The variable for the sound effect to play when sliding
    this.soundEnabled = sound && sound == "soundEnabled" ? true : false; // Indicates whether sound effects are enabled
    this.slideSpeedCoef = 1; // Changes how far the icy elements slide
    this.slideTimeCoef = 1; // Changes how long the icy elements slide
  }

  /*=======Private properties and functions==========*/
  // unless we attach these to the global window object, they cannot be accessed directly.
  // they will only be in the closure of this function, and can be accessed only the places we use them (such as in the functions of the IcyGenerator prototype)
  let _iW,
    _iH,
    _iX,
    _iY,
    _tW,
    _tH,
    _tX,
    _tY,
    _icX,
    _icY,
    _tcX,
    _tcY,
    _iRad,
    _tRad,
    _collided; // Attributes for icy movement on window; used for collisionDetection()
  let _TotalNumOfIcies = 0; // Number of Total Icy elements currently present in the window
  let _cursorX, _cursorY, _changeX, _changeY; // Variables used for moving Icy elements
  let _originX, _originY; // Variables used for checking if the user clicked or dragged an Icy element
  let _slideInProgress = false; // Variable used to check if a sliding motion is in progress; helps prevent conflicts in movement command

  function _changeNumOfIcies(change) {
    _TotalNumOfIcies = _TotalNumOfIcies + change;
  }

  function _setCollided(collision) {
    _collided = collision;
  }
  /*=======End of private properties/functions=======*/

  // Here we will implement all the functionalities for IcyGenerator
  IcyGenerator.prototype = {
    // Creates and returns a div that represents the icy element
    // shape: shape of the icy element, either circle or rectangle
    // startPos: starting position of the icy element on the window
    // clickURL: url for the sound effect when clicked
    // slideURL: url for the sound effect when sliding
    // redirectURL: url for the webpage to redirect the user to when they click the Icy element
    makeIcy: function (shape, startPos, clickURL, slideURL, redirectURL) {
      const icy = document.createElement("div");
      // The shape of the Icy element depends on the shape parameter
      // Currently only Circle and Rectangles are supported
      icy.style = `width: ${startPos ? startPos[2] : 50}px; 
          height: ${startPos ? startPos[3] : 50}px; 
          left: ${startPos ? startPos[0] : 0}px; 
          top: ${startPos ? startPos[1] : 0}px;
          cursor: move; 
          position: absolute;`;
      if (shape && shape == "circle") {
        icy.style.borderRadius = "50%";
        icy.style.backgroundColor = "Gray";
      } else if (shape && shape == "rectangle") {
        icy.style.borderRadius = "0";
        icy.style.backgroundColor = "Gray";
      } else {
        // Default
        icy.style.backgroundColor = "Gray";
      }

      // Check if clickURL is provided
      if (clickURL) {
        this.soundEffectClick.src = clickURL;
      }

      // Check if slideURL is provided
      if (slideURL) {
        this.soundEffectSlide.src = slideURL;
      }

      // Mouse functions
      // Arrow functions do not count as a scope
      const mousedown = (e) => {
        e = e || window.event;
        e.preventDefault();

        // Pause all the random movements
        this.setRandomMovement(false);

        // If soundEnabled is true, play the sound effect
        if (this.soundEnabled && this.soundEffectClick.src != "") {
          log("playing sound effect for clicking");
          this.soundEffectClick.play();
        }

        // Record original X and Y position
        _originX = e.clientX;
        _originY = e.clientY;

        // Variables for position of the cursor; remember e is an instance of MouseEvent
        _cursorX = e.clientX;
        _cursorY = e.clientY;

        _changeX = 0;
        _changeY = 0;

        // Collision Detection Function
        const collisionDetection = () => {
          for (let i = 0; i < this.icies.length; i++) {
            _setCollided(false); // Reset _collided

            _iW = icy.offsetWidth;
            _iH = icy.offsetHeight;
            _iX = icy.offsetLeft;
            _iY = icy.offsetTop;
            _tW = this.icies[i].offsetWidth;
            _tH = this.icies[i].offsetHeight;
            _tX = this.icies[i].offsetLeft;
            _tY = this.icies[i].offsetTop;

            _icX = _iX + _iW / 2; // Center X of initial icy
            _icY = _iY + _iH / 2; // Center Y of initial icy
            _tcX = _tX + _tW / 2; // Center X of target icy
            _tcY = _tY + _tH / 2; // Center Y of target icy

            _iRad = Math.min(_iW / 2, _iH / 2); // Radius of initial icy based on min or height or width
            _tRad = Math.min(_tW / 2, _tH / 2); // Radius of target icy based on min or height or width

            //log(iW + ' ' + iH + ' ' + iX + ' ' + iY)

            // Rudimentary Detection Math
            // For circles: check if sum of their radii is less than or equal to the distance between the center of the two circles
            // For rectangle: simple check

            // format: $initial$ vs $target$
            // Circle vs Circle
            if (
              this.shapes[this.icies.indexOf(icy)] == "circle" &&
              this.shapes[i] == "circle"
            ) {
              if (
                Math.sqrt(
                  Math.pow(_tcX - _icX, 2) + Math.pow(_tcY - _icY, 2)
                ) <=
                  _iRad + _tRad &&
                this.icies.indexOf(icy) != i
              ) {
                log("Collision Detected. Circle vs Circle.");
                _setCollided(true);
              }
            }

            // Rectangle vs Circle
            else if (
              this.shapes[this.icies.indexOf(icy)] == "rectangle" &&
              this.shapes[i] == "circle"
            ) {
              // Vertical Collision with circle as rectangle
              if (
                _tcX > _iX &&
                _tcX < _iX + _iW &&
                Math.min(Math.abs(_tcY - _iY), Math.abs(_tcY - _iY - _iH)) <=
                  _tRad &&
                this.icies.indexOf(icy) != i
              ) {
                log(
                  "Collision Detected. Rectangle vs Circle. Vertical Collision"
                );
                _setCollided(true);
              }
              // Horizontal Collision with circle as rectangle
              else if (
                _tcY > _iY &&
                _tcY < _iY + _iH &&
                Math.min(Math.abs(_tcX - _iX), Math.abs(_tcX - _iX - _iW)) <=
                  _tRad &&
                this.icies.indexOf(icy) != i
              ) {
                log(
                  "Collision Detected. Rectangle vs Circle. Horizontal Collision"
                );
                _setCollided(true);
              }
              // Diagonal Collision with circle as rectangle
              else if (
                Math.sqrt(
                  Math.pow(
                    Math.min(
                      Math.abs(_tcX - _iX),
                      Math.abs(_tcX - (_iX + _iW))
                    ),
                    2
                  ) +
                    Math.pow(
                      Math.min(
                        Math.abs(_tcY - _iY),
                        Math.abs(_tcY - (_iY + _iH))
                      ),
                      2
                    )
                ) <= _tRad &&
                this.icies.indexOf(icy) != i
              ) {
                log(
                  "Collision Detected. Rectangle vs Circle. Diagonal Collision"
                );
                _setCollided(true);
              }
            }
            // Circle vs Rectangle
            else if (
              this.shapes[this.icies.indexOf(icy)] == "circle" &&
              this.shapes[i] == "rectangle"
            ) {
              // Vertical Collision with rectangle as circle
              if (
                _icX > _tX &&
                _icX < _tX + _tW &&
                Math.min(Math.abs(_icY - _tY), Math.abs(_icY - _tY - _tH)) <=
                  _iRad &&
                this.icies.indexOf(icy) != i
              ) {
                log(
                  "Collision Detected. Rectangle vs Circle. Vertical Collision"
                );
                _setCollided(true);
              }
              // Horizontal Collision with rectangle as circle
              else if (
                _icY > _tY &&
                _icY < _tY + _tH &&
                Math.min(Math.abs(_icX - _tX), Math.abs(_icX - _tX - _tW)) <=
                  _iRad &&
                this.icies.indexOf(icy) != i
              ) {
                log(
                  "Collision Detected. Rectangle vs Circle. Horizontal Collision"
                );
                _setCollided(true);
              }
              // Diagonal Collision with rectangle as circle
              else if (
                Math.sqrt(
                  Math.pow(
                    Math.min(
                      Math.abs(_icX - _tX),
                      Math.abs(_icX - (_tX + _tW))
                    ),
                    2
                  ) +
                    Math.pow(
                      Math.min(
                        Math.abs(_icY - _tY),
                        Math.abs(_icY - (_tY + _tH))
                      ),
                      2
                    )
                ) <= _iRad &&
                this.icies.indexOf(icy) != i
              ) {
                log(
                  "Collision Detected. Rectangle vs Circle. Diagonal Collision"
                );
                _setCollided(true);
              }
            }
            // Default: Rectangle vs Rectangle
            else {
              if (
                _iX + _iW > _tX &&
                _iX < _tX + _tW &&
                _iY + _iH > _tY &&
                _iY < _tY + _tH &&
                this.icies.indexOf(icy) != i
              ) {
                log("Collision Detected");
                _setCollided(true);
              }
            }
            // Finally, do the collision movement IF _collided is true
            if (_collided) {
              this.icies[i].style.left = `${
                this.icies[i].offsetLeft - _changeX
              }px`;
              this.icies[i].style.top = `${
                this.icies[i].offsetTop - _changeY
              }px`;
            }
          }

          // window.requestAnimationFrame(collisionDetection)
        };

        // Function is called when the cursor moves
        // Find the change in cursor position
        const mousemove = (e) => {
          e = e || window.event;
          e.preventDefault();

          _changeX = _cursorX - e.clientX;
          _changeY = _cursorY - e.clientY;

          // Get the bounds of the element (the function returns the smallest rectangle which contains the entire element)
          // const bounds = icy.getBoundingClientRect();

          // icy.style.left = `${bounds.left - _changeX}px`;
          // icy.style.top = `${bounds.top - _changeY}px`;
          icy.style.left = `${icy.offsetLeft - _changeX}px`;
          icy.style.top = `${icy.offsetTop - _changeY}px`;

          // Update cursor positions
          _cursorX = e.clientX;
          _cursorY = e.clientY;

          // Collision check
          if (this.collide) {
            collisionDetection();
          }
        };

        const mouseup = () => {
          // When sliding is enabled, do a timer-based sliding movement
          // TODO: Refine the sliding
          const bounds = icy.getBoundingClientRect(); // NOTE THAT THIS TAKES INTO CONSIDERATION OF MARGIN AND PADDING AND IS DIFFERENT FROM STYLE.___
          if (this.slide) {
            log("sliding");

            if (this.soundEnabled && this.soundEffectSlide.src != "") {
              log("playing sliding sound effect");
              this.soundEffectSlide.play();
            }

            _slideInProgress = true;
            icy.removeEventListener("mousedown", mousedown);
            for (let i = 1; i <= 50 * this.slideTimeCoef; i++) {
              setTimeout(() => {
                if (i <= Math.floor((50 * this.slideTimeCoef * 2) / 5)) {
                  icy.style.left = `${
                    bounds.left - _changeX * i * 0.3 * this.slideSpeedCoef
                  }px`;
                  icy.style.top = `${
                    bounds.top - _changeY * i * 0.3 * this.slideSpeedCoef
                  }px`;
                } else {
                  // Sliding slows down
                  icy.style.left = `${
                    bounds.left -
                    _changeX * 20 * 0.3 -
                    _changeX * (i - 20) * 0.1 * this.slideSpeedCoef
                  }px`;
                  icy.style.top = `${
                    bounds.top -
                    _changeY * 20 * 0.3 -
                    _changeY * (i - 20) * 0.1 * this.slideSpeedCoef
                  }px`;
                }
                // Collision check
                if (this.collide) {
                  collisionDetection();
                }

                if (i == 50 * this.slideTimeCoef) {
                  _slideInProgress = false;
                  icy.addEventListener("mousedown", mousedown);
                }
              }, 15 * i);
            }
          }

          // Check if the user simply clicked the Icy element, or dragged it
          if (_originX == _cursorX && _originY == _cursorY) {
            log("Clicked instead of Dragged. Direct to corresponding URL");
            if (this.clickRedirectURL[this.icies.indexOf(icy)] != "null") {
              window.location.replace(
                this.clickRedirectURL[this.icies.indexOf(icy)]
              );
            }
          }

          window.removeEventListener("mousemove", mousemove);
          window.removeEventListener("mouseup", mouseup);

          // If the DOM element is MOSTLY not in the viewport, then remove it.
          if (
            bounds.left + bounds.width / 2 < 0 ||
            bounds.top + bounds.height / 2 < 0 ||
            bounds.left + bounds.width / 2 > window.innerWidth ||
            bounds.top + bounds.height / 2 > window.innerHeight
          ) {
            log("removing icy element");
            this.icies.splice(this.icies.indexOf(icy), 1);
            $(icy).remove();
          }
        };

        // Adding EventListener on the window since we can't assume the mouse is always in the view window.
        // if (!_slideInProgress) {
        window.addEventListener("mousemove", mousemove);
        window.addEventListener("mouseup", mouseup);
        // }
      };

      // Three events must be taken care of: mouseover, mouseup, mousedown
      icy.addEventListener("mousedown", mousedown);

      const body = $("body"); // jQuery equivalent to: const body = document.querySelector('body')
      body.append(icy);

      this.icies.push(icy); // add to the icies list

      // add the shape to the shapes list
      if (shape) {
        // if shape parameter was given at the beginning
        this.shapes.push(shape);
      } else {
        // Default Shape: rectangle
        this.shapes.push("rectangle");
      }

      // add redirectURL to the clickRedirectURL list
      if (redirectURL) {
        this.clickRedirectURL.push(redirectURL);
      } else {
        // Default to current browser page
        this.clickRedirectURL.push("null");
      }
      _changeNumOfIcies(1); // Increase NumOfIcies by 1
      return icy;
    },

    // Remove an Icy Element from the DOM and the list
    // If an icy element is not given, remove all icy elements from the DOM and the list
    removeIcy: function (icy) {
      this.setRandomMovement(false); // First, disable randomMovement's loop
      if (icy && this.icies.includes(icy)) {
        log("removing icy element");

        // Remove the randomTimerVelocity for the corresponding Icy element
        if (this.randomTimerVel.length === this.icies.length) {
          window.clearInterval(this.randomTimerVel[this.icies.indexOf(icy)][0]);
          this.randomTimerVel.splice(this.icies.indexOf(icy), 1);
        }

        // Then remove the Icy element and its corresponding shape and redirectURL
        this.shapes.splice(this.icies.indexOf(icy), 1);
        this.redirectURL.splice(this.icies.indexOf(icy), 1);
        this.icies.splice(this.icies.indexOf(icy), 1);
        $(icy).remove();
        _changeNumOfIcies(-1); // Decrease NumOfIcies by 1
      } else if (!icy) {
        log("removing all icy elements");

        // Loop through and clear all the random intervals from the window
        for (let i = 0; i < this.icies.length; i++) {
          if (this.randomTimerVel.length === this.icies.length) {
            window.clearInterval(this.randomTimerVel[i][0]);
          }
          $(this.icies[i].remove());
        }

        // Remove the entire randomTimerVel array
        if (this.randomTimerVel.length === this.icies.length) {
          this.randomTimerVel.splice(0, this.randomTimerVel.length);
        }

        // Remove all the shapes
        this.shapes.splice(0, this.shapes.length);

        // Remove all the redirectURLs
        this.clickRedirectURL.splice(0, this.clickRedirectURL.length);

        // Remove all the icies
        _changeNumOfIcies(-1 * this.icies.length); // Decrease NumOfIcies
        this.icies.splice(0, this.icies.length);
      }
    },

    // Enables random movement all over the screen for the given icy element,
    //   or, if no icy element is given, all icy elements of the target icy generator
    //   such random movement is terminated by user inputing
    // This feature lends itself well for egregiously invasive ads on a website
    // No collision detection between ads for current implementation
    RandomMovement: function () {
      let xVel, yYel;
      if (this.randomEnabled) {
        for (let i = 0; i < this.icies.length; i++) {
          xVel = Math.floor(Math.random() * 3 + 1);
          yYel = Math.floor(Math.random() * 3 + 1);
          this.randomTimerVel.push([
            setInterval(() => {
              // If hitting top or bottom edge,
              if (
                this.icies[i].offsetTop < 0 ||
                this.icies[i].offsetTop + this.icies[i].offsetHeight >
                  window.innerHeight
              ) {
                log("Switching y velocity direction");
                this.randomTimerVel[i][2] *= -1; // Switch yVelocity Direction
              }
              // If hitting left or right edge,
              if (
                this.icies[i].offsetLeft < 0 ||
                this.icies[i].offsetLeft + this.icies[i].offsetWidth >
                  window.innerWidth
              ) {
                log("Switching x velocity direction");
                this.randomTimerVel[i][1] *= -1; // Switch xVelocity Direction
              }
              this.icies[i].style.left = `${
                this.icies[i].offsetLeft - this.randomTimerVel[i][1]
              }px`;
              this.icies[i].style.top = `${
                this.icies[i].offsetTop - this.randomTimerVel[i][2]
              }px`;
            }, 20),
            xVel,
            yYel,
          ]);
        }
      } else {
        for (let i = 0; i < this.randomTimerVel.length; i++) {
          log("purging all randomMovement timers");
          window.clearInterval(this.randomTimerVel[i][0]);
        }
        this.randomTimerVel.splice(0, this.randomTimerVel.length);
      }
    },

    setRandomMovement: function (random) {
      this.randomEnabled = random;
      this.RandomMovement();
    },

    // Set sliding attribute
    setSlide: function (slide) {
      this.slide = slide;
    },

    // Set collide attribute
    setCollide: function (collide) {
      this.collide = collide;
    },

    // Set soundEnabled attribute
    setSoundEnabled: function (soundEnabled) {
      this.soundEnabled = soundEnabled;
    },

    // Set the src url for soundEffectClick
    setSoundEffectClick: function (soundURL) {
      this.soundEffectClick.src = soundURL;
    },

    // Set the src url for soundEffectSlide
    setSoundEffectSlide: function (soundURL) {
      this.soundEffectSlide.src = soundURL;
    },

    // Set the value for slideSpeedCoef
    setSlideSpeedCoef: function (speed) {
      this.slideSpeedCoef = speed;
    },

    // Set the value for slideTimeCoef
    setSlideTimeCoef: function (time) {
      this.slideTimeCoef = time;
    },

    // Set the URL for the backgroundImage
    setBackgroundImage: function (url, icy) {
      if (this.icies.includes(icy)) {
        icy.style.backgroundImage=url
        log("Icy element background image successfully changed")
      } else {
        log("Icy element given does not belong to IcyGenerator used to call it!")
      }
    },

    // Get randomEnabled attribute
    getRandomEnabled: function () {
      return this.randomEnabled;
    },

    // Get collide attribute
    getSlide: function () {
      return this.slide;
    },

    // Get slide attribute
    getCollide: function () {
      return this.collide;
    },

    // Get soundEnabled attribute
    getSoundEnabled: function () {
      return this.soundEnabled;
    },

    // Get the total number of icy elements present in the window
    getTotalIcies: function () {
      return _TotalNumOfIcies;
    },
  };

  // After setup:
  // Add the IcyGenerator to the window object if it doesn't already exist.
  global.IcyGenerator = global.IcyGenerator || IcyGenerator;
})(window, window.document, $);
