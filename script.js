// ================= Data =================
var commands = [
  ["Setup", "git config --global user.name \"Name\"", "Set your name"],
  ["Setup", "git config --global user.email \"you@x.com\"", "Set your email"],
  ["Setup", "git init", "Create a new repo in the current folder"],
  ["Setup", "git clone <url>", "Copy a repo from GitHub to your computer"],
  ["Basics", "git status", "See which files changed"],
  ["Basics", "git add <file>", "Stage a file for the next commit"],
  ["Basics", "git add .", "Stage all changed files"],
  ["Basics", "git commit -m \"msg\"", "Save a snapshot with a message"],
  ["Basics", "git diff", "Show what changed (not yet staged)"],
  ["Basics", "git log --oneline", "Show commit history in short form"],
  ["Branches", "git branch", "List branches"],
  ["Branches", "git switch -c <name>", "Create and switch to a new branch"],
  ["Branches", "git switch <name>", "Switch to an existing branch"],
  ["Branches", "git merge <name>", "Merge a branch into the current one"],
  ["Branches", "git branch -d <name>", "Delete a merged branch"],
  ["Remote", "git remote -v", "Show linked remotes"],
  ["Remote", "git remote add origin <url>", "Link your repo to GitHub"],
  ["Remote", "git push -u origin main", "First push of main to GitHub"],
  ["Remote", "git push", "Upload commits to GitHub"],
  ["Remote", "git pull", "Download and merge new commits from GitHub"],
  ["Remote", "git fetch", "Download changes without merging"],
  ["Undo", "git restore <file>", "Throw away changes in a file"],
  ["Undo", "git restore --staged <file>", "Unstage a file (undo git add)"],
  ["Undo", "git commit --amend", "Edit the last commit"],
  ["Undo", "git reset --soft HEAD~1", "Undo last commit, keep the changes"],
  ["Undo", "git revert <commit>", "Make a new commit that undoes another"],
  ["Undo", "git stash", "Temporarily hide your changes"],
  ["Undo", "git stash pop", "Bring stashed changes back"]
];

var cards = [
  ["Repository", "A project folder tracked by Git."],
  ["Commit", "A saved snapshot of your project with a message."],
  ["Branch", "A separate line of work inside a repo."],
  ["Merge", "Combining the work of one branch into another."],
  ["Remote", "A copy of your repo hosted online, like on GitHub."],
  ["Origin", "The default name for your main remote."],
  ["Clone", "Download a full copy of a repo to your computer."],
  ["Fork", "Your own copy of someone else's repo on GitHub."],
  ["Pull request", "A request to review and merge your changes."],
  ["Staging area", "Where files wait after git add, before a commit."],
  ["HEAD", "A pointer to the commit you are currently on."],
  ["Merge conflict", "When Git can't combine changes and needs your help."],
  [".gitignore", "A file listing what Git should not track."],
  ["Issue", "A GitHub item to track a bug, idea or task."],
  ["README", "The front page of a repo, written in Markdown."]
];

