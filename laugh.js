'use strict';


//DOM variables
//---------------------------

var getRandJoke = document.getElementById("jokes");
var newJokeButton = document.getElementById('display-button2');
var playGameButton = document.getElementById('ready-to-play');

var jokes = ['What do you call a bear with no teeth? A gummy bear!', 'What did the ocean say to the beach? Nothing, it just waved.', 'Did you hear about the guy who lost his left arm and leg in a car crash? He\'s all right now.','Why don’t some couples go to the gym? Because some relationships don’t workout.', 'I\’d tell you a chemistry joke, but I know I wouldn’t get a reaction.','Did you hear about the guy who got hit in the head with a soda can? He was lucky it was a soft drink.', 'Have you ever tried to eat a clock? It’s very time consuming.', 'What\’s the best thing about Switzerland? I don\’t know, but their flag is a huge plus.', 'What’s E.T. short for? Because he’s only got little legs.', 'Have I told you this deja vu joke before?', 'How do you make a tissue dance? You put a little boogie in it.', 'Why did the policeman small bad? He was on duty.', 'What did the little fish say when he swam into the wall? DAM.', 'Why are pirates mean? I don’t know, they just arrrrr!', 'What do you call a cheese that’s not yours? It’s nacho cheese.', 'What do you get when you put a candle in a suit of armor? A knight light.','Why did the stop light turn red? You would too if you had to change in the middle of the street!','What did the green grape say to the purple grape? BREATHE!','If you’re American in the living room, what are you in the bathroom? European!','Why did the physics teacher break up with the biology teacher? There was no chemistry.','Why do the French like to eat snails so much? They can’t stand fast food.','What did the stamp say to the envelope? You stick with me, and I will take you places!','What did the tall chimney say to the small chimney? Hey, you’re way too young to smoke.','What did one candle say to the other? I’ll be going out tonight.','How come the barber won the race? The cheater took a short cut.','What did the toilet roll complain about? People just keep ripping me off!','What did one wall say to the other wall? We’ll meet at the corner.','What do you call a bull that likes taking a nap? A bulldozer!','What should you do when you see a spaceman? You just park in it, man.','Why did the octopus blush? He’d just seen the bottom of the ocean!','Why don’t teddy bears ever really eat at their picnics? Because they’re already stuffed!','Why did the balloon go near the needle? He wanted to be a pop star.','Would you like to hear a construction joke? I’m still working on it.','What was the football coach yelling at the vending machine? Give me my quarter back!!','Have you heard about the fire in the shoe factory? Hundreds of soles were lost!','What is the computer’s favorite food? Microchips!','Why are Apple staff absolutely forbidden to fart in Apple stores? Because there are no windows.','What do you call your sweetheart when she loses her eye? No idea.','Why is the math book so sad? It’s got too many problems!','Why was the tomato all red? It saw the salad dressing.','What would you call a fish with a missing eye? A fsh, probably.','What kind of a driver doesn’t know how to drive? The screwdriver.','How do you organize a space party? You planet.','Why is Apple having a hard time designing a new automatic car? They’re having trouble installing windows.','Why did the donut visit the dentist? To get a new filling.','Why did the banana have to go to the doctor? It wasn’t peeling too well.','Why was Cinderella kicked off the soccer team? She always ran away from the ball.','What do you receive when you ask a lemon for help? Lemonaid','Where should a dog go when it’s lost its tail? The retail store.','What does a dog say when he sits down on a piece of sandpaper? Ruff!'];

//Global variables
//--------------------
var allJokes = [];
var clickCounter = 0;
var newJokesArray = [];
var jokesViewed = [];
var maxJokes = jokes.length;

// //avoid previous duplicates
function makeUniqueJokeFromArray(){
  jokesViewed[0] = newJokesArray[0];

  newJokesArray[0] = showAJoke();

  // console.log(newJokesArray,'joke viewed dawg');

  while (newJokesArray[0] !== jokesViewed[maxJokes]){
    jokesViewed.push(newJokesArray[maxJokes])
    newJokesArray[0] = showAJoke();
    console.log('new joke got caught');
    showAJoke();
    return;
  }
  console.log(newJokesArray);
  console.log('----------------');
  console.log(jokesViewed);
}

function showAJoke(){
  var randomIndex = Math.ceil((Math.random() * maxJokes - 1));
  var newText = jokes[randomIndex];
  getRandJoke.innerHTML = newText;
  clickCounter += 1;
    console.log(clickCounter, 'total clicks so far');
    if (clickCounter > 1){
     document.getElementById('ready-to-play').style.visibility = 'visible';
   }
   if (clickCounter = 1){
    document.getElementById('click-again-text').style.visibility = 'visible';
  }
  jokesViewed.push([randomIndex]);
}


//hides play game button and text until first joke is viewed
document.getElementById('ready-to-play').style.visibility = 'hidden';
document.getElementById('click-again-text').style.visibility = 'hidden';

function playGameHandler(e) {
 e.preventDefault();
 document.location.href = 'index.html';
}

//Next joke button
document.getElementById(newJokeButton);
newJokeButton.addEventListener("click", makeUniqueJokeFromArray);
//ready to play button
document.getElementById(playGameButton);
playGameButton.addEventListener("click", playGameHandler);
