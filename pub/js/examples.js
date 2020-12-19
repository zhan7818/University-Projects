/* icy.js JS Library - Demo */
const log = console.log

"use strict";
log('----------')
log('SCRIPT: Loaded Examples JS')

const body = $('body')

const icyGen = new IcyGenerator("slide","collide","soundEnabled");

const invasiveAds = document.querySelector('#InvasiveAds');

invasiveAds.addEventListener('click', deployInvasiveAds)

function deployInvasiveAds(e) {
    e.preventDefault();
    // check if the deploy button was clicked
    if(e.target.classList.contains('deploy')) {
        console.log('deploying demo for invasive ads. They are icy elements with randomMovement enableds')

        // const hint = document.createElement('h2');
        // hint.innerText = 'To get rid of these ads, simply drag them out of the bounds of the viewport'
        // hint.appendChild(document.createTextNode('To get rid of these ads, simply drag them out of the bounds of the viewport'))
        // body.append(hint)
        
        const circ = icyGen.makeIcy("circle", ["100","50","250","250"],'./js/hardcoded/click.mp3','./js/hardcoded/slide.mp3');
        const circ2 = icyGen.makeIcy("circle", ["800","300","100","100"],'./js/hardcoded/click.mp3','./js/hardcoded/slide.mp3')
        const rect = icyGen.makeIcy("rectangle", ["400","485","300","300"],'./js/hardcoded/click.mp3','./js/hardcoded/slide.mp3');

        circ.style.backgroundImage="url(./js/hardcoded/ad_one.jpg)"
        rect.style.backgroundImage="url(./js/hardcoded/ad_two.jpg)"

        icyGen.setRandomMovement(true) // RandomMovement is automatically disabled if you click on the icy element
        
    } else if (e.target.classList.contains('switch')) {
        if (icyGen.getRandomEnabled()) {
            icyGen.setRandomMovement(false)
        } else {
            icyGen.setRandomMovement(true)
        }
    } else if (e.target.classList.contains('clear')) {
        log('clearing ads')
        icyGen.removeIcy();
    } else if (e.target.classList.contains('collisionSwitch')) {
        log('switching collision on or off')
        if (icyGen.getCollide()) {
            icyGen.setCollide(false)
        } else {
            icyGen.setCollide(true)
        }
    } else if (e.target.classList.contains('slideSwitch')) {
        log('switching sliding on or off')
        if (icyGen.getSlide() == true) {
            icyGen.setSlide(false)
        } else {
            icyGen.setSlide(true)
        }
    }
}