var questions = [
  { q: "What does 'git commit' do?",
    o: ["Uploads code to GitHub", "Saves a snapshot of your staged changes", "Creates a branch"],
    a: 1, e: "A commit saves staged changes to your local history. Pushing is a separate step." },
  { q: "Which command uploads your commits to GitHub?",
    o: ["git push", "git pull", "git add"],
    a: 0, e: "git push sends commits up. git pull brings them down." },
  { q: "What is a pull request?",
    o: ["A request to delete a repo", "A request to download code", "A request to review and merge your changes"],
    a: 2, e: "A PR lets others review your branch before it is merged." },
  { q: "Which command creates and switches to a new branch?",
    o: ["git branch -d x", "git switch -c x", "git merge x"],
    a: 1, e: "git switch -c x = create branch x and move to it." },
  { q: "You edited a file and want to undo your changes. What do you run?",
    o: ["git restore file.txt", "git push --force", "git init"],
    a: 0, e: "git restore brings the file back to the last commit." },
  { q: "Which file tells Git what to ignore?",
    o: ["README.md", ".gitignore", "config.json"],
    a: 1, e: ".gitignore lists files and folders Git should not track." },
  { q: "What is a fork?",
    o: ["A merge conflict", "Your own copy of someone else's repo on GitHub", "A type of commit"],
    a: 1, e: "Forking lets you change a project without touching the original." },
  { q: "What should you do if you accidentally commit a password?",
    o: ["Nothing, deleting the file is enough", "Change the password right away", "Make the repo private only"],
    a: 1, e: "It stays in history, so treat it as leaked and change it." },
  { q: "Which command downloads a repo from GitHub to your computer?",
    o: ["git clone", "git commit", "git stash"],
    a: 0, e: "git clone <url> copies the whole repo locally." },
  { q: "Where do files go after 'git add'?",
    o: ["GitHub", "The staging area", "The trash"],
    a: 1, e: "The staging area holds files that are ready to be committed." }
];

// ================= Helpers =================
function $(id) { return document.getElementById(id); }

function load(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function save(key, value) {
  try { localStorage.setItem(key, value); } catch (e) {}
}

function toast(text) {
  var t = $("toast");
  t.textContent = text;
  t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(function () { t.hidden = true; }, 1500);
}

function copy(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function () { toast("Copied!"); });
  }
}

function shuffle(list) {
  var a = list.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

// ================= Dark mode =================
function setTheme(dark) {
  document.body.classList.toggle("dark", dark);
  $("theme-icon").src = dark ? "assets/day-mode.png" : "assets/moon.png";
  save("theme", dark ? "dark" : "light");
}
var savedTheme = load("theme");
if (savedTheme) {
  setTheme(savedTheme === "dark");
} else {
  setTheme(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
}
$("theme-btn").addEventListener("click", function () {
  setTheme(!document.body.classList.contains("dark"));
});

// ================= Copy buttons on code blocks =================
document.querySelectorAll("pre").forEach(function (pre) {
  var btn = document.createElement("button");
  btn.className = "copy-btn";
  btn.textContent = "Copy";
  btn.addEventListener("click", function () {
    copy(pre.querySelector("code").innerText);
    btn.textContent = "Copied!";
    setTimeout(function () { btn.textContent = "Copy"; }, 1500);
  });
  pre.appendChild(btn);
});

// ================= Sidebar + progress =================
var lessonEls = document.querySelectorAll("section[data-track]");
var toolEls = document.querySelectorAll("section.tool");
var done = JSON.parse(load("done") || "[]");
var navLinks = {};

function addLink(nav, section, number) {
  var a = document.createElement("a");
  a.href = "#" + section.id;
  var title = section.querySelector("h2").textContent;
  var label = document.createElement("span");
  label.textContent = (number ? number + ". " : "") + title;
  var tick = document.createElement("span");
  tick.className = "tick";
  tick.textContent = "✓";
  a.appendChild(label);
  a.appendChild(tick);
  a.addEventListener("click", function () {
    $("sidebar").classList.remove("open");
    $("menu-btn").setAttribute("aria-expanded", "false");
  });
  nav.appendChild(a);
  navLinks[section.id] = a;
}

lessonEls.forEach(function (sec, i) {
  addLink($("lesson-nav"), sec, i + 1);

  var btn = document.createElement("button");
  btn.className = "done-btn";
  btn.addEventListener("click", function () {
    var index = done.indexOf(sec.id);
    if (index === -1) {
      done.push(sec.id);
      toast("Nice work! 🎉");
    } else {
      done.splice(index, 1);
    }
    save("done", JSON.stringify(done));
    updateProgress();
  });
  sec.appendChild(btn);
  sec.doneBtn = btn;
});
toolEls.forEach(function (sec) { addLink($("tool-nav"), sec, ""); });

function updateProgress() {
  var total = lessonEls.length;
  $("progress-bar").style.width = (done.length / total * 100) + "%";
  $("progress-text").textContent = done.length + " of " + total + " lessons done" +
    (done.length === total ? " 🏆 You finished the guide!" : "");

  lessonEls.forEach(function (sec) {
    var isDone = done.indexOf(sec.id) !== -1;
    sec.doneBtn.classList.toggle("done", isDone);
    sec.doneBtn.textContent = isDone ? "✓ Done" : "Mark as done";
    navLinks[sec.id].classList.toggle("finished", isDone);
  });
}
updateProgress();

$("reset-btn").addEventListener("click", function () {
  if (confirm("Reset all your progress?")) {
    done = [];
    save("done", "[]");
    updateProgress();
    toast("Progress reset");
  }
});

// Highlight the lesson you are reading
var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      Object.keys(navLinks).forEach(function (id) { navLinks[id].classList.remove("active"); });
      navLinks[entry.target.id].classList.add("active");
    }
  });
}, { rootMargin: "-20% 0px -70% 0px" });
document.querySelectorAll("section.lesson").forEach(function (sec) { observer.observe(sec); });

