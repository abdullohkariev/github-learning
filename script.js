// ---------- Data ----------
var commands = [
  ["git init", "Create a new repo in the current folder"],
  ["git clone <url>", "Copy a repo from GitHub to your computer"],
  ["git status", "See which files changed"],
  ["git add <file>", "Stage a file for the next commit"],
  ["git add .", "Stage all changed files"],
  ["git commit -m \"msg\"", "Save a snapshot with a message"],
  ["git push", "Upload commits to GitHub"],
  ["git pull", "Download and merge new commits from GitHub"],
  ["git log --oneline", "Show commit history in short form"],
  ["git diff", "Show what changed (not yet staged)"],
  ["git branch", "List branches"],
  ["git switch -c <name>", "Create and switch to a new branch"],
  ["git switch <name>", "Switch to an existing branch"],
  ["git merge <name>", "Merge a branch into the current one"],
  ["git restore <file>", "Undo changes to a file (back to last commit)"],
  ["git restore --staged <file>", "Unstage a file (undo git add)"],
  ["git reset --soft HEAD~1", "Undo last commit but keep the changes"],
  ["git remote -v", "Show linked remotes"],
  ["git stash", "Temporarily hide your changes"],
  ["git stash pop", "Bring stashed changes back"]
];

var questions = [
  {
    q: "What does 'git commit' do?",
    options: ["Uploads code to GitHub", "Saves a snapshot of your staged changes", "Creates a branch"],
    answer: 1
  },
  {
    q: "Which command uploads your commits to GitHub?",
    options: ["git push", "git pull", "git add"],
    answer: 0
  },
  {
    q: "What is a pull request?",
    options: ["A request to delete a repo", "A request to download code", "A request to review and merge your changes"],
    answer: 2
  },
  {
    q: "Which command creates and switches to a new branch?",
    options: ["git branch -d x", "git switch -c x", "git merge x"],
    answer: 1
  }
];

var lessons = ["basics", "setup", "first-repo", "branches", "pull-requests", "pages", "cheatsheet"];

// ---------- Helpers for localStorage (may be blocked) ----------
function load(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function save(key, value) {
  try { localStorage.setItem(key, value); } catch (e) {}
}

// ---------- Dark mode ----------
var themeBtn = document.getElementById("theme-btn");

function setTheme(dark) {
  document.body.classList.toggle("dark", dark);
  themeBtn.textContent = dark ? "☀️" : "🌙";
  save("theme", dark ? "dark" : "light");
}

themeBtn.addEventListener("click", function () {
  setTheme(!document.body.classList.contains("dark"));
});
setTheme(load("theme") === "dark");

// ---------- Copy buttons on code blocks ----------
document.querySelectorAll("pre").forEach(function (pre) {
  var btn = document.createElement("button");
  btn.className = "copy-btn";
  btn.textContent = "Copy";
  btn.addEventListener("click", function () {
    var text = pre.querySelector("code").innerText;
    navigator.clipboard.writeText(text).then(function () {
      btn.textContent = "Copied!";
      setTimeout(function () { btn.textContent = "Copy"; }, 1500);
    });
  });
  pre.appendChild(btn);
});

// ---------- Progress tracking ----------
var done = JSON.parse(load("done") || "[]");

function updateProgress() {
  var percent = (done.length / lessons.length) * 100;
  document.getElementById("progress-bar").style.width = percent + "%";
  document.getElementById("progress-text").textContent =
    done.length + " of " + lessons.length + " lessons done";

  document.querySelectorAll(".done-btn").forEach(function (btn) {
    var isDone = done.indexOf(btn.dataset.lesson) !== -1;
    btn.classList.toggle("done", isDone);
    btn.textContent = isDone ? "✓ Done" : "Mark as done";
  });
}

document.querySelectorAll(".done-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var name = btn.dataset.lesson;
    var index = done.indexOf(name);
    if (index === -1) { done.push(name); } else { done.splice(index, 1); }
    save("done", JSON.stringify(done));
    updateProgress();
  });
});
updateProgress();

// ---------- Cheat sheet with search ----------
var table = document.getElementById("cmd-table");
var search = document.getElementById("search");

function showCommands(filter) {
  table.innerHTML = "";
  commands.forEach(function (item) {
    var text = (item[0] + " " + item[1]).toLowerCase();
    if (text.indexOf(filter.toLowerCase()) === -1) return;
    var row = document.createElement("tr");
    var cmd = document.createElement("td");
    var desc = document.createElement("td");
    var code = document.createElement("code");
    code.textContent = item[0];
    cmd.appendChild(code);
    desc.textContent = item[1];
    row.appendChild(cmd);
    row.appendChild(desc);
    table.appendChild(row);
  });
}

search.addEventListener("input", function () { showCommands(search.value); });
showCommands("");

// ---------- Quiz ----------
var quizBox = document.getElementById("quiz-box");
var result = document.getElementById("quiz-result");
var score = 0;
var answered = 0;

questions.forEach(function (item) {
  var box = document.createElement("div");
  box.className = "question";
  var title = document.createElement("p");
  title.textContent = item.q;
  box.appendChild(title);

  var buttons = [];
  item.options.forEach(function (text, i) {
    var btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = text;
    btn.addEventListener("click", function () {
      if (box.dataset.locked) return;
      box.dataset.locked = "yes";
      answered++;
      if (i === item.answer) {
        score++;
        btn.classList.add("correct");
      } else {
        btn.classList.add("wrong");
        buttons[item.answer].classList.add("correct");
      }
      if (answered === questions.length) {
        result.textContent = "Your score: " + score + " / " + questions.length +
          (score === questions.length ? " 🎉 Perfect!" : " Keep practicing!");
      }
    });
    buttons.push(btn);
    box.appendChild(btn);
  });
  quizBox.appendChild(box);
});
