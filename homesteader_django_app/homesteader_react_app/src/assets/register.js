

document.addEventListener('DOMContentLoaded', () => {
  const passwordMatch = document.getElementById('password-match')
  const password = document.getElementById('password')
  const submitButton = document.getElementById('submit')

  document.body.addEventListener('keyup', () => {
    if (passwordMatch.value === password.value && password.value != '') {
      submitButton.removeAttribute('disabled')
    } else {
      submitButton.setAttribute('disabled', true)
    }
  });
})

