const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PHONE_REGEX = /^[0-9-_() +.# ]*$/
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%?&*]).{8,}$/
// const URL_REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$/;

export default ({ app }, inject) => {
  inject('rules', {
    required: value => !!value || 'Required',
    emailOrPhone: (value) => {
      return !value || EMAIL_REGEX.test(value) || PHONE_REGEX.test(value) || app.i18n.t('app.rules.emailOrPhone')
    },
    email: (value) => {
      if (!value) { return true }
      if (!EMAIL_REGEX.test(value)) { return 'Invalid Email' }
      if (!value.endsWith('@fpt.edu.vn')) { return 'Email must belong to @fpt.edu.vn domain' }
      return true
    },
    emailTemp: (value) => {
      if (!value) { return true }
      if (!EMAIL_REGEX.test(value)) { return 'Invalid Email' }
      return true
    },
    phone: (value) => {
      return !value || PHONE_REGEX.test(value) || 'Invalid Phone'
    },
    password: (value) => {
      return !value || PASSWORD_REGEX.test(value) || 'Invalid Password'
    }
    // url: (value) => {
    // return !value || URL_REGEX.test(value) || app.i18n.t("app.rules.url");
    // }
  })
}
