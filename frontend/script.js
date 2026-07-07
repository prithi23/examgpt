const backendURL = "http://127.0.0.1:8000";

/* ===========================
   Get Elements
=========================== */

const pdfInput = document.getElementById("pdfFile");
const browseBtn = document.getElementById("browseBtn");
const uploadStatus = document.getElementById("uploadStatus");

const askBtn = document.getElementById("askBtn");
const questionInput = document.getElementById("question");
const chatBox = document.getElementById("chatBox");

const fileName = document.getElementById("fileName");

const uploadMenu = document.getElementById("uploadMenu");
const chatMenu = document.getElementById("chatMenu");
const detailsMenu = document.getElementById("detailsMenu");
const searchMenu = document.getElementById("searchMenu");

const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

/* ===========================
   Backend Status
=========================== */

async function checkBackend() {

    try {

        const response = await fetch(backendURL);

        if (response.ok) {

            statusDot.style.background = "#22c55e";

            statusText.innerHTML = "Backend Connected";

        } else {

            statusDot.style.background = "#ef4444";

            statusText.innerHTML = "Backend Offline";

        }

    }

    catch {

        statusDot.style.background = "#ef4444";

        statusText.innerHTML = "Backend Offline";

    }

}

checkBackend();

setInterval(checkBackend,5000);

/* ===========================
   Sidebar Navigation
=========================== */

function removeActiveMenu(){

    document.querySelectorAll(".menu-btn").forEach(btn=>{

        btn.classList.remove("active");

    });

}

uploadMenu.onclick=function(){

    removeActiveMenu();

    uploadMenu.classList.add("active");

    document.getElementById("uploadSection").scrollIntoView({

        behavior:"smooth"

    });

};

chatMenu.onclick=function(){

    removeActiveMenu();

    chatMenu.classList.add("active");

    document.getElementById("chatSection").scrollIntoView({

        behavior:"smooth"

    });

};

detailsMenu.onclick=function(){

    removeActiveMenu();

    detailsMenu.classList.add("active");

    document.getElementById("detailsSection").scrollIntoView({

        behavior:"smooth"

    });

};

searchMenu.onclick=function(){

    removeActiveMenu();

    searchMenu.classList.add("active");

    document.getElementById("chatSection").scrollIntoView({

        behavior:"smooth"

    });

    questionInput.focus();

};

/* ===========================
   Browse Button
=========================== */

browseBtn.onclick=function(){

    pdfInput.click();

};

pdfInput.addEventListener("change",uploadPDF);
/* ===========================
   Upload PDF
=========================== */

async function uploadPDF() {

    if (pdfInput.files.length === 0)
        return;

    const file = pdfInput.files[0];

    uploadStatus.innerHTML = `
        <div style="
            background:#2563eb;
            color:white;
            padding:15px;
            border-radius:10px;
            margin-top:20px;
        ">
            ⏳ Uploading PDF...
        </div>
    `;

    fileName.innerHTML = file.name;

    const formData = new FormData();

    formData.append("file", file);

    try {

        const response = await fetch(`${backendURL}/upload`, {

            method: "POST",

            body: formData

        });

        const data = await response.json();

        if (data.success) {

            uploadStatus.innerHTML = `
                <div style="
                    background:#16a34a;
                    color:white;
                    padding:18px;
                    border-radius:12px;
                    margin-top:20px;
                    font-size:16px;
                    line-height:28px;
                ">
                    ✅ <b>Upload Successful</b><br>
                    <b>File :</b> ${data.filename}<br>
                    <b>Status :</b> ${data.message}<br>
                    <b>Chunks Created :</b> ${data.chunks}
                </div>
            `;

            document.getElementById("fileName").innerHTML = data.filename;

            document.getElementById("uploadText").innerHTML =
                "✅ " + data.filename;

            document.getElementById("uploadIcon").src =
                "assets/pdf.png";

            addBotMessage(
                "✅ PDF uploaded successfully.<br><br>You can now ask questions from this PDF."
            );

            // Hide after 2 minutes

            setTimeout(function(){

                uploadStatus.innerHTML="";

            },120000);

        }

        else{

            uploadStatus.innerHTML=`

                <div style="
                    background:#dc2626;
                    color:white;
                    padding:15px;
                    border-radius:10px;
                    margin-top:20px;
                ">

                    ❌ Upload Failed

                </div>

            `;

        }

    }

    catch(error){

        uploadStatus.innerHTML=`

            <div style="
                background:#dc2626;
                color:white;
                padding:15px;
                border-radius:10px;
                margin-top:20px;
            ">

                ❌ Cannot connect to Backend

            </div>

        `;

    }

}
/* ===========================
   Ask AI
=========================== */

askBtn.onclick = askQuestion;

questionInput.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        askQuestion();

    }

});

async function askQuestion(){

    const question = questionInput.value.trim();

    if(question === "")
        return;

    addUserMessage(question);

    questionInput.value = "";

    showTyping();

    try{

        const response = await fetch(`${backendURL}/chat`,{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                question:question

            })

        });

        const data = await response.json();

        removeTyping();

        addBotMessage(data.answer);

    }

    catch(error){

        removeTyping();

        addBotMessage("❌ Backend connection failed.");

    }

}

/* ===========================
   User Message
=========================== */

function addUserMessage(message){

    const div = document.createElement("div");

    div.className = "user-message";

    div.innerHTML = message;

    chatBox.appendChild(div);

    scrollBottom();

}

/* ===========================
   Bot Message
=========================== */

function addBotMessage(message){

    const div = document.createElement("div");

    div.className = "bot-message";

    div.innerHTML = message;

    chatBox.appendChild(div);

    scrollBottom();

}

/* ===========================
   Typing Animation
=========================== */

function showTyping(){

    const div = document.createElement("div");

    div.className = "bot-message";

    div.id = "typing";

    div.innerHTML = `

        <div class="typing">

            <span></span>

            <span></span>

            <span></span>

        </div>

    `;

    chatBox.appendChild(div);

    scrollBottom();

}

function removeTyping(){

    const typing = document.getElementById("typing");

    if(typing){

        typing.remove();

    }

}

/* ===========================
   Auto Scroll
=========================== */

function scrollBottom(){

    chatBox.scrollTop = chatBox.scrollHeight;

}