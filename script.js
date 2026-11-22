// Construit les compétences et les projets à partir des fichiers JSON du dossier /data.
// Pour modifier le contenu, il suffit d'éditer data/skills.json et data/portfolio.json.

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
}

async function loadJSON(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`${path} : ${response.status}`);
    return response.json();
}

async function renderSkills() {
    const container = document.getElementById("skills-list");
    try {
        const groups = await loadJSON("data/skills.json");
        groups.forEach((group) => {
            const block = el("div");
            block.appendChild(el("h3", null, group.title));
            const list = el("ul");
            group.items.forEach((item) => list.appendChild(el("li", null, item)));
            block.appendChild(list);
            container.appendChild(block);
        });
    } catch (error) {
        console.error("Erreur de chargement des compétences :", error);
        container.appendChild(el("p", "note", "Les compétences n'ont pas pu être chargées."));
    }
}

function linkLabel(url) {
    const isRepo = url.includes("github.com") && !url.includes("github.io");
    return isRepo ? "Voir le code" : "Voir le projet";
}

function buildCard(project) {
    const card = el("article", "card");
    if (project.image) {
        const img = el("img");
        img.src = `images/${project.image}`;
        img.alt = "";
        img.loading = "lazy";
        card.appendChild(img);
    }
    const body = el("div", "card-body");
    body.appendChild(el("h4", null, project.title));
    if (project.tags && project.tags.length) {
        const tags = el("ul", "tags");
        project.tags.forEach((tag) => tags.appendChild(el("li", null, tag)));
        body.appendChild(tags);
    }
    body.appendChild(el("p", null, project.text));
    if (project.link) {
        const link = el("a", "more", `${linkLabel(project.link)} →`);
        link.href = project.link;
        link.rel = "noopener";
        link.setAttribute("aria-label", `${linkLabel(project.link)} : ${project.title}`);
        body.appendChild(link);
    }
    card.appendChild(body);
    return card;
}

async function renderProjects() {
    const targets = {
        test: document.getElementById("projects-test"),
        dev: document.getElementById("projects-dev"),
    };
    try {
        const projects = await loadJSON("data/portfolio.json");
        projects.forEach((project) => {
            const target = targets[project.category] || targets.dev;
            target.appendChild(buildCard(project));
        });
    } catch (error) {
        console.error("Erreur de chargement des projets :", error);
        targets.test.appendChild(el("p", "note", "Les projets n'ont pas pu être chargés."));
    }
}

renderSkills();
renderProjects();
