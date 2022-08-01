// LANGUAGE SETTINGS
function getCookie (name) {
  const value = '; ' + document.cookie
  const parts = value.split('; ' + name + '=')
  if (parts.length === 2) return parts.pop().split(';').shift()
}
function setCookie (cname, cvalue, exhours) {
  const d = new Date()
  d.setTime(Date.now() + (exhours * 60 * 60 * 1000))
  const expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}
function setBodyClassUserLang (userLang) {
  document.getElementsByTagName('body')[0].classList.add(`__i18n-${userLang}`)
}

const langElements = document.querySelectorAll('[data-i18n]')
const userLang = getCookie('lang') || navigator.language || navigator.userLanguage
setBodyClassUserLang(userLang)

const langPicker = document.getElementById('langPicker')

var REPLACEMENTS = {
  colors: {
    rev: '#890000',
    sci: '#88232B',
    cent: '#560000',
    int: '#782F52',
    party: '#963B33',
    prod: '#804E00',
    cons: '#27577A',
    ref: '#FC5959',
    uto: '#7F0037',
    dec: '#000000',
    nat: '#7F3300',
    syn: '#7F333B',
    eco: '#586808',
    prog: '#C4A717'
  }
}

const replace = (string, values = null) => {
  if (values) {
    Object.getOwnPropertyNames(values).forEach((val, idx, array) => {
      REPLACEMENTS[val] = values[val]
    })
  }
  const re = /{{([\w\.]+)}}/

  let m
  do {
    m = re.exec(string)
    if (m) {
      const x = m[1].split('.')
      switch (x.length) {
        case 1:
          string = string.replace(m[0], REPLACEMENTS[x[0]])
          break
        case 2:
          string = string.replace(m[0], REPLACEMENTS[x[0]][x[1]])
          break
        case 3:
          string = string.replace(m[0], REPLACEMENTS[x[0]][x[1]][x[2]])
          break
        default:
          console.error('nested replacements only allowed up to 3 levels')
          break
      }
    }
  } while (m)

  return string
}

const i18n = {
  getString (name, parameters = null) {
    if (userLang in i18n.l10n && name in i18n.l10n[userLang]) {
      if (parameters) {
        return replace(i18n.l10n[userLang][name], parameters)
      }
      return replace(i18n.l10n[userLang][name])
    }
    console.log(`using fallback for ${name}`)
    if (parameters) {
      return replace(i18n.l10n.en[name], parameters)
    }
    return replace(i18n.l10n.en[name])
  },
  lang: userLang,
  l10n: {}
}

const addLanguage = (code, properties) => {
  i18n.l10n[code] = properties
  // Language picker
  if (langPicker) {
    const option = document.createElement('option')
    option.text = i18n.l10n[code].language_name
    option.value = code

    if (option in langPicker.options) {
    } else {
      langPicker.add(option)
    }
    if (option.value === userLang) {
      langPicker.value = userLang
    }
  }
}

const getl10n = async (code) => {
  const url = `/lang/lang_${code}.json`
  await window.fetch(url)
    .then(res => res.json())
    .then(out => addLanguage(code, out))
    .catch(err => { throw err })
}

async function loadTranslation () { // eslint-disable-line no-unused-vars
  return Promise.all([
    getl10n('en'),
    getl10n('es'),
    getl10n('de'),
    getl10n('cn'),
    getl10n('ko'),
    getl10n('pt'),
    getl10n('ru'),
    getl10n('sh'),
    getl10n('pl'),
    getl10n('fr'),
    getl10n('ja'),
    getl10n('cs'),
    getl10n('it'),
    getl10n('el'),
    getl10n('oc'),
    getl10n('uk')
  ]).then(() => {
    console.log(i18n)

    langElements.forEach((element) => {
      const value = element.getAttribute('data-i18n')
      element.innerHTML = i18n.getString(value)
    })
    if (langPicker) {
      langPicker.onchange = function () {
        const language = langPicker.options[langPicker.selectedIndex].value
        setCookie('lang', language, 5)
        window.location.reload()
      }
    }
  })
}

function delayPromise (duration) { // eslint-disable-line no-unused-vars
  return function (...args) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(...args)
      }, duration)
    })
  }
}
