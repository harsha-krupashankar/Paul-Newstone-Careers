var displayedJobCount = 0;
var nextPageUrl = '';
var totalCount = 0;
var scrollCount = 0;
var endOfPageMessageDisplayed = false;
var initialData = {}
var initialTotalCount = 0;


// To add overlay on the background image on scroll
let headerBg = document.getElementById("bg");
window.addEventListener("scroll", function () {
    headerBg.style.opacity = 1 - +window.pageYOffset / 550 + "";
    headerBg.style.top = +window.pageYOffset + "px";
});


// Function to check if an element is in the viewport with an offset
function isInViewport(element, offset) {
    var rect = element.getBoundingClientRect();
    var windowHeight = window.innerHeight || document.documentElement.clientHeight;
    var windowWidth = window.innerWidth || document.documentElement.clientWidth;

    // Adjust the top and bottom boundaries with the offset
    var topBound = 0 - offset;
    var bottomBound = windowHeight + offset;

    return (
        rect.top >= topBound &&
        rect.left >= 0 &&
        rect.bottom <= bottomBound &&
        rect.right <= windowWidth
    );
}

// Function to add the slide-up class to job cards in the viewport with an offset
function animateJobCards() {
    var jobCards = document.getElementsByClassName('job-card');
    var offset = 150; // Adjust the offset value as needed

    for (var i = 0; i < jobCards.length; i++) {
        if (isInViewport(jobCards[i], offset)) {
            jobCards[i].classList.add('slide-up');
        }
    }

    // Increment scrollCount on each scroll event

    // Check if user has reached the end of the page and still scrolling
    if (isEndOfPage()) {
        scrollCount++;
    }
}

// Function to check if user has reached the end of the pag
function isEndOfPage() {
    var scrollPosition = window.innerHeight + window.pageYOffset;
    var bodyHeight = document.body.offsetHeight;
    var threshold = 100; // Adjust the threshold value as needed

    return scrollPosition >= bodyHeight - threshold;
}

// Function to show end of page message
function showEndOfPageMessage() {
    var endOfPageMessage = document.createElement('div');
    endOfPageMessage.classList.add('end-of-page-message');
    endOfPageMessage.innerHTML = 'You have reached the end of the page.';
    document.body.appendChild(endOfPageMessage);
}

// Add event listener to animate job cards on scroll
window.addEventListener('scroll', animateJobCards);
window.addEventListener('resize', animateJobCards);


// Animate job cards on initial page load
animateJobCards();

