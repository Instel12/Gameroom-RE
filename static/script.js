const title = document.getElementById("title");
const content = document.getElementById("maincontent");
const defaultRepo = "https://raw.githubusercontent.com/Instel12/Astria-Repo/refs/heads/main/repo.json";

let repos = JSON.parse(localStorage.getItem("repos") || "[]");

if (!repos.includes(defaultRepo)) {
    repos.unshift(defaultRepo);
    localStorage.setItem("repos", JSON.stringify(repos));
}

window.onload = function () {
    loadHomepage();

    let isRed = true;
    setInterval(() => {
        const warnings = document.querySelectorAll(".warning");
        warnings.forEach(el => el.style.color = isRed ? "yellow" : "red");
        isRed = !isRed;
    }, 300);
};

function loadHomepage() {
    title.textContent = "GAMEROOM RE";

    content.innerHTML = `
        <center>
            <h1>Welcome to Gameroom RE!</h1>
        </center>
        <hr>
        <p>
            Gameroom RE is the most accessible version of Gameroom that you can host with almost no work at all or you can just run it locally! 
            Nothing here is actually hosted by Gameroom rather the sources the game comes from so be aware of that. 
            <span class="warning">I am responsible for absolutely nothing that goes wrong while using this service!</span> 
            If you want more games, <a onclick="loadRepoPage();">edit your repos</a>. And with all of that said, have fun!
        </p>
        <hr>
        <center>
            More coming soon!
        </center>
    `;
}

function loadRepoPage() {
    title.textContent = "REPOS";

    content.innerHTML = `
        <center>
            <h1>Edit your Repos</h1>
            <input type="text" id="newRepo" placeholder="Enter repo URL" style="width: 300px;">
            <button id="addRepo">Add Repo</button>
        </center>
        <ul id="repoList"></ul>
    `;

    renderRepos();

    document.getElementById("addRepo").onclick = () => {
        const input = document.getElementById("newRepo");
        const url = input.value.trim();
        if (url) {
            addRepo(url);
            input.value = "";
        }
    };
}

async function loadRepoFromURL(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch repo");
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error loading repo:", url, err);
        return null;
    }
}

async function renderRepos() {
    const list = document.getElementById("repoList");
    list.innerHTML = "";

    for (let i = 0; i < repos.length; i++) {
        const repoURL = repos[i];
        const data = await loadRepoFromURL(repoURL);

        const li = document.createElement("li");
        li.style.marginBottom = "10px";
        li.style.display = "flex";
        li.style.alignItems = "center";
        li.style.gap = "10px";

        if (data) {
            const icon = document.createElement("img");
            icon.src = data.icon;
            icon.width = 32;
            icon.height = 32;
            icon.style.verticalAlign = "middle";

            const titleText = document.createElement("span");
            titleText.textContent = data.title;

            const urlText = document.createElement("small");
            urlText.textContent = ` (${repoURL})`;

            li.appendChild(icon);
            li.appendChild(titleText);
            li.appendChild(urlText);
        } else {
            li.textContent = repoURL + " (Failed to load)";
        }

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Delete";
        if (repoURL === defaultRepo) {
            removeBtn.disabled = true;
        } else {
            removeBtn.onclick = () => removeRepo(i);
        }
        li.appendChild(removeBtn);

        list.appendChild(li);
    }
}

function addRepo(url) {
    if (!repos.includes(url)) {
        repos.push(url);
        localStorage.setItem("repos", JSON.stringify(repos));
        renderRepos();
    } else {
        alert("Repo already added!");
    }
}

function removeRepo(index) {
    repos.splice(index, 1);
    localStorage.setItem("repos", JSON.stringify(repos));
    renderRepos();
}

function loadGamePage(gameTitle, gameUrl) {
    title.textContent = gameTitle;

    content.innerHTML = `
        <center>
            <br><br>
            <iframe id="playFrame" width="75%" height="600"></iframe>
            <br><br><br>
            <iframe id="fullscreenFrame" width="75%" height="30"></iframe>
        </center>
    `;

    const playIframe = document.getElementById("playFrame");
    const playDoc = playIframe.contentDocument || playIframe.contentWindow.document;


    playDoc.open();
    playDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
                button {
                    font-size: 25px;
                    font-family: 'Press Start 2P';
                    color: white;
                    background-color: #cc4331;
                    border: none;
                    border-radius: 5px;
                    width: 100%;
                    height: 100vh;
                    cursor: pointer;
                }
                body { display: flex; flex-direction: column; padding: 0; margin: 0; }
            </style>
        </head>
        <body>
            <button id="playBtn">Play</button>
            <script>
                const gameUrl = "${gameUrl}";
                document.getElementById('playBtn').onclick = async () => {
                    try {
                        const res = await fetch(gameUrl);
                        const text = await res.text();
                        document.open();
                        document.write(text);
                        document.close();
                    } catch (err) {
                        alert('Failed to load content!');
                    }
                };
            <\/script>
        </body>
        </html>
    `);
    playDoc.close();

    const fullIframe = document.getElementById("fullscreenFrame");
    const fullDoc = fullIframe.contentDocument || fullIframe.contentWindow.document;

    fullDoc.open();
    fullDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
                button {
                    font-size: 20px;
                    font-family: 'Press Start 2P';
                    color: white;
                    background-color: #cc4331;
                    border: none;
                    border-radius: 5px;
                    width: 100%;
                    height: 95vh;
                    cursor: pointer;
                }
                body { display: flex; flex-direction: column; padding: 0; margin: 0; }
            </style>
        </head>
        <body>
            <button id="fullscreenBtn">Fullscreen</button>
            <script>
                const gameUrl = "${gameUrl}";
                document.getElementById('fullscreenBtn').onclick = async () => {
                    try {
                        const res = await fetch(gameUrl);
                        const text = await res.text();
                        const newWindow = window.open('about:blank', '_blank');
                        if (newWindow) {
                            newWindow.document.open();
                            newWindow.document.write(text);
                            newWindow.document.close();
                        } else {
                            alert('Pop-up blocked. Please allow pop-ups for this site.');
                        }
                    } catch (err) {
                        alert('Failed to load content!');
                    }
                };
            <\/script>
        </body>
        </html>
    `);
    fullDoc.close();
}

async function updateSidebarGames() {
    const sidebar = document.querySelector(".sidebar");
    const existingGames = new Set();

    sidebar.querySelectorAll("a[data-game-url]").forEach(a => {
        existingGames.add(a.dataset.gameUrl);
    });

    for (let repoURL of repos) {
        try {
            const res = await fetch(repoURL);
            if (!res.ok) throw new Error("Failed to fetch repo");
            const repoData = await res.json();

            if (!repoData.games) continue;

            for (let game of repoData.games) {
                if (!existingGames.has(game.url)) {
                    const p = document.createElement("p");
                    const a = document.createElement("a");
                    a.textContent = game.title;
                    a.dataset.gameUrl = game.url;

                    a.onclick = () => {
                        loadGamePage(game.title, game.url);
                        return false;
                    };

                    p.appendChild(a);
                    sidebar.appendChild(p);
                    existingGames.add(game.url);
                }
            }
        } catch {
        }
    }
}

updateSidebarGames();
