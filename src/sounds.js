// Sound from tone.js
// To change if sounds are played randomly or always the same sound, go to file Country.js

// TODO: select the LowMono only once in the loop

import * as Tone from 'tone';
import { p5Instance as p5 } from './index';
let mobile = require('is-mobile');
let StartAudioContext = require('startaudiocontext');

// Bmp
Tone.Transport.bpm.value = 108;
Tone.Transport.start();

let lowMonoIsTaken = false;

// Filter
// Docs: https://tonejs.github.io/docs/#Filter
var frequencyIncrease = 250; // This is the increment to frequency everytime a new country is added.
var filter = new Tone.Filter({
  type: "lowpass",
  frequency: 350,
  rolloff: -48,
  Q: 1,
  gain: 0
}).toMaster();

if (mobile()) {
  StartAudioContext(filter.context, '#playButton');
}

// Freeverb
// Docs: https://tonejs.github.io/docs/#Freeverb
var roomSizeIncrease = 0.1; // This is the increment to roomSize everytime a new country is added.
var dampeningIncrease = 250; // This is the increment to dampening everytime a new country is added.
var wetIncrease = 0.1; // This is the increment to wet everytime a new country is added.
// var freeverb = new Tone.Freeverb({
//   roomSize: 0.1,
//   dampening: 10,
//   wet: 0.2
// }).toMaster();

let instrumentOrder = 1;

// This will run everytime a new country is added
let setCurrentInstrument = (value) => {
  // console.log(value);
  // let randomArray = ['HiMono', 'HiPoly', 'mono', 'newDrum', 'poly', 'LowMono']; 
  // return randomArray[Math.floor(Math.random()*6)]
  switch (value) {
    case 1:
      return 'HiMono'
    case 2:
      return 'HiPoly'
    case 3:
      return 'mono'
    case 4:
      return 'newDrum'
    case 5:
      return 'poly'
    case 6:
      return 'LowMono'
    default:
      return 'mono'
      break;
  }

  // if (reset) {
  //   instrumentOrder = 1;
  //   // filter.frequency.input.value = 350; // Increase for frequency in filter
  //   // freeverb.dampening.input.value = 10; // Increase for dampening in freeverb
  //   // freeverb.roomSize.input.value = 0.1;  // Increase for roomSize in freeverb
  // } else {
  //   // This is just for debug
  //   // console.log("===============")
  //   // console.log('filter frequency: ', filter.frequency.input.value);
  //   // console.log('freeverb room Size', freeverb.roomSize.input.value);
  //   // console.log('freeverb dampening', freeverb.dampening.input.value);

  //   // Increase the variables for filter or freeverb
  //   filter.frequency.input.value += frequencyIncrease; // Increase for frequency in filter

  //   // freeverb.dampening.input.value += dampeningIncrease; // Increase for dampening in freeverb
  //   // freeverb.roomSize.input.value > 0.8 ? roomSizeIncrease = 0 : roomSizeIncrease = 0.1; // Logic so roomSize doesn't go over 0.8
  //   // freeverb.roomSize.input.value += roomSizeIncrease;  // Increase for roomSize in freeverb

  //   // Each country gets a different sound based on the position it was clicked.
    // switch (instrumentOrder) {
    //   case 1:
    //     instrumentOrder++;
    //     return 'mono'
    //   case 2:
    //     instrumentOrder++;
    //     return 'poly'
    //   case 3:
    //     instrumentOrder++;
    //     return 'newDrum'
    //   case 4:
    //     instrumentOrder++;
    //     return 'HiMono'
    //   case 5:
    //     if (lowMonoIsTaken) {
    //       instrumentOrder = instrumentOrder + 2;
    //       return 'HiPoly'
    //     } else {
    //       instrumentOrder++;
    //       lowMonoIsTaken = true;
    //       return 'LowMono'
    //     }
    //   case 6:
    //     instrumentOrder++;
    //     return 'HiPoly'
    //   default:
    //     instrumentOrder = 2;
    //     return 'mono'
    //     break;
    // }
  // }
};

let releaseLowMono = () => {
  lowMonoIsTaken = false;
}

// The mp3 files are loaded here.
let createSoundGroup = (size, group, volume) => {
  let arr = [];

  // This loads all files in the folder /mp3. The name should match the pattern: Tradeflow_1mono_1.mp3
  for (let i = 1; i <= size; i++) {
    arr.push(new Tone.Player({
      "url": "./mp3/Tradeflow_" + group + "_" + i + ".mp3",
      "loop": false,
      "volume": volume || -4
    }).connect(filter)); // To take the filter or freeverb off, just remove the .connect(filter) or .connect(freeverb)
  }
  return arr;
}

// This actually loads all the files, no need to change anything here.
let soundTypes = {
  mono: {
    sounds: createSoundGroup(5, '1mono', -10),
    tempo: '6n',
    loop: '1n'
  },
  poly: {
    sounds: createSoundGroup(7, '2poly', -15),
    tempo: '2n',
    loop: '1n'
  },
  newDrum: {
    sounds: createSoundGroup(8, '3newDrum'),
    tempo: '4n',
    loop: '1n'
  },
  HiMono: {
    sounds: createSoundGroup(8, '4HiMono'),
    tempo: '3n',
    loop: '1n'
  },
  LowMono: {
    sounds: createSoundGroup(3, '5LowMono', -25),
    tempo: '1n',
    loop: '1n'
  },
  HiPoly: {
    sounds: createSoundGroup(7, '6HiPoly'),
    tempo: '5n',
    loop: '1n'
  }
}

let currentTempo = 1;

let getTempo = () => {
  switch (currentTempo) {
    case 1:
      currentTempo++;
      return 1
    case 2:
      currentTempo++;
      return 2
    case 3:
      currentTempo++;
      return 3
    case 4:
      currentTempo++;
      return 4
    case 5:
      currentTempo++
      return 5
    case 6:
      currentTempo = 1
      return 6
    default:
      currentTempo = 2;
      return 'mono'
      break;
  }
}

let playSound = (soundType) => {
  soundType.start();
}

export { playSound, soundTypes, setCurrentInstrument, releaseLowMono, getTempo };