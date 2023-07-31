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
        applyUrl += 1;
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

        const response = await fetch(applyUrl, {
            method: "POST",
            body: candidate,
        });
        return response;
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
        document.getElementById("form-submit").classList.add("w-100");
        document.getElementById("submit").style.display = "none";
        document.getElementById("spinner").style.display = "inline-block";
    };

    const stopSubmitLoading = () => {
        document.getElementById("form-submit").classList.remove("w-100");
        document.getElementById("submit").style.display = "block";
        document.getElementById("spinner").style.display = "none";
    };

    const paintJobDetailsViewer = (job) => {
        const industryName = job.custom_fields?.find((field) => field.field_id === "5").value;
        const departmentName = job.custom_fields?.find((field) => field.field_id === "4").value;
        jobName.innerHTML = job.name?.replace(/\s*\([^)]*\)\s*/g, "");
        jobLocation.innerHTML =
            '<i class="ph ph-globe-hemisphere-east icon"></i>' +
            job.city +
            " - " +
            job.country;
        // jobType.innerHTML = '<i class="ph ph-briefcase icon"></i>' + job.job_type;
        if (industryName != "None") {
            jobIndustry.innerHTML =
            '<i class="ph ph-factory icon"></i>' + industryName;
        }

        jobDescriptionContainer.innerHTML = job.job_description_text;

        let icon = "ph-buildings";
        if (departmentName != "None") {
            if (departmentName.toLowerCase() === "office support") {
                icon = "ph-archive";
            } else if (departmentName.toLowerCase() === "finance & accounting") {
                icon = "ph-wallet";
            } else if (departmentName.toLowerCase() === "human resources") {
                icon = "ph-users";
            } else if (departmentName.toLowerCase() === "sales") {
                icon = "ph-chart-line-up";
            }
            jobDepartment.innerHTML =
                `<i class="ph ${icon} icon"></i>` + departmentName;
        }
        
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
            "Es tut uns leid, aber die Stelle, nach der Sie gesucht haben, ist bereits besetzt.";
        line1.className = "closed-text";
        closedText.appendChild(line1);

        let line2 = document.createElement("p");
        line2.textContent = "Wir danken Ihnen für Ihr Interesse.";
        line2.className = "closed-text";
        closedText.appendChild(line2);

        info.appendChild(closedText);

        //button
        const button = document.createElement("button");

        // Set the button attributes
        button.setAttribute("type", "button");
        button.setAttribute("class", "custom-btn btn--outline-black");
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
        let thankYouHeading = document.createElement("h1");
        thankYouHeading.textContent = "DANKE FÜR IHRE BEWERBUNG";
        thankYouHeading.className = "job-closed-heading";
        info.appendChild(thankYouHeading);

        //text
        let thankYouText = document.createElement("div");
        thankYouText.className = "info-secondary-text";

        let line1 = document.createElement("p");
        line1.textContent =
            "Ihre Bewerbung ist eingegangen und wird nun sorgfältig geprüft.";
        line1.className = "closed-text";
        thankYouText.appendChild(line1);

        let line2 = document.createElement("p");
        line2.textContent =
            " Wir freuen uns über Ihr Interesse und werden uns in Kürze bei Ihnen melden.";
        line2.className = "closed-text";
        thankYouText.appendChild(line2);

        info.appendChild(thankYouText);

        //button
        const button = document.createElement("button");

        // Set the button attributes
        button.setAttribute("type", "button");
        button.setAttribute("class", "custom-btn btn--outline-black");
        button.setAttribute("title", "Back");
        button.setAttribute("id", "back-button-top");
        button.onclick = () => {
            window.location = "/index.html";
        };

        // Set the button text
        button.innerText = "Weitere Jobs";
        info.appendChild(button);
    };

    const showModal = (e) => {
        e.preventDefault();

        if (e.target.id == "eeop") {
            modalHeader.textContent =
                "Richtlinen zu beruflichen Chancengleichheit";
            modalBody.innerHTML = `<p>Unser Unternehmen und unsere Kunden diskriminieren bei der Einstellung nicht aufgrund von Rasse, Hautfarbe, Religion, Geschlecht (einschließlich Schwangerschaft und Geschlechtsidentität), nationaler Herkunft, politischer Zugehörigkeit, sexueller Orientierung, Familienstand, Behinderung, genetischen Informationen, Alter, Mitgliedschaft in einer Arbeitnehmerorganisation, Vergeltungsmaßnahmen, elterlichem Status, Militärdienst oder anderen nicht leistungsbezogenen Faktoren.</p>`;
        }
        if (e.target.id == "terms") {
            modalHeader.textContent = "Kandidatenbedingungen";
            modalBody.innerHTML = `<p>
            Für die Be- und Verarbeitung Ihrer Bewerbungsdaten nutzen wir das CRM-System «recruit crm» des Anbieters Workforce Cloud Tech, Inc., 28 Mohawk Avenue, Norwood, NJ 07648, USA. Die für das CRM-System geltenden Datenschutzrichtlinien können unter folgendem Link eingesehen werden: <a href="https://recruitcrm.io/legal/privacy">https://recruitcrm.io/legal/privacy</a>. Die entsprechende GDPR-Verpflichtung finden Sie unter folgendem Link: <a href="https://recruitcrm.io/legal/gdpr">https://recruitcrm.io/legal/gdpr</a>. Ihre in «recruit crm» hochgeladenen Daten werden in der AWS Cloud (Anbieter: Amazon Web Services, Inc., USA) in und ausserhalb der EU gespeichert, d.h. ggf. auch in Drittstaaten ohne einem der EU angemessenen Datenschutzniveau. Sie können uns jederzeit bitten, Ihre Daten zu löschen. Nach Beendigung Ihrer Geschäftsbeziehung mit uns bewahren wir Ihre Personendaten mit Ihrer Einwilligung weiterhin auf, um Ihnen Angebote für Dienstleistungen zu unterbreiten. Ohne Ihre Einwilligung werden Ihre Bewerbungsdaten nach zwei Jahren nach Beendigung Ihrer Geschäftsbeziehung mit uns – gelöscht. Es gelten ausserdem unsere Datenschutzbedingungen: <a href="paulnewstone.com/datenschutz">paulnewstone.com/datenschutz</a> 
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
    const emailInput = document.getElementById("email");


    const showApplyForm = (entries, observe) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("section_hidden");
        // observe.unobserve(entry.target);
    };

    const validateEmail = () => {
        const email = emailInput.value;
        console.log(email)
        const isValid =
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(email);
        if (!isValid || email == "") {
            emailInput.setCustomValidity("Bitte geben Sie eine gültige E-Mail Adresse ein.");
        } else {
            emailInput.setCustomValidity("");
        }
    };

    const showFileName = (input) => {
        const fileNameSpan = document.getElementById("file-name-span");
        if (input.files.length > 0) {
            fileNameSpan.textContent = input.files[0].name;
        } else {
            fileNameSpan.textContent = "";
        }
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
        // formInputs.forEach((input) => {
        //     input.addEventListener("input", removeErrorMessage);
        // });
    };

    // const removeErrorMessage = (e) => {
    //     if (e.target.id == "candidate-terms") {
    //         if (e.target.checked == true) {
    //             e.target.nextElementSibling.nextElementSibling.className =
    //                 "small-text terms-warning hidden";
    //         } else {
    //             e.target.nextElementSibling.nextElementSibling.className =
    //                 "small-text terms-warning";
    //         }
    //         return;
    //     }
    //     e.target.nextElementSibling.nextElementSibling.className =
    //         "small-text hidden";
    //     e.target.classList.remove("danger");
    // };

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
        // const fileNameHolder = document.querySelector(".file-name");
        const fileInput = document.querySelector(".resume-file-input");
        const errorLabel = document.querySelector("#file-name-span");
        const uploadButton = document.querySelector("#uploadButton");

        if (file.value === "") {
            errorLabel.textContent = "Resume field is required";
            errorLabel.className = "danger";
            // uploadButton.classList.add("danger-border");
            // fileInput.classList.add("danger");
            // fileNameHolder.textContent = "";
            return false;
        }

        resume = file.files[0];
        const fileMb = resume.size / 1024 ** 2;
        if (fileMb > 8) {
            errorLabel.textContent = "Resume size should be less than 8MB";
            // errorLabel.className = "small-text";
            errorLabel.className = "danger";
            // uploadButton.classList.add("danger-border");
            // fileNameHolder.textContent = "";
            return false;
        } else {
            errorLabel.textContent = resume.name; // resume.name.length > 30 ? resume.name.slice(0, 15) + '...' + resume.name.slice(-8) : resume.name;
            errorLabel.classList.remove("danger");
            // errorLabel.className = "file-name";
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

    const showToast = (message) => {
        const toast = document.createElement("span");
        toast.classList.add("popup-toast", "text-nowrap");
        toast.innerHTML = message;
        let top_popup_container = document.getElementById("top-popup-container");
        top_popup_container.prepend(toast);

        setTimeout(function () {
            toast.remove();
        }, 3000);
    }

    const handleSubmitBtnClick = async (e) => {
        // e.preventDefault();

        const jobApplicationForm = new FormData(applyForm);
        const objCandidate = Object.fromEntries(jobApplicationForm);
        const formInputs = Array.from(
            document.querySelectorAll('input[name]:not([name="resume"])')
        );

        formInputs.forEach((input) => {
            input.value = input.value.trim();
        });

        if (!validateResume()) {
            return;
        } else {
            objCandidate.resume = document.getElementById("file").files[0];
        }

        //candidate terms check
        if (document.getElementById("candidate-terms").checked == false) {
            document.querySelector(".terms-warning").classList.remove("hidden");
            return;
        }

        //handle form submit
        // uiModule.thankYou();
        // return;
        uiModule.startSubmitLoading();
        document.body.style.overflow = "hidden";
        const submitResponse = await dataModule.applyToJob(objCandidate);
        document.body.style.overflow = "suto";
        // setTimeout(() => {
        //     uiModule.stopSubmitLoading();
        //     uiModule.thankYou();
        // }, 3000);
        uiModule.stopSubmitLoading();
        if (submitResponse && submitResponse.status == 201) {
            uiModule.thankYou();
        } else if (submitResponse && submitResponse.status == 429){
            showToast("Wir bearbeiten zu viele Anfragen. Bitte versuchen Sie es nach einiger Zeit erneut.");
        } else {
            showToast("Etwas ist schief gelaufen. Bitte versuchen Sie es später noch einmal.");
        }
    };

    return {
        init: () => {
            handlePageLoad();
            // window.addEventListener('DOMContentLoaded', handlePageLoad);
            cards.forEach((card) => card.classList.add("section_hidden"));

            applyBtnTop.addEventListener("click", handleApplyBtnTopClick);
            backBtnTop.addEventListener("click", handleBackBtnTopClick);
            // submitBtn.addEventListener("click", handleSubmitBtnClick(event));
            emailInput.addEventListener("input", validateEmail);
            submitBtn.addEventListener(
                "click",
                function (event) {
                    validateEmail();
                    if (!applyForm.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    } else {
                        handleSubmitBtnClick(event);
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


