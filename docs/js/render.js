(function () {
	"use strict";

	const frequencyPermission = u("#frequency-permission");
	if (u("#monthly").is(':checked')) {
		frequencyPermission.removeClass('hidden');
	} else {
		frequencyPermission.addClass('hidden');
	}
	u("#monthly").on('click', function(){
		frequencyPermission.removeClass('hidden');
	});
	u("#once").on('click', function(){
		frequencyPermission.addClass('hidden');
	});

	const amountCurrencySpan = u("span.amount-currency");
	const amountInput = u("#amount");

	if (u("#currency-euro").is(':checked')) {
		amountCurrencySpan.html('&euro;');
		amountInput.attr('placeholder', '€ ...');
	}
	if (u("#currency-dollar").is(':checked')) {
		amountCurrencySpan.html('&dollar;');
		amountInput.attr('placeholder', '$ ...');
	}

	u("#other-amount-label").on('click', function(){
		amountInput.removeClass('hidden');
		setTimeout(function () {
			amountInput.first().select();
		}, 0);
	});

	u(".amount-nr").on('click', function(){
		amountInput.addClass('hidden');
	});

	u("#currency-euro").on('click', function(){
		amountCurrencySpan.html('&euro;');
		amountInput.attr('placeholder', '€ ...');
	});

	u("#currency-dollar").on('click', function(){
		amountCurrencySpan.html('&dollar;');
		amountInput.attr('placeholder', '$ ...');
	});

	const getFormDataFromForm = () => {
		const data = new FormData(
			document.getElementById("donation")
		);

		return {
			isMonthly: data.get('frequency') === 'monthly',
			hasMonthlyPermission: data.get('monthly-permission') === 'on',
			projectCode: data.get('destination') === 'needed' ? 'FR000' : data.get('projectcode'),
			amount: data.get('amount') === 'other' ? data.get('other-amount') : data.get('amount'),
			currency: data.get('currency'),
			name: data.get('name'),
			email: data.get('email'),
			hasNewsletter: data.get('newsletter') === 'on',
		}
	}

	/**
	 * @param {Object} formData Form data to post
	 * @param {string} formData.name
	 * @param {string} formData.email
	 * @param {string} formData.projectcode
	 * @param {number} formData.bedrag
	 * @param {string} formData.currency EUR/USD
	 * @param {string} formData.periodiek once/maandelijks
	 */
	const postFormData = (formData) => {

		// The rest of this code assumes you are not using a library.
		// It can be made less verbose if you use one.
		const form = document.createElement('form');
		form.method = 'post';
		form.action = 'https://forerunner-info.appspot.com/donate';

		for (const key in formData) {
			if (formData.hasOwnProperty(key)) {
				const hiddenField = document.createElement('input');
				hiddenField.type = 'hidden';
				hiddenField.name = key;
				hiddenField.value = formData[key];

				form.appendChild(hiddenField);
			}
		}

		const submit = document.createElement('input');
		submit.type = 'submit';
		form.appendChild(submit);

		document.body.appendChild(form);
		form.submit();
	}

	u("#submit").on('click', function(){
		const formEl = document.getElementById("donation");
		if (!formEl.checkValidity()) {
			formEl.reportValidity();
			return;
		}

		const formData = getFormDataFromForm();
		postFormData({
			name: formData.name,
			email: formData.email,
			projectcode: formData.projectCode,
			bedrag: formData.amount,
			currency: formData.currency,
			periodiek: formData.isMonthly ? 'once' : 'maandelijks',
		})
	});

	//Show form
	u("#donation").removeClass('hidden');
})();