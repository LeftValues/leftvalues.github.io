/* global i18n, loadTranslation, questions, setCookie, getCookie */
let maxA, maxB, maxC, maxD, maxE, maxF, maxG // Max possible scores
maxA = maxB = maxC = maxD = maxE = maxF = maxG = 0

const cookie = {
  questionsAnswered: [],
  questionNumber: 0,
  a: 0,
  b: 0,
  c: 0,
  d: 0,
  e: 0,
  f: 0,
  g: 0
}

function saveStats (answer) {
  if (answer !== false) {
    cookie.questionsAnswered.push({
      questionNumber: cookie.questionNumber,
      answer
    })
  }
  setCookie('questionsAnswered', JSON.stringify(cookie.questionsAnswered))
  setCookie('questionNumber', cookie.questionNumber)
  setCookie('a', cookie.a)
  setCookie('b', cookie.b)
  setCookie('c', cookie.c)
  setCookie('d', cookie.d)
  setCookie('e', cookie.e)
  setCookie('f', cookie.f)
  setCookie('g', cookie.g)
}

function loadStats () {
  if (getCookie('questionsAnswered')) {
    cookie.questionsAnswered = JSON.parse(getCookie('questionsAnswered'))
    cookie.questionNumber = parseInt(getCookie('questionNumber')) || 0
    cookie.a = parseInt(getCookie('a')) || 0
    cookie.b = parseInt(getCookie('b')) || 0
    cookie.c = parseInt(getCookie('c')) || 0
    cookie.d = parseInt(getCookie('d')) || 0
    cookie.e = parseInt(getCookie('e')) || 0
    cookie.f = parseInt(getCookie('f')) || 0
    cookie.g = parseInt(getCookie('g')) || 0
  }
}

function resetStats () {
  cookie.questionsAnswered = []
  cookie.questionNumber = 0
  cookie.a = 0
  cookie.b = 0
  cookie.c = 0
  cookie.d = 0
  cookie.e = 0
  cookie.f = 0
  cookie.g = 0
  saveStats(false)
  window.location.reload()
}

function getLastAnswer (questionNumber) {
  return cookie.questionsAnswered.find(answer => answer.questionNumber === questionNumber)
}

function initQuestion () {
  loadStats()
  console.log(cookie)
  document.getElementById('question-text').innerHTML = i18n.getString(`question_${cookie.questionNumber}`)
  document.getElementById('question-number').innerHTML = i18n.getString('quiz_question_of', {
    count: cookie.questionNumber + 1,
    total: Object.size(questions)
  })
  if (cookie.questionNumber >= Object.size(questions)) {
    resetStats()
  }
  if (getLastAnswer(cookie.questionNumber - 1) == null) {
    document.getElementById('back_button').style.display = 'none'
    document.getElementById('back_button_off').style.display = 'block'
  } else {
    document.getElementById('back_button').style.display = 'block'
    document.getElementById('back_button_off').style.display = 'none'
  }
}

function calculateStat (answer) {
  cookie.a += answer * questions[`question_${cookie.questionNumber}`].a
  cookie.b += answer * questions[`question_${cookie.questionNumber}`].b
  cookie.c += answer * questions[`question_${cookie.questionNumber}`].c
  cookie.d += answer * questions[`question_${cookie.questionNumber}`].d
  cookie.e += answer * questions[`question_${cookie.questionNumber}`].e
  cookie.f += answer * questions[`question_${cookie.questionNumber}`].f
  cookie.g += answer * questions[`question_${cookie.questionNumber}`].g
}

function calculateScore (score, max) {
  return (100 * (max + score) / (2 * max)).toFixed(1)
}

function nextQuestion (answer) { // eslint-disable-line no-unused-vars
  calculateStat(answer)
  cookie.questionNumber++
  saveStats(answer)

  if (cookie.questionNumber < Object.size(questions)) {
    initQuestion()
  } else {
    resetStats()
    results()
  }
}

function prevQuestion () { // eslint-disable-line no-unused-vars
  const previousAnswer = getLastAnswer(cookie.questionNumber - 1)
  if (previousAnswer === null) {
    return
  }
  cookie.questionsAnswered = cookie.questionsAnswered.filter(answer => {
    if (answer.questionNumber !== cookie.questionNumber) {
      return answer
    }
  })
  cookie.questionNumber--

  calculateStat(previousAnswer)
  saveStats(previousAnswer)
  initQuestion()
}

function results () {
  window.location.href = 'results.html' +
                    `?a=${calculateScore(cookie.a, maxA)}` +
                    `&b=${calculateScore(cookie.b, maxB)}` +
                    `&c=${calculateScore(cookie.c, maxC)}` +
                    `&d=${calculateScore(cookie.d, maxD)}` +
                    `&e=${calculateScore(cookie.e, maxE)}` +
                    `&f=${calculateScore(cookie.f, maxF)}` +
                    `&g=${calculateScore(cookie.g, maxG)}`
}
loadTranslation().then(() => {
  initQuestion()
  for (let i = 0; i < Object.size(questions); i++) {
    maxA += Math.abs(questions[`question_${i}`].a)
    maxB += Math.abs(questions[`question_${i}`].b)
    maxC += Math.abs(questions[`question_${i}`].c)
    maxD += Math.abs(questions[`question_${i}`].d)
    maxE += Math.abs(questions[`question_${i}`].e)
    maxF += Math.abs(questions[`question_${i}`].f)
    maxG += Math.abs(questions[`question_${i}`].g)
  }
})
