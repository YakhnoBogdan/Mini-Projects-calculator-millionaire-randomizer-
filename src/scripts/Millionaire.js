import { Player } from "./Player.js";

class Millionaire {
    constructor(elements, player, questions, answers) {
        this.player = player;
        this.questions = questions;
        this.answers = answers;
        this.questionOutput = elements.questionOutput;
        this.answersOutput = elements.answers;
        this.stages = elements.stages;
        this.gameMenu = elements.gameMenu;
        this.startGameButton = elements.startGameButton;
        this.checkScoreButton = elements.checkScoreButton;
        this.volumeButton = elements.volumeButton;
        this.hintFriendCall = elements.hintFriendCall;
        this.hintFiftyFifty = elements.hintFiftyFifty;
        this.winningsList = elements.winnings;
        this.modal = elements.modal;
        this.scoreElement = elements.scoreElement;
        this.winAmountElement = elements.winAmountElement;
        this.playAgainButton = elements.playAgainButton;
        this.cancelButton = elements.cancelButton;
        this.friendCallHintOutput = elements.friendCallHintOutput;
        this.friendCallHintTextPlaceholder = elements.friendCallHintTextPlaceholder;
        this.friendCallHintCloseButton = elements.friendCallHintCloseButton;
        this.firstAnswer =  elements.firstAnswer;
        this.secondAnswer = elements.secondAnswer;
        this.thirdAnswer = elements.thirdAnswer;
        this.fourthAnswer = elements.fourthAnswer;
        this.binding = this.handleEvent.bind(this);
        this.firstAnswer.addEventListener('click', this.binding);
        this.secondAnswer.addEventListener('click', this.binding);
        this.thirdAnswer.addEventListener('click', this.binding);
        this.fourthAnswer.addEventListener('click', this.binding);
        this.friendCallHintCloseButton.addEventListener('click', this.binding);
        this.gameMenu.addEventListener('click', this.binding);
        this.hintFiftyFifty.addEventListener('click', this.binding);
        this.hintFriendCall.addEventListener('click', this.binding);
        this.playAgainButton.addEventListener('click', this.binding);
        this.cancelButton.addEventListener('click', this.binding);

        this.stage = 0;
        this.winning = 1;
        this.questionsLvl = 0;
        this.answersArray = [this.firstAnswer, this.secondAnswer, this.thirdAnswer, this.fourthAnswer];
        this.startGame();
    }
    startGame() {
        this.stage = 0;
        this.questionsLvl = 0;
        this.winning = 1;
        this.currentQuestion = this.questions[this.stage][this.questionsLvl];
        this.fillTheQuestions();
        this.winningsList.forEach(el => el.classList.remove('stages__item_current'));
        this.winningsList[0].classList.add('stages__item_current');
        this.raisedWin = 0;
        this.cashPrice = 0;
        this.gameOverFlag = false;
        this.friendCallHadUsed = false;
        this.fifty_fiftyHadUsed = false;
    }
    startNewGame(event) {
        console.log(event.target);
        if (event.target == this.startGameButton) {
            this.gameMenu.classList.add('millionaire-menu_hide');
            setTimeout(() => {
                this.startGame();
            }, 100);
        }
    }
    backToMenu(event) {
        this.gameMenu.classList.remove('millionaire-menu_hide');
        this.modal.classList.remove('game-modal_open');
    }
    fillTheQuestions() {
        if (this.winning == 6 || this.winning == 11) {
            this.questionsLvl++;
            this.stage = 0;
        }
        this.currentQuestion = this.questions[this.questionsLvl][this.stage];
        this.currentVariants = this.answers[this.questionsLvl][this.stage];

        this.questionOutput.innerText = this.currentQuestion.question;
        this.answersArray.forEach((answerElement, index) => {
            answerElement.innerText = this.currentVariants[index];
            answerElement.classList.remove('selected-answer');
            answerElement.classList.remove('right-answer');
            answerElement.classList.remove('wrong-answer');
            answerElement.addEventListener('click', this.binding);
        })
    }

