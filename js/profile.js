import { getToken, logout } from "./auth.js";
import { graphqlRequest, query } from "./graphql.js";
import { drawXPGraph, drawSkillGraph, drawCheckpointGraph } from "./graph.js";

const token = getToken();
if (!token) {   window.location.href = "index.html";}

// logout
const logoutButton = document.querySelector("#logout");
logoutButton.addEventListener("click", () => {logout();});


const result = await graphqlRequest(query);
const user = result.data.user[0];
const checkpointTransactions = user.xpTransactions.filter(transaction =>
    transaction.path?.includes("check-points")
);

document.querySelector("#userid").textContent =`ID: ${user.id}`;
document.querySelector("#username").textContent =`Username: ${user.login}`;
document.querySelector("#audit").textContent =`Audit Ratio: ${parseFloat(user.auditRatio.toFixed(2))}`;
const totalXP = user.xpTransactions.reduce((total, transaction) => total + transaction.amount,0);
document.querySelector("#xp").textContent =`Total XP: ${totalXP}`;
const transactions = user.skillTransactions;

function getSkills(transactions) {
    const skills = {};

    for (const item of transactions) {
        if (!item.type.startsWith("skill_")) continue;

        const name = item.type.replace("skill_", "");
        if (!skills[name] || item.amount > skills[name]) {
            skills[name] = item.amount;
        }
    }
    return skills;
}

const skills = getSkills(transactions);

const xpHistory = [];
let runningTotal = 0;

const sortedXP = [...user.xpTransactions].sort(
    (a,b) =>
    new Date(a.createdAt) -
    new Date(b.createdAt)
);

sortedXP.forEach((xp)=>{
    runningTotal += xp.amount;
    xpHistory.push({date: new Date(xp.createdAt),xp: runningTotal});
});

function getCheckpointProgress(transactions) {
    const checkpoints = {};

    transactions.forEach(transaction => {
        if (!transaction.path?.includes("check-points")) {
            return;
        }
        const date = transaction.createdAt.split("T")[0];
        const question = transaction.amount / 50;

        if (!checkpoints[date] || question > checkpoints[date]) {
            checkpoints[date] = question;
        }
    });
    return checkpoints;
}

function getPiscineExams(transactions) {
    const exams = {};

    transactions.forEach(transaction => {
        const path = transaction.path || "";
        if (
            !path.includes("/piscine-go/exam-01/") &&
            !path.includes("/piscine-go/exam-02/") &&
            !path.includes("/piscine-go/final-exam/")
        ) {
            return;
        }

        const date = transaction.createdAt.split("T")[0];
        if (!exams[date]) {
            exams[date] = 0;
        }
        exams[date]++;
    });
    return exams;
}

drawSkillGraph(skills)
const checkpointProgress = getCheckpointProgress(user.xpTransactions);
const piscineProgress = getPiscineExams(user.piscineExamTransactions);
const progress = {...piscineProgress,...checkpointProgress};
drawCheckpointGraph(progress);
drawXPGraph(xpHistory);