// Mobile menu + back to top
function setMenu(open) {
  $("sidebar").classList.toggle("open", open);
  $("menu-btn").setAttribute("aria-expanded", open ? "true" : "false");
}
$("menu-btn").addEventListener("click", function () { setMenu(!$("sidebar").classList.contains("open")); });
$("scrim").addEventListener("click", function () { setMenu(false); });
document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
$("top-btn").addEventListener("click", function () { window.scrollTo({ top: 0 }); });
window.addEventListener("scroll", function () { $("top-btn").hidden = window.scrollY < 600; });

// ================= Cheat sheet =================
var category = "All";
var categories = ["All"];
commands.forEach(function (c) { if (categories.indexOf(c[0]) === -1) categories.push(c[0]); });

function showCommands() {
  var filter = $("search").value.toLowerCase();
  var table = $("cmd-table");
  table.innerHTML = "";
  var count = 0;

  commands.forEach(function (item) {
    if (category !== "All" && item[0] !== category) return;
    if ((item[1] + " " + item[2]).toLowerCase().indexOf(filter) === -1) return;
    count++;

    var row = document.createElement("tr");
    var cmd = document.createElement("td");
    var desc = document.createElement("td");
    var code = document.createElement("code");
    code.textContent = item[1];
    cmd.appendChild(code);
    cmd.title = "Click to copy";
    cmd.addEventListener("click", function () { copy(item[1]); });
    desc.textContent = item[2];
    row.appendChild(cmd);
    row.appendChild(desc);
    table.appendChild(row);
  });
  $("no-results").hidden = count > 0;
}

categories.forEach(function (name) {
  var chip = document.createElement("button");
  chip.className = "chip" + (name === "All" ? " on" : "");
  chip.textContent = name;
  chip.addEventListener("click", function () {
    category = name;
    document.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("on"); });
    chip.classList.add("on");
    showCommands();
  });
  $("chips").appendChild(chip);
});
$("search").addEventListener("input", showCommands);
showCommands();

// ================= Flashcards =================
var deck = cards.slice();
var cardIndex = 0;
var flipped = false;

function showCard() {
  var box = $("flash");
  box.textContent = flipped ? deck[cardIndex][1] : deck[cardIndex][0];
  box.classList.toggle("back", flipped);
  $("flash-count").textContent = (cardIndex + 1) + " / " + deck.length;
}
function moveCard(step) {
  cardIndex = (cardIndex + step + deck.length) % deck.length;
  flipped = false;
  showCard();
}
function flipCard() {
  flipped = !flipped;
  showCard();
  var box = $("flash");
  box.classList.remove("flip");
  void box.offsetWidth;
  box.classList.add("flip");
}
$("flash").addEventListener("click", flipCard);
$("flash").addEventListener("keydown", function (e) {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flipCard(); }
  else if (e.key === "ArrowRight") moveCard(1);
  else if (e.key === "ArrowLeft") moveCard(-1);
});
$("flash-next").addEventListener("click", function () { moveCard(1); });
$("flash-prev").addEventListener("click", function () { moveCard(-1); });
$("flash-shuffle").addEventListener("click", function () {
  deck = shuffle(deck);
  cardIndex = 0;
  flipped = false;
  showCard();
  toast("Shuffled");
});
showCard();

