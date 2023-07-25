var jobId = "";
// Data Module
const DataModule = (() => {
    // const urlParams = new URLSearchParams(window.location.search);
    let job = {};
    let accountId = 20390;
    const allowDuplicates = "False";
    let SOLUTION_API_BASE_URL = "https://solutions-test.recruitcrm.io";

    const getJobById = async () => {
        try {
            const response = await fetch(
                `${SOLUTION_API_BASE_URL}/jobs/by-id/${accountId}?job_id=${jobId}`
            );
            const data = await response.json();
            job = data;
            return data;
        } catch (error) {
            console.log("Error fetching job data:", error);
            return [];
        }
    };

    const applyToJob = async (candidateData) => {
        let applyUrl = SOLUTION_API_BASE_URL + "/candidates/apply-job/";
        applyUrl += accountId;
        applyUrl += "?job_slug=" + job.job_slug;
        applyUrl += "&allow_duplicates=" + allowDuplicates;
        applyUrl += "&updated_by=" + job.owner;
        const objTemp = {
            first_name: candidateData.firstname,
            last_name: candidateData.lastname,
            email: candidateData.email,
            contact_number: candidateData.phone,
            city: candidateData.city,
            source: "website",
        };

        let candidate = new FormData();

        candidate.append("candidate_data", JSON.stringify(objTemp));
        candidate.append("candidate_resume", candidateData.resume);

        console.log(applyUrl);
        console.log(Object.fromEntries(candidate));

        //   try {
        //     const response = await fetch(applyUrl);
        //     const data = await response.json();
        //     return data;
        //   } catch (error) {
        //     console.log('Error occured:', error);
        //     return
        //   }
    };

    return {
        getJobById,
        applyToJob,
    };
})();

