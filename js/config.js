var GRAVITY   = 0.55;
var SAFE_DIST = 80; // minimum pixel gap between a baguette and a muffin

var LEVEL_DEFS = [
  { num:1,  name:"Warm Up",       desc:"Easy breezy — collect baguettes!",      speed:3.8, jumpPow:13,   gap:60,  obsFreq:0,   movingPlats:false, wind:0,    iceSlide:false, narrow:false },
  { num:2,  name:"Pick It Up",    desc:"A bit faster, a few more gaps.",         speed:4.2, jumpPow:13,   gap:80,  obsFreq:0.3, movingPlats:false, wind:0,    iceSlide:false, narrow:false },
  { num:3,  name:"Muffin Maze",   desc:"Muffins are everywhere!",                speed:4.2, jumpPow:13,   gap:80,  obsFreq:0.6, movingPlats:false, wind:0,    iceSlide:false, narrow:false },
  { num:4,  name:"Leap of Faith", desc:"Wide gaps — time your jumps!",           speed:4.5, jumpPow:13.5, gap:110, obsFreq:0.4, movingPlats:false, wind:0,    iceSlide:false, narrow:false },
  { num:5,  name:"Shaky Ground",  desc:"Platforms are moving. Stay sharp!",      speed:4.5, jumpPow:13.5, gap:90,  obsFreq:0.4, movingPlats:true,  wind:0,    iceSlide:false, narrow:false },
  { num:6,  name:"Windy Day",     desc:"Wind pushes you sideways. Fight it!",    speed:4.8, jumpPow:13.5, gap:100, obsFreq:0.5, movingPlats:true,  wind:0.18, iceSlide:false, narrow:false },
  { num:7,  name:"Icy Patches",   desc:"Slippery ice — no brakes!",              speed:4.8, jumpPow:14,   gap:100, obsFreq:0.5, movingPlats:true,  wind:0,    iceSlide:true,  narrow:false },
  { num:8,  name:"Narrow Pass",   desc:"Thin platforms and lots of muffins!",    speed:5.0, jumpPow:14,   gap:110, obsFreq:0.7, movingPlats:true,  wind:0.15, iceSlide:false, narrow:true  },
  { num:9,  name:"Storm",         desc:"Wind, ice, movers — all at once!",       speed:5.2, jumpPow:14,   gap:120, obsFreq:0.6, movingPlats:true,  wind:0.22, iceSlide:true,  narrow:false },
  { num:10, name:"Grand Finale",  desc:"Maximum chaos. Prove yourself!",          speed:5.5, jumpPow:14.5, gap:130, obsFreq:0.8, movingPlats:true,  wind:0.25, iceSlide:true,  narrow:true  },
];