async function makeApiCall(url) {
    // showLoader();
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function createJobCards(data) {
    hideLoader();
    // Get the job-cards container
    var jobCardsContainer = document.querySelector('.job-cards');

    // Loop through the data array
    data["data"].forEach(function (job) {
        // Extract job name without the content inside parentheses
        var jobName = job.name.replace(/\s*\([^)]*\)\s*/g, '');
        var icon = '';

        // Get department value and convert to lowercase
        var department = job.custom_fields.find(field => field.field_id === '4').value.toLowerCase();

        // Create a new job card element
        var jobCard = document.createElement('div');
        jobCard.classList.add('job-card');

        // Create anchor tag
        var jobCardAnchor = document.createElement('a');
        jobCardAnchor.href = `/apply.html?job_id=${job.job_id}`;
        jobCardAnchor.classList.add('job-card-anchor');
        jobCardAnchor.target = '_blank';

        // Add department-specific class to the job card
        if (department === 'office support') {
            jobCard.classList.add('card-office-support');
            icon = 'ph-archive';
        } else if (department === 'finance & accounting') {
            jobCard.classList.add('card-finance-accounting');
            icon = 'ph-wallet';
        } else if (department === 'human resources') {
            jobCard.classList.add('card-human-resource');
            icon = 'ph-users';
        } else if (department === 'sales') {
            jobCard.classList.add('card-sales-marketing');
            icon = 'ph-chart-line-up';
        }

        // Add the job card HTML content
        jobCard.innerHTML = `
                    <div class="info-div">
                        <div class="job-name">
                            <h4 class="job-name-text">${jobName}</h4>
                        </div>
                        <div class="job-info">
                            <div class="location">
                                <i class="ph ph-globe-hemisphere-west"></i>
                                <p>${job.city} - ${job.country}</p>
                            </div>
                            <div class="division">
                                <i class="ph ${icon}"></i>
                                <p>${job.custom_fields.find(field => field.field_id === '4').value}</p>
                            </div>
                        </div>
                    </div>
                    <div class="btn-div">
                        <div class="apply-btn text-center">
                        <a type="button" target="_blank" href="/apply.html?job_id=${job.job_id}" class="custom-btn btn--outline-black btn-block">Apply</a>
                        </div>
                    </div>
                    `;

        // ${job.custom_fields.find(field => field.field_name === 'Industry' && field.value !== 'None') ? `
        //     <div class="industry">
        //     <i class="ph ph-factory"></i>
        //     <p>${job.custom_fields.find(field => field.field_name === 'Industry').value}</p>
        //     </div>
        // ` : ''}

        // Append the job card to the job-cards container
        jobCardAnchor.appendChild(jobCard);
        jobCardsContainer.appendChild(jobCardAnchor);
    });
    displayedJobCount += data.count;


    // Add .view-more div if 'next_page_url' exists
    if (data.hasOwnProperty('next_page_url') && data.next_page_url != null && !document.querySelector('.view-more')) {
        var viewMoreContainer = document.createElement('div');
        viewMoreContainer.classList.add('view-more');
        viewMoreContainer.innerHTML = `
                    <button type="button" class="custom-btn btn--outline-black view-more-btn"  onclick="fetchNextPageJobs()">View More</button>
                `;
        jobCardsContainer.appendChild(viewMoreContainer);

        nextPageUrl = data.next_page_url;
    } else {
        if (scrollCount >= 30 && !document.querySelector('.view-more') && !endOfPageMessageDisplayed) {
            showEndOfPageMessage();
            endOfPageMessageDisplayed = true;
        }
    }
    updateNumbers();
}

function clearJobCards() {
    // Get the job-cards container
    var jobCardsContainer = document.querySelector('.job-cards');

    // Remove all child elements
    while (jobCardsContainer.firstChild) {
        jobCardsContainer.removeChild(jobCardsContainer.firstChild);
    }

    // Reset the displayedJobCount variable
    displayedJobCount = 0;

    // Reset the nextPageUrl variable
    nextPageUrl = null;

    // Reset the scrollCount variable
    scrollCount = 0;

    // Reset the endOfPageMessageDisplayed variable
    endOfPageMessageDisplayed = false;
}

function updateNumbers() {
    document.querySelector('#displayedJobsCount').innerHTML = displayedJobCount
    document.querySelector('#totalJobsCount').innerHTML = totalCount
}