// UI Module
const UIModule = (() => {
    const jobName = document.querySelector(".job-name");
    const jobLocation = document.querySelector("#job-location");
    // const jobType = document.querySelector('#job-type');
    const jobDepartment = document.querySelector("#job-department");
    const jobIndustry = document.querySelector("#job-industry");
    const jobDescriptionContainer = document.querySelector(".job-description");
    const modal = document.getElementById("myModal");
    const modalHeader = document.querySelector(".modal-header");
    const modalBody = document.querySelector(".modal-body");

    const startLoading = () => {
        const loading = document.getElementById("loading");
        loading.style.opacity = "1";
        loading.style.display = "block";
    };

    const stopLoading = () => {
        const loading = document.getElementById("loading");
        loading.style.opacity = "0";
        setTimeout(function () {
            loading.style.display = "none";
        }, 300);
    };

    const startSubmitLoading = () => {
        const loading = document.getElementById("submit-loading");
        loading.style.opacity = "1";
        loading.style.display = "flex";
    };

    const stopSubmitLoading = () => {
        const loading = document.getElementById("submit-loading");
        loading.style.opacity = "0";
        setTimeout(function () {
            loading.style.display = "none";
        }, 300);
    };

    const paintJobDetailsViewer = (job) => {
        jobName.innerHTML = job.name?.replace(/\s*\([^)]*\)\s*/g, "");
        jobLocation.innerHTML =
            '<i class="ph ph-globe-hemisphere-east icon"></i>' +
            job.city +
            " - " +
            job.country;
        // jobType.innerHTML = '<i class="ph ph-briefcase icon"></i>' + job.job_type
        jobIndustry.innerHTML =
            '<i class="ph ph-factory icon"></i>' +
            job.custom_fields?.find((field) => field.field_name === "Industry")
                .value;
        jobDescriptionContainer.innerHTML = job.job_description_text;

        let department = job.custom_fields
            ?.find((field) => field.field_id === "4")
            .value.toLowerCase();
        let icon = "ph-buildings";
        if (department === "office support") {
            icon = "ph-archive";
        } else if (department === "finance & accounting") {
            icon = "ph-wallet";
        } else if (department === "human resources") {
            icon = "ph-users";
        } else if (department === "sales") {
            icon = "ph-chart-line-up";
        }
        jobDepartment.innerHTML =
            `<i class="ph ${icon} icon"></i>` + department;
    };

    const jobNotFound = () => {
        document.getElementById("parent-container").innerHTML =
            '<div id="lottie-container"></div>';
        const animationContainer = document.getElementById("lottie-container");
        const animationData = "./animation.json";

        const animation = lottie.loadAnimation({
            container: animationContainer,
            renderer: "canvas", // You can choose 'svg', 'canvas', or 'html'
            loop: true,
            autoplay: true,
            path: animationData,
        });

        const info = document.createElement("div");
        info.className = "info-secondary";
        document.getElementById("parent-container").appendChild(info);

        //heading
        let closedHeading = document.createElement("h1");
        closedHeading.textContent = "Job is Closed";
        closedHeading.className = "job-closed-heading";
        info.appendChild(closedHeading);

        //text
        let closedText = document.createElement("div");
        closedText.className = "info-secondary-text";

        let line1 = document.createElement("p");
        line1.textContent =
            "We're sorry, but the job you were looking for has been filled.";
        line1.className = "closed-text";
        closedText.appendChild(line1);

        let line2 = document.createElement("p");
        line2.textContent = "Thank you for your interest.";
        line2.className = "closed-text";
        closedText.appendChild(line2);

        info.appendChild(closedText);

        //button
        const button = document.createElement("button");

        // Set the button attributes
        button.setAttribute("type", "button");
        button.setAttribute("class", "custom-btn btn-submit");
        button.setAttribute("title", "Back");
        button.setAttribute("id", "back-button-top");
        button.onclick = () => {
            window.location = "/index.html";
        };

        // Set the button text
        button.innerText = "Back";
        info.appendChild(button);
    };

    const thankYou = () => {
        document.getElementById("parent-container").innerHTML =
            '<div id="lottie-container"></div>';
        const animationContainer = document.getElementById("lottie-container");
        const animationData = "./thankyou.json";

        const animation = lottie.loadAnimation({
            container: animationContainer,
            renderer: "canvas", // You can choose 'svg', 'canvas', or 'html'
            loop: false,
            autoplay: true,
            path: animationData,
        });

        const info = document.createElement("div");
        info.className = "info-secondary";
        document.getElementById("parent-container").appendChild(info);

        //heading
        let closedHeading = document.createElement("h1");
        closedHeading.textContent = "Thank you for Applying";
        closedHeading.className = "job-closed-heading";
        info.appendChild(closedHeading);

        //text
        let closedText = document.createElement("div");
        closedText.className = "info-secondary-text";

        let line1 = document.createElement("p");
        line1.textContent =
            "Your application has been received and is being carefully reviewed.";
        line1.className = "closed-text";
        closedText.appendChild(line1);

        let line2 = document.createElement("p");
        line2.textContent =
            " We appreciate your interest and will be in touch soon.";
        line2.className = "closed-text";
        closedText.appendChild(line2);

        info.appendChild(closedText);

        //button
        const button = document.createElement("button");

        // Set the button attributes
        button.setAttribute("type", "button");
        button.setAttribute("class", "custom-btn btn-submit");
        button.setAttribute("title", "Back");
        button.setAttribute("id", "back-button-top");
        button.onclick = () => {
            window.location = "/index.html";
        };

        // Set the button text
        button.innerText = "Back";
        info.appendChild(button);
    };

    const showModal = (e) => {
        e.preventDefault();

        if (e.target.id == "eeop") {
            modalHeader.textContent = "Equal Employment Opportunity Policy";
            modalBody.innerHTML = `<p>Equal Employment Opportunity Policy here</p>`;
        }
        if (e.target.id == "terms") {
            modalHeader.textContent = "Candidate Terms";
            modalBody.innerHTML = `<p>
        Application Submission: By submitting your application, you agree to provide accurate and truthful information about yourself. Any false or misleading information may result in the rejection of your application or termination of employment, if applicable.
Privacy and Data Handling: We respect your privacy and handle your personal data in accordance with applicable privacy laws and our privacy policy. Your information will be used solely for recruitment purposes and will not be shared with any third parties without your consent.
</p>`;
        }
        modal.style.display = "block";
    };

    const hideModal = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    const closeModal = () => {
        modal.style.display = "none";
    };

    return {
        startLoading,
        stopLoading,
        startSubmitLoading,
        stopSubmitLoading,
        paintJobDetailsViewer,
        jobNotFound,
        thankYou,
        showModal,
        hideModal,
        closeModal,
    };
})();