    checkAnswer(event) {
        
        let arr = Array.from(this.answersOutput);
        event.target.classList.add('selected-answer');

        if (this.answersArray.some(el => el.classList.contains('selected-answer'))) {
            this.answersOutput.forEach(element => {
                element.removeEventListener('click', this.binding);
            })
        }
        setTimeout(() => {

            if (this.currentQuestion.answer == event.target.innerText) {
                switch (this.winning) {
                    case 4:
                        this.cashPrice = '2000$';
                        break;
                    case 9:
                        this.cashPrice = '80 000$';
                        break;
                    case 15:
                        this.cashPrice = '1 000 000$';
                        this.raisedWin = '1 000 000$';
                        break;
                    default:
                        break;
                }
                event.target.classList.remove('selected-answer');
                event.target.classList.add('right-answer');
                if (this.winning == 15) {
                    this.gameWon();
                    this.gameOver();
                }
                setTimeout(() => {
                    this.stage++;
                    this.updateWinning();
                    this.closeHint();
                    this.fillTheQuestions();
                }, 1000);

            } else {
                this.answersOutput.forEach(el => {
                    if (el.innerText == this.currentQuestion.answer && el != event.target) {
                        el.classList.add('right-answer');
                    }
                });
                this.gameOver(event);
            }
        }, 1000);
    }

    updateWinning() {
        this.currentWin = this.winningsList[this.winning];
        this.raisedWin = this.winningsList[this.winning - 1].querySelector('span').innerText;
        this.winningsList[this.winning - 1].classList.remove('stages__item_current');
        this.winning++;
        this.currentWin.classList.add('stages__item_current');
    }

    gameOver(event) {
        this.gameOverFlag = true;
        this.modal.classList.add('game-modal_open');
        this.scoreElement.innerText = `Your score: ${this.raisedWin}`;
        this.winAmountElement.innerText = `Your cash prize: ${this.cashPrice}`;
        if (event.target == this.playAgainButton) {
            this.startGame();
            this.modal.classList.remove('game-modal_open');
        }
    }

    gameWon() {
        alert('Congratulations');
    }

    useHintFiftyFifty() {
        let answersArray = Array.from(this.answersOutput);
        this.fifty_fiftyAnswers = [];
        if (!this.fifty_fiftyHadUsed && !this.gameOverFlag) {
            this.fifty_fiftyAnswers.push(answersArray.filter(el => el.innerText == this.currentQuestion.answer)[0]);
            let filtered = answersArray.filter(el => el != this.fifty_fiftyAnswers[0]);
            this.fifty_fiftyAnswers.push(filtered[Math.floor(Math.random() * filtered.length)]);
            answersArray.filter(el => !this.fifty_fiftyAnswers.includes(el)).forEach(wrongAnswer => {
                wrongAnswer.classList.add('wrong-answer');
            })
        }
        this.fifty_fiftyHadUsed = true;
    }

    useHintFriendCall() {
        let chance = Math.round(Math.random() * 10),
            friendHint;
        if (!this.friendCallHadUsed && !this.gameOverFlag) {
            if (this.fifty_fiftyHadUsed) {
                friendHint = chance > 2 ? this.fifty_fiftyAnswers[0].innerText : this.fifty_fiftyAnswers[1].innerText;
            } else if (!this.fifty_fiftyHadUsed) {

                friendHint = chance > 3 ? this.currentQuestion.answer
                    : Array.from(this.answersOutput)
                        .filter(el => el.innerText != this.currentQuestion.answer)[Math.floor(Math.random() * 3)].innerText;
            }
            this.friendCallHintTextPlaceholder.innerText = `I'm not sure, but I think the right answer is "${friendHint}"`;
            this.friendCallHintOutput.classList.add('friendsCall-hint_open');
            console.log(this.friendCallHintOutput);

        }
        this.friendCallHadUsed = true;
    }

    closeHint(event) {
        this.friendCallHintOutput.classList.remove('friendsCall-hint_open');
    }
    handleEvent(event) {
        switch (event.target) {
            case this.startGameButton:
                this.startNewGame(event);
                break;
            case this.hintFiftyFifty:  
                this.useHintFiftyFifty(event);
                break;
            case this.hintFriendCall:  
                this.useHintFriendCall(event);
                break;
            case this.playAgainButton:  
                this.gameOver(event);
                break;
            case this.cancelButton:  
                this.backToMenu(event);
                break;
            case this.firstAnswer:  
                this.checkAnswer(event);
                break;
            case this.secondAnswer:  
                this.checkAnswer(event);
                break;
            case this.thirdAnswer:  
                this.checkAnswer(event);
                break;
            case this.fourthAnswer:  
                this.checkAnswer(event);
                break;
            case this.friendCallHintCloseButton:  
                this.closeHint(event);
                break;
            default:
                break;
        }
    }

}


const quiz = document.querySelector('.quiz');
const gameDisplay = document.querySelector('.millionaire__display');
const modal = document.querySelector('.game-modal');
const hints = gameDisplay.querySelector('.hints');
const gameMenu = document.querySelector('.millionaire-menu');
const friendCallHintOutput = document.querySelector('.friendsCall-hint');