function updateAdditionalInfo(data) {
    hideLoader();
    totalCount = data.total_count;
    updateNumbers();

    cityArray = [];
    countryArray = [];
    divisionArray = [];
    industryArray = [];

    data["unique_values"].forEach(function (item) {
        if (JSON.parse(item).hasOwnProperty('city')) {
            cityArray.push(JSON.parse(item).city.S);
        }
        if (JSON.parse(item).hasOwnProperty('country')) {
            countryArray.push(JSON.parse(item).country.S);
        }
        if (JSON.parse(item).hasOwnProperty('custom_field[4]')) {
            divisionArray.push(JSON.parse(item)['custom_field[4]']);
        }
        if (JSON.parse(item).hasOwnProperty('custom_field[5]')) {
            industryArray.push(JSON.parse(item)['custom_field[5]']);
        }
    });

    countryArray.forEach(function (item) {
        var listElement = document.createElement("li");
        inputId = generateIds(item);
        listElement.innerHTML = `
                    <div class="dropdown-option">
                        <input class="form-check-input" type="checkbox" value="${item}" id="${inputId}">
                        <label class="form-check-label" for="${inputId}">
                            ${item}
                        </label>
                    </div>`;
        document.getElementById("countryDropdownValues").appendChild(listElement);
    });

    cityArray.forEach(function (item) {
        var listElement = document.createElement("li");
        inputId = generateIds(item);
        listElement.innerHTML = `
                    <div class="dropdown-option">
                        <input class="form-check-input" type="checkbox" value="${item}" id="${generateIds(item)}">
                        <label class="form-check-label" for="flexCheckDefault">
                            ${item}
                        </label>
                    </div>`;
        document.getElementById("cityDropdownValues").appendChild(listElement);
    });

    divisionArray.forEach(function (item) {
        var listElement = document.createElement("li");
        inputId = generateIds(item);
        listElement.innerHTML = `
                    <div class="dropdown-option">
                        <input class="form-check-input" type="checkbox" value="${item}" id="${inputId}">
                        <label class="form-check-label" for="${inputId}">
                            ${item}
                        </label>
                    </div>`;
        document.getElementById("departmentDropdownValues").appendChild(listElement);
    });

    industryArray.forEach(function (item) {
        var listElement = document.createElement("li");
        inputId = generateIds(item);
        listElement.innerHTML = `
                    <div class="dropdown-option">
                        <input class="form-check-input" type="checkbox" value="${item}" id="${inputId}">
                        <label class="form-check-label" for="${inputId}">
                            ${item}
                        </label>
                    </div>`;
        document.getElementById("industryDropdownValues").appendChild(listElement);
    });
}

function fetchNextPageJobs() {
    var viewMoreDiv = document.querySelector('.view-more');
    if (viewMoreDiv) {
        viewMoreDiv.parentNode.removeChild(viewMoreDiv);
    }
    makeApiCall(nextPageUrl)
        .then(data => {
            createJobCards(data);
            animateJobCards();
        })
        .catch(error => {
            console.error(error);
        });

    createJobCards(nextPageResponse);
}

function generateIds(inputString) {
    var words = inputString.split(' ');
    var convertedString = words.map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join('');
    return convertedString;
}

// Call the combined function to fetch jobs and create job cards
makeApiCall('https://solutions-test.recruitcrm.io/jobs/20390?limit=10&keys=custom_field[4],custom_field[5]')
    .then(data => {
        initialData = data;
        createJobCards(initialData);
        makeApiCall('https://solutions-test.recruitcrm.io/jobs/additional-info/20390?keys=custom_field[4],custom_field[5],city,country')
            .then(data => {
                updateAdditionalInfo(data);
                initialTotalCount = data.total_count;
            })
            .catch(error => {
                console.error(error);
            });
    })
    .catch(error => {
        console.error(error);
    });

searchParams = ''

function filter() {

    hideNoJobsMessage();
    filterObject = {};

    var searchValue = document.querySelector('.search-box').value;
    if (searchValue != '') {
        filterObject['search_keyword'] = searchValue;
    }

    var checkboxes = document.querySelectorAll('#departmentDropdownValues input[type="checkbox"]:checked');
    var departmentsSelected = Array.from(checkboxes).map(function (checkbox) {
        return checkbox.value;
    });
    if (departmentsSelected.length > 0) {
        filterObject['4'] = departmentsSelected.toString();
    }

    var checkboxes = document.querySelectorAll('#industryDropdownValues input[type="checkbox"]:checked');
    var industriesSelected = Array.from(checkboxes).map(function (checkbox) {
        return checkbox.value;
    });
    if (industriesSelected.length > 0) {
        filterObject['5'] = industriesSelected.toString();
    }

    var checkboxes = document.querySelectorAll('#cityDropdownValues input[type="checkbox"]:checked');
    var citiesSelected = Array.from(checkboxes).map(function (checkbox) {
        return checkbox.value;
    });
    if (citiesSelected.length > 0) {
        filterObject['city'] = citiesSelected.toString();
    }

    var checkboxes = document.querySelectorAll('#countryDropdownValues input[type="checkbox"]:checked');
    var countriesSelected = Array.from(checkboxes).map(function (checkbox) {
        return checkbox.value;
    });
    if (countriesSelected.length > 0) {
        filterObject['country'] = countriesSelected.toString();
    }


    searchParams = generateSearchParams(filterObject);


    makeApiCall('https://solutions-test.recruitcrm.io/jobs/search/20390' + searchParams + '&keys=custom_field[4],custom_field[5]')
        .then(data => {
            clearJobCards();
            if (data.data.length > 0) {
                showLoader();
                createJobCards(data);
                totalCount = data.total_count;
                updateNumbers();
                addResetFilterButton();
                animateJobCards();
            } else {
                showNoJobsMessage();
            }
        })
        .catch(error => {
            console.error(error);
        });
}

