/* ===========================================
   ExamGPT AI
   Frontend Script
=========================================== */

const backendURL = "http://127.0.0.1:8000";

/* ===========================
   DOM Elements
=========================== */

const pdfInput = document.getElementById("pdfFile");
const browseBtn = document.getElementById("browseBtn");
const uploadStatus = document.getElementById("uploadStatus");
const uploadText = document.getElementById("uploadText");
const uploadIcon = document.getElementById("uploadIcon");

const askBtn = document.getElementById("askBtn");
const questionInput = document.getElementById("question");
const chatBox = document.getElementById("chatBox");

const fileName = document.getElementById("fileName");
const pages = document.getElementById("pages");
const subject = document.getElementById("subject");
const university = document.getElementById("university");

const dropArea = document.getElementById("dropArea");

/* ===========================
   Browse Button
=========================== */

browseBtn.addEventListener("click", () => {

    pdfInput.click();

});

/* ===========================
   File Select
=========================== */

pdfInput.addEventListener("change", () => {

    if(pdfInput.files.length>0){

        uploadPDF(pdfInput.files[0]);

    }

});

/* ===========================
   Drag & Drop
=========================== */

dropArea.addEventListener("dragover",(e)=>{

    e.preventDefault();

    dropArea.style.borderColor="#3b82f6";

});

dropArea.addEventListener("dragleave",()=>{

    dropArea.style.borderColor="rgba(255,255,255,.25)";

});

dropArea.addEventListener("drop",(e)=>{

    e.preventDefault();

    dropArea.style.borderColor="rgba(255,255,255,.25)";

    if(e.dataTransfer.files.length>0){

        uploadPDF(e.dataTransfer.files[0]);

    }

});
/* ===========================================
   Upload PDF
=========================================== */

async function uploadPDF(file){

    uploadStatus.innerHTML = `
        <div class="success-card" style="background:#2563eb;">
            <h3>Uploading PDF...</h3>
            <p>Please wait while ExamGPT processes your question paper.</p>
        </div>
    `;

    fileName.textContent = file.name;

    const formData = new FormData();

    formData.append("file", file);

    try{

        const response = await fetch(`${backendURL}/upload`,{

            method:"POST",

            body:formData

        });

        const data = await response.json();

        if(data.success){

            /* Change Upload Box */

            uploadIcon.src="assets/pdf.png";

            uploadText.innerHTML=`
                <b>${data.filename}</b><br>
                <span style="color:#22c55e;">
                    PDF Uploaded Successfully
                </span>
            `;

            /* Success Card */

            uploadStatus.innerHTML=`

            <div class="success-card">

                <h3>✅ Upload Successful</h3>

                <p><strong>File :</strong> ${data.filename}</p>

                <p><strong>Chunks :</strong> ${data.chunks}</p>

                <p>Your PDF is ready for AI questions.</p>

            </div>

            `;

            /* PDF Details */

            fileName.textContent=data.filename;

            pages.textContent="Detected";

            subject.textContent="Computer Networks";

            university.textContent="Anna University";

            addBotMessage(
                "✅ PDF uploaded successfully.<br><br>You can now ask me anything about this question paper."
            );

        }

        else{

            uploadStatus.innerHTML=`

            <div class="success-card" style="background:#dc2626;">

                <h3>Upload Failed</h3>

                <p>Please try again.</p>

            </div>

            `;

        }

    }

    catch(error){

        uploadStatus.innerHTML=`

        <div class="success-card" style="background:#dc2626;">

            <h3>Backend Offline</h3>

            <p>Cannot connect to FastAPI Server.</p>

        </div>

        `;

    }

}
/* ===========================================
   Ask AI
=========================================== */

askBtn.addEventListener("click", askQuestion);

questionInput.addEventListener("keypress", function(e){

    if(e.key==="Enter"){

        askQuestion();

    }

});

async function askQuestion(){

    const question = questionInput.value.trim();

    if(question==="")
        return;

    addUserMessage(question);

    questionInput.value="";

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

        addBotMessage("❌ Cannot connect to the backend server.");

    }

}

/* ===========================================
   User Message
=========================================== */

function addUserMessage(message){

    const div=document.createElement("div");

    div.className="user-message";

    div.innerHTML=message;

    chatBox.appendChild(div);

    scrollBottom();

}

/* ===========================================
   Bot Message
=========================================== */

function addBotMessage(message){

    const div=document.createElement("div");

    div.className="bot-message";

    div.innerHTML=message;

    chatBox.appendChild(div);

    scrollBottom();

}

/* ===========================================
   Typing Animation
=========================================== */

function showTyping(){

    const div=document.createElement("div");

    div.className="bot-message";

    div.id="typing";

    div.innerHTML=`

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

    const typing=document.getElementById("typing");

    if(typing){

        typing.remove();

    }

}

/* ===========================================
   Auto Scroll
=========================================== */

function scrollBottom(){

    chatBox.scrollTop=chatBox.scrollHeight;

}

/* ===========================================
   Welcome Message
=========================================== */

window.onload=function(){

    addBotMessage(
        "👋 Welcome to ExamGPT! Upload a PDF question paper and ask me anything about it."
    );

};