// ================= Quiz =================
var quizList, quizIndex, quizScore;

function startQuiz() {
  quizList = shuffle(questions);
  quizIndex = 0;
  quizScore = 0;
  $("quiz-result").innerHTML = "";
  showQuestion();
}

function showQuestion() {
  var box = $("quiz-box");
  box.innerHTML = "";
  $("quiz-fill").style.width = (quizIndex / quizList.length * 100) + "%";

  if (quizIndex >= quizList.length) {
    finishQuiz();
    return;
  }

  var item = quizList[quizIndex];
  var wrap = document.createElement("div");
  wrap.className = "question";
  var count = document.createElement("span");
  count.className = "q-count";
  count.textContent = "Question " + (quizIndex + 1) + " of " + quizList.length;
  wrap.appendChild(count);
  var title = document.createElement("p");
  title.className = "q-text";
  title.textContent = item.q;
  wrap.appendChild(title);

  var buttons = [];
  var locked = false;

  item.o.forEach(function (text, i) {
    var btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = text;
    btn.addEventListener("click", function () {
      if (locked) return;
      locked = true;
      buttons.forEach(function (b) { b.disabled = true; });
      if (i === item.a) {
        quizScore++;
        btn.classList.add("correct");
      } else {
        btn.classList.add("wrong");
        buttons[item.a].classList.add("correct");
      }
      var explain = document.createElement("p");
      explain.className = "explain";
      explain.textContent = item.e;
      wrap.appendChild(explain);

      var next = document.createElement("button");
      next.className = "btn-sm";
      next.textContent = quizIndex === quizList.length - 1 ? "See result" : "Next question";
      var arrow = document.createElement("span");
      arrow.className = "ico ico-arrow-left rot-right";
      arrow.setAttribute("aria-hidden", "true");
      next.appendChild(arrow);
      next.addEventListener("click", function () { quizIndex++; showQuestion(); });
      wrap.appendChild(next);
    });
    buttons.push(btn);
    wrap.appendChild(btn);
  });
  box.appendChild(wrap);
}

function finishQuiz() {
  $("quiz-box").innerHTML = "";
  var best = parseInt(load("best") || "0", 10);
  if (quizScore > best) { best = quizScore; save("best", String(best)); }

  var message = quizScore === quizList.length ? "🎉 Perfect!" :
                quizScore >= quizList.length * 0.7 ? "👏 Great job!" : "Keep practicing, you'll get it!";
  $("quiz-result").innerHTML =
    "<h3>" + quizScore + " / " + quizList.length + "</h3><p>" + message +
    "</p><p class='small muted'>Best score: " + best + " / " + quizList.length + "</p>";

  var again = document.createElement("button");
  again.className = "btn-sm";
  again.textContent = "Try again";
  again.addEventListener("click", startQuiz);
  $("quiz-result").appendChild(again);
}
startQuiz();

// ================= Terminal simulator =================
var missions = [
  { text: "git init", done: false },
  { text: "create a file (touch)", done: false },
  { text: "git add", done: false },
  { text: "git commit", done: false },
  { text: "new branch", done: false },
  { text: "git merge", done: false },
  { text: "add remote", done: false },
  { text: "git push", done: false }
];

var repo;
function resetRepo() {
  repo = { init: false, files: {}, commits: [], branch: "main", branches: ["main"], remote: "", pushed: 0 };
}
resetRepo();

