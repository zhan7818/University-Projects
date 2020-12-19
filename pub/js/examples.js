/* icy.js JS Library - Demo */
const log = console.log

"use strict";
log('----------')
log('SCRIPT: Loaded Examples JS')

const body = $('body')

const icyGen = new IcyGenerator("slide","collide","soundEnabled");
const icyGen2 = new IcyGenerator("slide","collide","soundEnabled");

const apiRedirectURL = (window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + "api.html")

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
        const circ2 = icyGen2.makeIcy("circle", ["700","600","300","300"],'./js/hardcoded/click.mp3','./js/hardcoded/slide.mp3')
        const circ3 = icyGen2.makeIcy("circle", ["800","300","100","100"],'./js/hardcoded/click.mp3','./js/hardcoded/slide.mp3', apiRedirectURL)
        const rect = icyGen.makeIcy("rectangle", ["400","485","300","300"],'./js/hardcoded/click.mp3','./js/hardcoded/slide.mp3');

        icyGen.setBackgroundImage("url(./js/hardcoded/ad_one.jpg)", circ)
        icyGen.setBackgroundImage("url(./js/hardcoded/ad_two.jpg)", rect)
        icyGen2.setBackgroundImage("url(./js/hardcoded/ad_three.jpg)", circ2)
        icyGen2.setBackgroundImage("url(./js/hardcoded/api.jpg)", circ3)

        icyGen.setRandomMovement(true) // RandomMovement is automatically disabled if you click on the icy element
        
    } else if (e.target.classList.contains('switch')) {
        if (icyGen.getRandomEnabled()) {
            icyGen.setRandomMovement(false)
        } else {
            icyGen.setRandomMovement(true)
        }
    } else if (e.target.classList.contains('switch-two')) {
        if (icyGen2.getRandomEnabled()) {
            icyGen2.setRandomMovement(false)
        } else {
            icyGen2.setRandomMovement(true)
        }
    } else if (e.target.classList.contains('clear')) {
        log('clearing ads')
        icyGen.removeIcy();
        icyGen2.removeIcy();
    } else if (e.target.classList.contains('collisionSwitch')) {
        log('switching collision on or off')
        if (icyGen.getCollide()) {
            icyGen.setCollide(false)
        } else {
            icyGen.setCollide(true)
        }
    } else if (e.target.classList.contains('collisionSwitch-two')) {
        log('switching collision on or off')
        if (icyGen2.getCollide()) {
            icyGen2.setCollide(false)
        } else {
            icyGen2.setCollide(true)
        }
    } else if (e.target.classList.contains('slideSwitch')) {
        log('switching sliding on or off')
        if (icyGen.getSlide() == true) {
            icyGen.setSlide(false)
        } else {
            icyGen.setSlide(true)
        }
    } else if (e.target.classList.contains('slideSwitch-two')) {
        log('switching sliding on or off')
        if (icyGen2.getSlide() == true) {
            icyGen2.setSlide(false)
        } else {
            icyGen2.setSlide(true)
        }
    } else if (e.target.classList.contains('soundSwitch')) {
        log('switching sound on or off')
        if (icyGen.getSoundEnabled() == true) {
            icyGen.setSoundEnabled(false)
        } else {
            icyGen.setSoundEnabled(true)
        }
    } else if (e.target.classList.contains('soundSwitch-two')) {
        log('switching sound on or off')
        if (icyGen2.getSoundEnabled() == true) {
            icyGen2.setSoundEnabled(false)
        } else {
            icyGen2.setSoundEnabled(true)
        }
    }
}