# js-library-zhan6546

Webapp Full URL: https://limitless-beyond-32349.herokuapp.com/

Direct Link to documentation: https://limitless-beyond-32349.herokuapp.com/api.html

Getting Started
To use Icy, first get the latest version of jquery, then load the icy javascript file:

          <script defer src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
          <script defer type="text/javascript" src="js/icy.js"></script>
        
By default, Icy overwrites the global IcyGenerator variable when loaded.

API Methods
Constructor
new IcyGenerator(slide, collide, sound)
Creates an IcyGenerator with slide, collide, and sound parameters each stating whether the corresponding feature will be enabled by default

example usage:

          
            const icyGen = new IcyGenerator("slide","collide","soundEnabled");
          
        
IcyGenerator Base Methods
.makeIcy(shape, startPos, clickURL, soundURL, redirectURL)
This lets the IcyGenerator create a div element with attached mousedown, mouseup, and mousemove eventlisteners, and pushse them all into their respective attribute storage lists for the IcyGenerator that is used to create them

shape lets the developer decide whether they want to make a circle or rectangle Icy element. startPos is an array of 4 values, representing the developer inputted icy element's position on the screen like so: [x,y,width,height].

clickURL represents the developer inputted url for the clicking sound effect. (Defaults to click.mp3 in hardcode folder).

soundURL represents the developer inputted url for the sliding sound effect. (Defaults to slide.mp3 in hardcode folder).

redirectURL represents the developer inputted URL they wish to redirect users to when they click the icy element. (Defaults to index.html)

example usage:

          
            const title = icyGen.makeIcy("rectangle", ["500","100","900","500"],'./js/hardcoded/click.mp3','./js/hardcoded/slide.mp3', "index.html")
          
        
.removeIcy(icy)
An icy element can be removed by passing it through this function. Should the function be called without an icy element parameter, all icy element from the IcyGenerator used to call this function will be removed.

example usage:

          
            icyGen.removeIcy(title)
          
        
.setRandomMovement(random)
All Icy elements from the same icy generator can be toggled to begin randomly moving across the screen. The random variable can be either true or false to either start or end random movements respectively.

example usage:

          
            icyGen.setRandomMovement(true)
          
        
.setSlide(slide)
All Icy elements from the same icy generator can be toggled to enable or disable their sliding feature. The slide variable can be either true or false to either enable or disable sliding respectively.

example usage:

          
            icyGen.setSliding(true)
          
        
.setCollide(collide)
All Icy elements from the same icy generator can be toggled to enable or disable their collision feature. The collide variable can be either true or false to either enable or disable collision respectively.

example usage:

          
            icyGen.setCollide(true)
          
        
.setSoundEnabled(soundEnabled)
All Icy elements from the same icy generator can be toggled to enable or disable their sound effects, if they were given by the developer when constructed. The soundEnabled variable can be either true or false to either enable or disable sound effects respectively.

example usage:

          
            icyGen.setSoundEnabled(true)
          
        
.setSlideSpeedCoef(speed)
All Icy elements from the same icy generator can have their sliding speed tuned. The speed variable is an integer coefficient used to multiply sliding speed.

example usage:

          
            icyGen.setSlideSpeedCoef(2)
          
        
.setSlideTimeCoef(time)
All Icy elements from the same icy generator can have their sliding duration tuned. The time variable is an integer coefficient used to multiply sliding duration.

example usage:

          
            icyGen.setSlideTimeCoef(2)
          
        
.setBackGroundImage(url, icy)
A background image can be added to an icy element through this function. the url variable represents the developer inputted url for the background image. the icy represents the icy element in the IcyGenerator used to call this function to add the background image to.

example usage:

          
            icyGen.setBackgroundImage("url(./js/hardcoded/api.jpg)", title)