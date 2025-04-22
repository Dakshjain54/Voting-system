
const voters = {
    "V12345": { name: "Daksh jain", hasVoted: false },
    "V67890": { name: "Pranjal singh", hasVoted: false },
    "v00021": { name: "Rahul", hasVoted: false },
    "V13579": { name: "Hritik kumar", hasVoted: false }
};


const candidates = {
    "candidate1": { name: "Akhilesh Yadav", party: "samajvadi party", votes: 0 },
    "candidate2": { name: "Adityanath yogi", party: "BJP", votes: 0 },
    "candidate3": { name: "Rahual gandhi", party: "Congress", votes: 0 }
};


let currentVoter = null;
let selectedCandidate = null;


const loginSection = document.getElementById("login-section");
const votingSection = document.getElementById("voting-section");
const resultsSection = document.getElementById("results-section");
const loginError = document.getElementById("login-error");
const voteError = document.getElementById("vote-error");
const submitBtn = document.getElementById("submit-vote");
const resultsContainer = document.getElementById("results-container");


function initFromStorage() {
    const savedCandidates = localStorage.getItem("candidates");
    if (savedCandidates) {
        Object.assign(candidates, JSON.parse(savedCandidates));
    }
}


function verifyVoter() {
    const voterId = document.getElementById("voter-id").value.trim();
    
    if (!voterId) {
        loginError.textContent = "Please enter your Voter ID";
        return;
    }
    
    if (!voters[voterId]) {
        loginError.textContent = "Invalid Voter ID";
        return;
    }
    
    if (voters[voterId].hasVoted) {
        loginError.textContent = "You have already voted";
        return;
    }
    
    currentVoter = voterId;
    loginSection.style.display = "none";
    votingSection.style.display = "block";
    loginError.textContent = "";
}


function selectCandidate(candidateId) {
    
    document.querySelectorAll(".candidate").forEach(el => {
        el.classList.remove("selected");
    });
    

    document.querySelector(`.candidate[onclick="selectCandidate('${candidateId}')"]`)
        .classList.add("selected");
    
    selectedCandidate = candidateId;
    submitBtn.disabled = false;
    voteError.textContent = "";
}


function submitVote() {
    if (!selectedCandidate) {
        voteError.textContent = "Please select a candidate";
        return;
    }
    
    
    candidates[selectedCandidate].votes++;
    voters[currentVoter].hasVoted = true;
    
   
    localStorage.setItem("candidates", JSON.stringify(candidates));
    
    
    showResults();
}


function showResults() {
    votingSection.style.display = "none";
    resultsSection.style.display = "block";
    
    resultsContainer.innerHTML = "";
    
   
    const totalVotes = Object.values(candidates).reduce((sum, candidate) => sum + candidate.votes, 0);
    
    
    for (const [id, candidate] of Object.entries(candidates)) {
        const percentage = totalVotes > 0 ? Math.round((candidate.votes / totalVotes) * 100) : 0;
        
        const candidateDiv = document.createElement("div");
        candidateDiv.innerHTML = `
            <h3>${candidate.name} (${candidate.party})</h3>
            <p>Votes: ${candidate.votes} (${percentage}%)</p>
            <div class="result-bar">
                <div class="result-fill" style="width: ${percentage}%">${percentage}%</div>
            </div>
        `;
        
        resultsContainer.appendChild(candidateDiv);
    }
}


function resetSystem() {
    document.getElementById("voter-id").value = "";
    resultsSection.style.display = "none";
    loginSection.style.display = "block";
    currentVoter = null;
    selectedCandidate = null;
}


initFromStorage();