function drawMissions() {
  var list = $("missions");
  list.innerHTML = "";
  var nextFound = false;
  missions.forEach(function (m, i) {
    var li = document.createElement("li");
    li.textContent = (m.done ? "✓ " : (i + 1) + ". ") + m.text;
    if (m.done) {
      li.className = "ok";
    } else if (!nextFound) {
      li.className = "next";
      nextFound = true;
    }
    list.appendChild(li);
  });
  if (!nextFound && !drawMissions.celebrated) {
    drawMissions.celebrated = true;
    print("🎉 All missions complete! You know the basic Git flow.", "info");
  }
}

function complete(n) {
  missions[n].done = true;
  drawMissions();
}

function print(text, cls) {
  var line = document.createElement("div");
  line.textContent = text;
  if (cls) line.className = cls;
  $("term-out").appendChild(line);
  $("term").scrollTop = $("term").scrollHeight;
}

function names(status) {
  return Object.keys(repo.files).filter(function (f) { return repo.files[f] === status; });
}

function runGit(args) {
  var sub = args[0];

  if (sub === "init") {
    if (repo.init) return print("Repository already initialized.", "err");
    repo.init = true;
    complete(0);
    return print("Initialized empty Git repository.");
  }
  if (!repo.init) return print("fatal: not a git repository. Run 'git init' first.", "err");

  if (sub === "status") {
    print("On branch " + repo.branch);
    var staged = names("staged"), mod = names("modified"), untracked = names("untracked");
    if (staged.length) print("Changes to be committed:\n   " + staged.join("\n   "), "info");
    if (mod.length) print("Changes not staged:\n   modified: " + mod.join("\n   modified: "), "err");
    if (untracked.length) print("Untracked files:\n   " + untracked.join("\n   "), "err");
    if (!staged.length && !mod.length && !untracked.length) print("Nothing to commit, working tree clean.");
    return;
  }

  if (sub === "add") {
    if (!args[1]) return print("Nothing specified. Try 'git add .' or 'git add file.txt'.", "err");
    var changed = 0;
    Object.keys(repo.files).forEach(function (f) {
      var s = repo.files[f];
      if ((args[1] === "." || args[1] === f) && (s === "untracked" || s === "modified")) {
        repo.files[f] = "staged";
        changed++;
      }
    });
    if (!changed) return print("Nothing to add (or file not found).", "err");
    complete(2);
    return print("Staged " + changed + " file(s).");
  }

  if (sub === "commit") {
    var m = args.join(" ").match(/-m\s+["']?(.+?)["']?$/);
    if (!m) return print('Use: git commit -m "your message"', "err");
    var toCommit = names("staged");
    if (!toCommit.length) return print("Nothing staged. Use 'git add' first.", "err");
    toCommit.forEach(function (f) { repo.files[f] = "committed"; });
    var id = Math.random().toString(16).slice(2, 9);
    repo.commits.push({ id: id, msg: m[1], branch: repo.branch });
    complete(3);
    return print("[" + repo.branch + " " + id + "] " + m[1] + " (" + toCommit.length + " file(s))");
  }

  if (sub === "log") {
    if (!repo.commits.length) return print("No commits yet.", "err");
    repo.commits.slice().reverse().forEach(function (c) { print(c.id + "  " + c.msg); });
    return;
  }

  if (sub === "branch") {
    return repo.branches.forEach(function (b) { print((b === repo.branch ? "* " : "  ") + b); });
  }

  if (sub === "switch" || sub === "checkout") {
    var create = args[1] === "-c" || args[1] === "-b";
    var name = create ? args[2] : args[1];
    if (!name) return print("Give a branch name.", "err");
    if (create) {
      if (repo.branches.indexOf(name) !== -1) return print("Branch already exists.", "err");
      repo.branches.push(name);
      complete(4);
    } else if (repo.branches.indexOf(name) === -1) {
      return print("No branch named '" + name + "'.", "err");
    }
    repo.branch = name;
    return print("Switched to branch '" + name + "'");
  }

  if (sub === "merge") {
    var other = args[1];
    if (!other || repo.branches.indexOf(other) === -1) return print("Unknown branch.", "err");
    if (other === repo.branch) return print("Can't merge a branch into itself.", "err");
    complete(5);
    return print("Merged '" + other + "' into '" + repo.branch + "'.");
  }

  if (sub === "remote") {
    if (args[1] === "add" && args[2] && args[3]) {
      repo.remote = args[3];
      complete(6);
      return print("Remote '" + args[2] + "' added.");
    }
    if (!args[1]) return print(repo.remote ? "origin  " + repo.remote : "(no remotes)");
    return print("Use: git remote add origin <url>", "err");
  }

  if (sub === "push") {
    if (!repo.remote) return print("fatal: no remote. Use 'git remote add origin <url>'.", "err");
    if (!repo.commits.length) return print("Nothing to push. Make a commit first.", "err");
    var count = repo.commits.length - repo.pushed;
    repo.pushed = repo.commits.length;
    complete(7);
    return print("Pushed " + count + " commit(s) to " + repo.remote);
  }

  if (sub === "pull") return print("Already up to date.");

  print("git: '" + sub + "' is not supported in this simulator. Try 'help'.", "err");
}

function runCommand(input) {
  var parts = input.trim().split(/\s+/);
  var cmd = parts[0];

  if (cmd === "help") {
    return print("Try: ls, touch file, edit file, git init, git status, git add ., git commit -m \"msg\",\n     git log, git branch, git switch -c name, git merge name,\n     git remote add origin url, git push, clear, reset", "info");
  }
  if (cmd === "clear") { $("term-out").innerHTML = ""; return; }
  if (cmd === "reset") {
    resetRepo();
    missions.forEach(function (m) { m.done = false; });
    drawMissions.celebrated = false;
    drawMissions();
    $("term-out").innerHTML = "";
    return print("Simulator reset.", "info");
  }
  if (cmd === "ls") {
    var all = Object.keys(repo.files);
    return print(all.length ? all.join("  ") : "(empty folder)");
  }
  if (cmd === "touch") {
    if (!parts[1]) return print("Usage: touch file.txt", "err");
    if (repo.files[parts[1]]) return print("File already exists.", "err");
    repo.files[parts[1]] = "untracked";
    complete(1);
    return print("Created " + parts[1]);
  }
  if (cmd === "edit") {
    var f = parts[1];
    if (!f || !repo.files[f]) return print("File not found.", "err");
    if (repo.files[f] === "committed") repo.files[f] = "modified";
    return print("Edited " + f);
  }
  if (cmd === "git") {
    if (parts.length < 2) return print("usage: git <command>", "err");
    return runGit(parts.slice(1));
  }
  print(cmd + ": command not found. Type 'help'.", "err");
}

function updatePrompt() {
  $("term-prompt").textContent = "~/project" + (repo.init ? " (" + repo.branch + ")" : "") + " $";
}

var history = [], historyPos = 0;
$("term-in").addEventListener("keydown", function (e) {
  var input = $("term-in");
  if (e.key === "Enter") {
    var text = input.value;
    if (!text.trim()) return;
    print($("term-prompt").textContent + " " + text, "cmd");
    history.push(text);
    historyPos = history.length;
    input.value = "";
    runCommand(text);
    updatePrompt();
  } else if (e.key === "ArrowUp" && historyPos > 0) {
    input.value = history[--historyPos];
    e.preventDefault();
  } else if (e.key === "ArrowDown") {
    historyPos = Math.min(historyPos + 1, history.length);
    input.value = history[historyPos] || "";
    e.preventDefault();
  }
});
$("term").addEventListener("click", function () { $("term-in").focus(); });

print("Welcome! Type 'help' to see commands. Start with the first mission.", "info");
drawMissions();
updatePrompt();
