const randomizerForm = document.querySelector('.get-random');
const outputPlaceholder = document.querySelector('.output__placeholder');
const output = document.querySelector('.output');

function createRequestData(form) {
    if (validateForm(form)) {
        let min = +form.min.value,
            max = +form.max.value,
            countValues = +form.count.value > 0 ? +form.count.value : Math.abs(+form.count.value),
            unique = !form.unique.checked;
        return {
            "jsonrpc": "2.0",
            "method": "generateIntegers",
            "params": { "apiKey": "39cb3792-d3b4-426b-aa0d-3a37ebe01dd2", "n": countValues, "min": min, "max": max, "replacement": unique, "base": 10 },
            "id": Math.round(Math.random() * 100)
        }
    }
}

randomizerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    generateRandom();
})



function generateRandom() {
    let data = createRequestData(randomizerForm),
    request = fetch('https://api.random.org/json-rpc/2/invoke', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => {
        return res.json();
    }).then(res => {
        try {
            outputPlaceholder.innerText = res.result.random.data;
        } catch (error) {
            alert('Your request was not processed ');
        }
    }).catch(err => {
        console.log(data);
        console.log(err);
    })
}



function validateForm(form) {
    let min, max, count, validateMin, validateMax, validateCount;

    if (form && form.min && form.max && form.count) {
        min = form.min.value,
            max = form.max.value,
            count = form.count.value;
        const numberRegex = /^(?!0)\d+$/g;

        validateMin = function (minValue, maxValue) {
            if (minValue.match(numberRegex) && +minValue < +maxValue) {
                return true;
            } else { 
                if (+minValue > +maxValue) {
                    alert('Min value should be less than max value')
                } else {
                    alert('Min value is incorrect');
                }
            }
        }
        validateMax = function (minValue, maxValue) {
            if (maxValue.match(numberRegex) && +maxValue > +minValue) {
                return true;
            } else {
                if (+minValue > +maxValue) {
                    alert('Max value should be greaterr than max value')
                } else {
                    alert('Max value is incorrect');
                }
            }
        }
        validateCount = function (minValue, maxValue, count) {
            if (count.match(numberRegex)) {
                return true;
            } else {
                alert('Count value is incorrect');
            }
        }
    }
    return validateMin(min, max) && validateMax(min, max) && validateCount(min, max, count);
}