const elements = {
    questionOutput: quiz.querySelector('.quiz__question'),
    answers: quiz.querySelectorAll('.quiz__answers-list li'),
    firstAnswer: quiz.querySelector('.quiz__answers-list li:first-child'),
    secondAnswer: quiz.querySelector('.quiz__answers-list li:nth-child(2)'),
    thirdAnswer: quiz.querySelector('.quiz__answers-list li:nth-child(3)'),
    fourthAnswer: quiz.querySelector('.quiz__answers-list li:last-child'),
    stages: gameDisplay.querySelectorAll('.stages__item'),
    volumeButton: gameDisplay.querySelector('.mute-button img'),
    hintFiftyFifty: hints.querySelector('.hints__50-50-button'),
    hintFriendCall: hints.querySelector('.hints__friends-call'),
    friendCallHintOutput,
    friendCallHintTextPlaceholder: friendCallHintOutput.querySelector('.friendsCall-hint__variant'),
    friendCallHintCloseButton: friendCallHintOutput.querySelector('.friendsCall-hint__close-button'),
    winnings: gameDisplay.querySelectorAll('.stages__item'),
    startGameButton: gameMenu.querySelector('.millionaire-menu__start-game'),
    checkScoreButton: gameMenu.querySelector('.millionaire-menu__check-scores'),
    gameMenu,
    modal,
    winAmountElement: modal.querySelector('.game-modal__win-amount'),
    scoreElement: modal.querySelector('.game-modal__score'),
    playAgainButton: modal.querySelector('.game-modal__play-again'),
    cancelButton: modal.querySelector('.game-modal__cancel'),
}




let questions = [
    [
        { question: 'Which HTML5 element defines navigation links?', answer: 'nav(true)' },
        { question: 'How can you print information to the console?', answer: 'console.log(info)(true)' },
        { question: 'What property is used to change the text color of an element?', answer: 'color(true)' },
        { question: 'What is not an HTML5 element?', answer: 'blink(true)' },
        { question: 'Which of the following function of String object returns the character at the specified index?', answer: 'charAt()(true)' },],
    [
        { question: 'Which of the following function of Array object removes the last element from an array and returns that element?', answer: 'pop()(true)' },
        { question: 'What is jQuery?', answer: 'A library(true)' },
        { question: 'Which snippet of CSS is commonly used to center a website horizontally?', answer: 'margin: 0 auto;(true)' },
        { question: 'Which is not a JavaScript data type?', answer: 'double(true)' },
        { question: 'A collection of data containing both properties and methods is called...', answer: 'Object(true)' },
    ],
    [
        { question: 'var a = []; What does "typeof a" return?', answer: 'object(true)' },
        { question: 'The escape sequence ‘\f’ stands for ', answer: 'Form feed(true)' },
        { question: 'Original Name of Javascript is', answer: 'LiveScript(true)' },
        { question: 'What are the types of Pop up boxes available in JavaScript? ', answer: 'All of the above(true)' },
        { question: 'Which one is Ternary Operator', answer: '?:(true)' },
    ],
];

const answers = [
    [
        ['nav(true)', 'navigation', 'a', 'link'],
        ['console(info)', 'console.log(info)(true)', 'log(info)', 'alert(info)'],
        ['backgroundcolor', 'background', 'textcolor', 'color(true)'],
        ['section', 'header', 'blink(true)', 'main'],
        ['charAt()(true)', 'charCodeAt()', 'concat()', 'indexOf()'],
    ],
    [
        ['push()', 'pop()(true)', 'join()', 'map()'],
        ['A library(true)', 'A framework', 'none of these', 'jQuery?'],
        ['margin: auto 0;', 'padding: auto;', 'margin: auto;', 'margin: 0 auto;(true)'],
        ['double(true)', 'undefined', 'string', 'boolean'],
        ['Object(true)', 'Tag', 'Class', 'Selector'],
    ],
    [
        ['object(true)', 'array', 'function', 'undefined'],
        ['None of this', 'Form feed(true)', 'Floating numbers', 'Functions thar returns a value'],
        ['LiveScript(true)', 'EcmaScript', 'Javascript', 'Java'],
        ['All of the above(true)', 'Prompt', 'Confirm', 'Alert'],
        ['<?', '>?', '?:(true)', '??'],
    ]
]
let a = new Player('vasya');
let myClass = new Millionaire(elements, a, questions, answers);

