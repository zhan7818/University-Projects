/* icy.js JS Library - Main Webpage */
const log = console.log

"use strict";
log('----------')
log('SCRIPT: Loaded Main Webpage JS')

const body = $('body')

const icyGen = new IcyGenerator("slide","collide","soundEnabled");

const title = icyGen.makeIcy("rectangle", ["500","100","900","500"],'./js/hardcoded/click.mp3','./js/hardcoded/slide.mp3', window.location.href)
icyGen.setBackgroundImage("url(./js/hardcoded/icy2.jpg)", title)

const examplesPath = window.location.href + "/examples.html"
const examplesIcy = icyGen.makeIcy("rectangle", ["700","650","200","100"],'./js/hardcoded/click.mp3','./js/hardcoded/slide.mp3', examplesPath)

const apiPath = window.location.href + "/api.html"
const apiIcy = icyGen.makeIcy("rectangle", ["1000","650","200","100"],'./js/hardcoded/click.mp3','./js/hardcoded/slide.mp3', apiPath)

icyGen.setBackgroundImage("url(./js/hardcoded/examples.jpg)", examplesIcy)
icyGen.setBackgroundImage("url(./js/hardcoded/api2.jpg)", apiIcy)