function generateSearchParams(filterObject) {
    var param = '?';
    var customFields = '';
    var customFieldPram = ''
    for (key in filterObject) {
        if (!isNaN(key)) {
            customFields += `{"field_id": ${Number(key)},"filter_type": "equals","value": "${filterObject[key]}"},`
        } else {
            param += key + '=' + filterObject[key] + '&';
        }
    }
    if (customFields != '') {
        customFieldPram = `custom_field=[` + encodeURIComponent(customFields.substring(0, customFields.length - 1)) + `]`
    }
    return param + customFieldPram;
}

function showLoader() {
    // Create a loader div element
    var loaderDiv = document.createElement('div');
    loaderDiv.classList.add('loader');

    // Add the loader HTML content
    loaderDiv.innerHTML = `
                <div class="spinner"></div>
            `;

    // Get the job-cards container
    var jobCardsContainer = document.querySelector('.job-cards');

    // Clear the job-cards container
    jobCardsContainer.innerHTML = '';

    // Append the loader div to the job-cards container
    jobCardsContainer.appendChild(loaderDiv);
}


function hideLoader() {
    // Remove the loader div from the document body
    var loaderDiv = document.querySelector('.loader');
    if (loaderDiv) {
        loaderDiv.remove();
    }
}

function showNoJobsMessage() {
    displayedJobCount = 0;
    updateNumbers();
    // Create the div for the "No jobs found" message
    var noJobsDiv = document.createElement('div');
    noJobsDiv.classList.add('no-jobs-message');
    noJobsDiv.innerHTML = '<h3>No jobs found</h3>';

    // Append the div to the job-cards container
    var jobCardsContainer = document.querySelector('.job-cards');
    jobCardsContainer.appendChild(noJobsDiv);
}

function hideNoJobsMessage() {
    // Remove the "No jobs found" message div
    var noJobsDiv = document.querySelector('.no-jobs-message');
    if (noJobsDiv) {
        noJobsDiv.remove();
    }
}

function addResetFilterButton() {

    var isResetButton = document.querySelector('.reset-filter-btn');
    if (isResetButton) {
        isResetButton.style.display = 'block';
        return;
    }
    // Create the reset filter button element
    var resetButton = document.createElement('button');
    resetButton.classList.add('custom-btn', 'btn--outline-black', 'reset-filter-btn');
    resetButton.textContent = 'Reset Filters';

    // Add event listener to the reset button
    resetButton.addEventListener('click', resetFilters);

    // Insert the reset button after the jobs-count div
    var jobsCountDiv = document.querySelector('.jobs-count');
    jobsCountDiv.append(resetButton);

    resetButton.classList.add('bounce-animation');
}

function resetFilters() {
    debugger
    var resetButton = document.querySelector('.reset-filter-btn');
    if (resetButton) {
        resetButton.style.display = 'none';
    }

    var checkboxes = document.querySelectorAll('.form-check-input');

    checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
    });

    document.querySelector('.search-box').value = '';


    clearJobCards();
    totalCount = initialTotalCount;
    createJobCards(initialData);
    animateJobCards();
}

