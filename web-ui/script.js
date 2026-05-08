const API_BASE_URL = 'http://127.0.0.1:5000';

document.addEventListener('DOMContentLoaded', () => {
    fetchOptions();

    const form = document.getElementById('predictionForm');
    form.addEventListener('submit', handlePredict);
});

async function fetchOptions() {
    try {
        const response = await fetch(`${API_BASE_URL}/options`);
        if (!response.ok) throw new Error('Failed to fetch options');

        const options = await response.json();

        // Map of form IDs to API keys
        const fields = {
            'job_title': options.job_title,
            'education_level': options.education_level,
            'industry': options.industry,
            'company_size': options.company_size,
            'location': options.location,
            'remote_work': options.remote_work
        };

        for (const [id, values] of Object.entries(fields)) {
            const select = document.getElementById(id);
            if (!select) continue;

            values.forEach(val => {
                const opt = document.createElement('option');
                opt.value = val;
                opt.textContent = val;
                select.appendChild(opt);
            });
        }
    } catch (error) {
        console.error('Error fetching options:', error);
        showError('Could not load menu options. Please ensure the backend server is running.');
    }
}

const CURRENCY_MAP = {
    'India': { locale: 'en-IN', currency: 'INR', rate: 83.32 },
    'USA': { locale: 'en-US', currency: 'USD', rate: 1.0 },
    'UK': { locale: 'en-GB', currency: 'GBP', rate: 0.79 },
    'Germany': { locale: 'de-DE', currency: 'EUR', rate: 0.93 },
    'Netherlands': { locale: 'nl-NL', currency: 'EUR', rate: 0.93 },
    'Australia': { locale: 'en-AU', currency: 'AUD', rate: 1.51 },
    'Canada': { locale: 'en-CA', currency: 'CAD', rate: 1.36 },
    'Singapore': { locale: 'en-SG', currency: 'SGD', rate: 1.34 },
    'Sweden': { locale: 'sv-SE', currency: 'SEK', rate: 10.74 },
    'Remote': { locale: 'en-US', currency: 'USD', rate: 1.0 }
};

async function handlePredict(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');
    const loader = document.getElementById('loader');
    const btnText = document.getElementById('btnText');
    const resultContainer = document.getElementById('resultContainer');
    const salaryValue = document.getElementById('salaryValue');
    const errorMsg = document.getElementById('errorMsg');

    // Reset UI
    errorMsg.style.display = 'none';
    resultContainer.classList.remove('active');

    // Set loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    loader.style.display = 'block';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Get selected location for currency formatting
    const location = data.location;
    const currencyInfo = CURRENCY_MAP[location] || CURRENCY_MAP['USA'];

    // Convert numeric fields
    const numericFields = ['experience_years', 'skills_count', 'certifications'];
    numericFields.forEach(field => {
        if (data[field]) data[field] = parseFloat(data[field]);
    });

    try {
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Prediction failed');
        }

        const result = await response.json();
        const baseSalary = result.salary;
        const convertedSalary = baseSalary * currencyInfo.rate;

        // Show result with appropriate locale and currency
        salaryValue.textContent = new Intl.NumberFormat(currencyInfo.locale, {
            style: 'currency',
            currency: currencyInfo.currency,
            maximumFractionDigits: 0
        }).format(convertedSalary);

        resultContainer.classList.add('active');
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (error) {
        console.error('Prediction error:', error);
        showError(error.message);
    } finally {
        // Reset button
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        loader.style.display = 'none';
    }
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = `Error: ${msg}`;
    errorMsg.style.display = 'block';
}
