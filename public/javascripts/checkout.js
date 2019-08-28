var stripe = Stripe('pk_test_h9nNgwGzcXBiMt8RomGKnz5T00Bs9iZjhN')
var elements = stripe.elements()
var cardElement = document.getElementById('card-element')
var form = document.getElementById('payment-form')

var card = elements.create('card')
card.mount(cardElement)

card.addEventListener('change', function (event) {
  var displayError = document.getElementById('card-errors')
  if (event.error) {
    displayError.textContent = event.error.message
    displayError.hidden = false
  } else {
    displayError.textContent = ''
    displayError.hidden = true
  }
})

form.addEventListener('submit', function (event) {
  event.preventDefault()

  stripe.createToken(card).then(function (result) {
    if (result.error) {
      var errorElement = document.getElementById('card-errors')
      errorElement.textContent = result.error.messages
    } else {
      stripeTokenHandler(result.token)
    }
  })
})

function stripeTokenHandler (token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('payment-form')
  var hiddenInput = document.createElement('input')
  hiddenInput.setAttribute('type', 'hidden')
  hiddenInput.setAttribute('name', 'stripeToken')
  hiddenInput.setAttribute('value', token.id)
  form.appendChild(hiddenInput)

  // Submit the form
  form.submit()
}