// Event Module
const EventModule = ((dataModule, uiModule) => {
    const applyBtnTop = document.getElementById("apply-button-top");
    const backBtnTop = document.getElementById("back-button-top");
    const submitBtn = document.getElementById("form-submit");
    const applyForm = document.querySelector(".form");
    const formInputs = document.querySelectorAll("input");
    const descriptionContainer = document.querySelector(".job-description");
    const applyFormContainer = document.querySelector(".job-apply");
    const file = document.getElementById("file");
    const cards = document.querySelectorAll(".info-card");
    const card1 = document.querySelector(".info-card.result");
    const card2 = document.querySelector(".info-card.list");
    const card3 = document.querySelector(".info-card.contact");
    const openModalBtns = document.querySelectorAll(".modal-btn");
    const closeBtn = document.getElementsByClassName("close")[0];

    const showApplyForm = (entries, observe) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("section_hidden");
        // observe.unobserve(entry.target);
    };

    const slideBottomUp = (entries, observe) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("section_hidden");
        observe.unobserve(entry.target);
    };

    const applicationFormObserver = new IntersectionObserver(showApplyForm, {
        root: null,
        threshold: 0.3,
    });

    const informationCard1Observer = new IntersectionObserver(slideBottomUp, {
        root: null,
        threshold: 0.05,
    });

    const informationCard2Observer = new IntersectionObserver(slideBottomUp, {
        root: null,
        threshold: 0.05,
    });

    const informationCard3Observer = new IntersectionObserver(slideBottomUp, {
        root: null,
        threshold: 0.05,
    });

    const fetchJobId = (event) => {
        return event.data.id;
    };

    const handlePageLoad = async () => {
        uiModule.startLoading();

        const job = await dataModule.getJobById();
        uiModule.stopLoading();
        if (job.job_id) {
            uiModule.paintJobDetailsViewer(job);
        } else {
            //closed job code
            UIModule.jobNotFound();
        }

        document.body.style.overflow = "auto";
        applyFormContainer.classList.add("section_hidden");
        document
            .querySelectorAll(".tag")
            .forEach((tag) => tag.classList.add("bottom-up"));
        descriptionContainer.classList.add("bottom-up");
        formInputs.forEach((input) => {
            input.addEventListener("input", removeErrorMessage);
        });
    };

    const removeErrorMessage = (e) => {
        if (e.target.id == "candidate-terms") {
            if (e.target.checked == true) {
                e.target.nextElementSibling.nextElementSibling.className =
                    "small-text terms-warning hidden";
            } else {
                e.target.nextElementSibling.nextElementSibling.className =
                    "small-text terms-warning";
            }
            return;
        }
        e.target.nextElementSibling.nextElementSibling.className =
            "small-text hidden";
        e.target.classList.remove("danger");
    };

    const handleApplyBtnTopClick = () => {
        applyFormContainer.scrollIntoView({ behavior: "smooth" });
    };

    const handleBackBtnTopClick = () => {
        window.location = "/index.html";
    };

    const isEmailValid = () => {
        const EMAIL_FORMAT = /^\w+([\.-]?\w+)*@[a-z0-9.-]+\.[a-z]{2,5}$/;
        const email = document.getElementById("email");
        const errorLabel = email.nextElementSibling.nextElementSibling;
        const trimmedEmail = email.value.trim();

        if (trimmedEmail === "") {
            errorLabel.textContent = "Email field is required";
            errorLabel.className = "small-text";
            email.classList.add("danger");
            return false;
        }

        if (!EMAIL_FORMAT.test(trimmedEmail)) {
            errorLabel.textContent = "Email format is invalid";
            errorLabel.className = "small-text";
            email.classList.add("danger");
            return false;
        }

        return true;
    };

    const validateResume = () => {
        const file = document.getElementById("file");
        const fileNameHolder = document.querySelector(".file-name");
        const fileInput = document.querySelector(".resume-file-input");
        const errorLabel = file.nextElementSibling.nextElementSibling;

        if (file.value === "") {
            errorLabel.textContent = "Resume field is required";
            errorLabel.className = "small-text";
            fileInput.classList.add("danger");
            fileNameHolder.textContent = "";
            return false;
        }

        resume = file.files[0];
        const fileMb = resume.size / 1024 ** 2;
        if (fileMb > 8) {
            errorLabel.textContent = "Resume size should be less than 8MB";
            errorLabel.className = "small-text";
            fileInput.classList.add("danger");
            fileNameHolder.textContent = "";
            return false;
        } else {
            fileNameHolder.textContent = resume.name; // resume.name.length > 30 ? resume.name.slice(0, 15) + '...' + resume.name.slice(-8) : resume.name;
            fileInput.classList.remove("danger");
            fileNameHolder.className = "file-name";
        }

        return true;
    };

    const validateInput = (inputId) => {
        const input = document.getElementById(inputId);
        if (input.value == "") {
            input.nextElementSibling.nextElementSibling.className =
                "small-text";
            inputId != "file" && input.classList.add("danger");
            return false;
        }
        return true;
    };

    const handleSubmitBtnClick = async (e) => {
        debugger;
        e.preventDefault();
        const jobApplicationForm = new FormData(applyForm);
        const objCandidate = Object.fromEntries(jobApplicationForm);
        const formInputs = Array.from(
            document.querySelectorAll('input[name]:not([name="resume"])')
        );
        let isValid = true;

        formInputs.forEach((input) => {
            input.value = input.value.trim();
        });

        const formFields = {
            firstname: validateInput("firstName"),
            lastname: validateInput("lastName"),
            // file: validateResume(),
            email: isEmailValid(),
        };

        isValid = !Object.values(formFields).includes(false);

        if (!isValid) {
            for (let key in formFields) {
                if (formFields[key] == false) {
                    document
                        .getElementById(key)
                        .scrollIntoView({ behavior: "smooth", block: "start" });
                    return;
                }
            }
            return;
        }

        //candidate terms check
        console.log(document.getElementById("candidate-terms").checked);
        if (document.getElementById("candidate-terms").checked == false) {
            document.querySelector(".terms-warning").classList.remove("hidden");
            return;
        }

        //handle form submit
        console.log(objCandidate);
        uiModule.thankYou();
        return;
        uiModule.startSubmitLoading();
        document.body.style.overflow = "hidden";
        // const submitResponse = await dataModule.applyToJob(objCandidate);
        document.body.style.overflow = "suto";
        // uiModule.stopSubmitLoading();
        // uiModule.thankYou();
        // if(submitResponse && submitResponse.status == 201) {
        //     uiModule.thankYou();
        // }else{
        //     console.log('Error: ' + submitResponse);
        // }
    };

    return {
        init: () => {
            handlePageLoad();
            // window.addEventListener('DOMContentLoaded', handlePageLoad);
            cards.forEach((card) => card.classList.add("section_hidden"));
            

            applyBtnTop.addEventListener("click", handleApplyBtnTopClick);
            backBtnTop.addEventListener("click", handleBackBtnTopClick);
            submitBtn.addEventListener("click", handleSubmitBtnClick);
            submitBtn.addEventListener(
                "click",
                function (event) {
                    debugger;
                    if (!applyForm.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }

                    applyForm.classList.add("was-validated");
                },
                false
            );
            applicationFormObserver.observe(applyFormContainer);
            informationCard1Observer.observe(card1);
            informationCard2Observer.observe(card2);
            informationCard3Observer.observe(card3);
            file.addEventListener("change", validateResume);
            openModalBtns.forEach((btn) => {
                console.log(btn);
                btn.addEventListener("click", uiModule.showModal);
            });
            closeBtn.addEventListener("click", uiModule.closeModal);
            window.addEventListener("click", uiModule.hideModal);
        },
    };
})(DataModule, UIModule);

// window.onmessage = function (event) {
//     jobId = event.data;
//     EventModule.init();
// }

const urlParams = new URLSearchParams(window.location.search);
jobId = urlParams.get("job_id");
EventModule.init();

function showFileName(input) {
    const fileNameSpan = document.getElementById("file-name-span");
    if (input.files.length > 0) {
        fileNameSpan.textContent = input.files[0].name;
    } else {
        fileNameSpan.textContent = "";
    }
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    "use strict";
    debugger;

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll(".needs-validation");

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms).forEach(function (form) {});
})();

// Initialize the application
