const introScreen = document.getElementById('intro-screen');
const enterBtn = document.getElementById('enter-btn');
const mainContent = document.getElementById('main-content');
const suggestBtn = document.getElementById('suggest-btn');
const interestInput = document.getElementById('interest-input');
const resultsContainer = document.getElementById('results-container');

// --- 3D ANIMATIONS & TRANSITION LOGIC ---

// 1. INTRO SCREEN 3D ANIMATION (STARFIELD)
const introScene = new THREE.Scene();
const introCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const introRenderer = new THREE.WebGLRenderer({ canvas: document.getElementById('intro-canvas') });
introRenderer.setSize(window.innerWidth, window.innerHeight);
introCamera.position.z = 5;
const starVertices = [];
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}
const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
const stars = new THREE.Points(starGeometry, starMaterial);
introScene.add(stars);

function animateIntro() {
    if (introScreen.style.display === 'none') return;
    requestAnimationFrame(animateIntro);
    stars.rotation.x += 0.0001;
    stars.rotation.y += 0.0002;
    introRenderer.render(introScene, introCamera);
}
animateIntro();

// 2. MAIN CONTENT 3D ANIMATION (ROTATING TORUS)
const mainScene = new THREE.Scene();
const mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const mainRenderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), alpha: true });
mainRenderer.setPixelRatio(window.devicePixelRatio);
mainRenderer.setSize(window.innerWidth, window.innerHeight);
mainCamera.position.setZ(30);
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0x9d00ff });
const torus = new THREE.Mesh(geometry, material);
mainScene.add(torus);
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);
const ambientLight = new THREE.AmbientLight(0x404040);
mainScene.add(pointLight, ambientLight);

function animateMain() {
    requestAnimationFrame(animateMain);
    torus.rotation.x += 0.001;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.001;
    mainRenderer.render(mainScene, mainCamera);
}
animateMain();

// 3. TRANSITION LOGIC
enterBtn.addEventListener('click', () => {
    introScreen.classList.add('hidden');
    setTimeout(() => {
        introScreen.style.display = 'none';
        mainContent.style.display = 'flex';
        document.body.style.overflow = 'auto';
        setTimeout(() => { mainContent.style.opacity = '1'; }, 50);
    }, 1000);
});

// --- 4. THE "ALL-KNOWING" AI API SIMULATION (ADVANCED VERSION) ---
function fetchCareerDataFromAI() {
    console.log("Contacting Global Trends & Career AI...");
    return new Promise((resolve) => {
        const aiResponse = {
            globalTrends: [
                { name: "Generative AI Integration", description: "The embedding of generative AI into core business software and workflows, moving from standalone tools to essential features.", impact: "Creates demand for 'AI-literate' professionals in every field, not just tech. Roles like AI Content Strategist and AI Systems Integrator are emerging.", keywords: ["trends", "global", "generative ai", "automation"] },
                { name: "The Sustainability Imperative (ESG)", description: "A global corporate shift to prioritize Environmental, Social, and Governance (ESG) factors, driven by investor pressure, regulation, and consumer demand.", impact: "Explosive growth in green jobs. High demand for Sustainability Analysts, ESG Compliance Managers, and Renewable Energy Engineers.", keywords: ["trends", "global", "green", "sustainability", "energy", "esg"] },
                { name: "Hyper-Personalization at Scale", description: "Using AI to deliver deeply individualized experiences for customers in retail, healthcare, and finance, based on real-time data.", impact: "Drives need for Data Scientists, Customer Experience (CX) Architects, and Personalization Ethicists.", keywords: ["trends", "personalization", "cx", "data"] }
            ],
            industrySectors: [
                {
                    sectorName: "Technology",
                    overview: "The core driver of global innovation, encompassing software, hardware, cloud infrastructure, and cybersecurity.",
                    keywords: ["tech", "technology", "it", "software", "code", "developer"],
                    interests: ["AI & Machine Learning", "Cloud Computing", "Cybersecurity", "Software Development", "Data Science"],
                    upcomingAiTrends: ["Agentic AI Swarms for complex problem-solving", "AI for code generation and debugging (DevEx)", "Quantum Machine Learning simulations"],
                    emergingRoles: [
                        { title: "AI/ML Engineer", interest: "AI & Machine Learning", description: "Designs and builds production-grade AI models. A highly sought-after role bridging research and real-world application.", skills: ["Python", "TensorFlow/PyTorch", "MLOps", "Advanced Math"], salaryUSD: { entry: "100k-130k", mid: "130k-180k", senior: "180k-250k+" }, demand: "Exceptional" },
                        { title: "Cloud Security Engineer", interest: "Cloud Computing", description: "Specializes in securing cloud environments (AWS, Azure, GCP) against threats. A critical role as more companies move to the cloud.", skills: ["AWS/Azure/GCP", "Infrastructure as Code (Terraform)", "Network Security"], salaryUSD: { entry: "95k-120k", mid: "120k-170k", senior: "170k-220k+" }, demand: "Very High" },
                        { title: "Data Scientist", interest: "Data Science", description: "Extracts actionable insights from large, complex datasets to drive business decisions.", skills: ["SQL", "Python/R", "Statistics", "Data Visualization (Tableau)"], salaryUSD: { entry: "90k-115k", mid: "115k-160k", senior: "160k-210k+" }, demand: "Very High" }
                    ]
                },
                {
                    sectorName: "Finance & FinTech",
                    overview: "The technology-driven disruption of traditional financial services, focusing on automation, decentralization, and data-driven insights.",
                    keywords: ["finance", "fintech", "banking", "investing", "crypto", "blockchain", "defi"],
                    interests: ["Algorithmic Trading", "Decentralized Finance (DeFi)", "Financial Analysis", "Cybersecurity"],
                    upcomingAiTrends: ["AI for real-time fraud detection and prevention", "Robo-advisors with hyper-personalized investment strategies", "AI-driven credit scoring using alternative data"],
                    emergingRoles: [
                        { title: "Quantitative Analyst (Quant)", interest: "Algorithmic Trading", description: "Uses mathematical models and AI to develop and execute high-frequency trading strategies.", skills: ["C++/Python", "Advanced Calculus & Statistics", "Financial Modeling"], salaryUSD: { entry: "120k-160k", mid: "160k-250k", senior: "250k-500k+" }, demand: "Exceptional" },
                        { title: "Smart Contract Auditor", interest: "Decentralized Finance (DeFi)", description: "A specialized cybersecurity role focused on finding vulnerabilities in blockchain smart contracts to prevent catastrophic hacks.", skills: ["Solidity", "Blockchain Architecture", "Security Auditing"], salaryUSD: { entry: "110k-150k", mid: "150k-200k", senior: "200k-300k+" }, demand: "Critical & High" }
                    ]
                },
                {
                    sectorName: "Healthcare & Biotechnology",
                    overview: "A revolution in patient care driven by data, AI, and genetic science, leading to more personalized and preventative treatments.",
                    keywords: ["healthcare", "medical", "biotech", "health", "pharma"],
                    interests: ["Bioinformatics", "Personalized Medicine", "Medical Devices", "Telehealth"],
                    upcomingAiTrends: ["AI-powered drug discovery and clinical trial optimization", "Predictive diagnostics from wearable sensor data", "Generative AI for creating synthetic patient data for research"],
                    emergingRoles: [
                        { title: "Bioinformatics Scientist", interest: "Bioinformatics", description: "Analyzes vast biological datasets (DNA, proteins) using computation to fuel medical breakthroughs.", skills: ["Python/R", "Genomics", "Biostatistics", "Machine Learning"], salaryUSD: { entry: "90k-120k", mid: "120k-165k", senior: "165k-220k+" }, demand: "Very High" },
                        { title: "Robotic Surgery Technician", interest: "Medical Devices", description: "Assists surgeons by preparing and maintaining robotic surgical systems like the da Vinci system.", skills: ["Biomedical Technology", "Mechanical Aptitude", "Anatomy"], salaryUSD: { entry: "60k-80k", mid: "80k-100k", senior: "100k-125k+" }, demand: "High" }
                    ]
                },
                {
                    sectorName: "Creative & Media",
                    overview: "The convergence of art, entertainment, and technology, increasingly shaped by generative AI and immersive experiences.",
                    keywords: ["creative", "media", "art", "design", "entertainment", "games"],
                    interests: ["UI/UX Design", "Game Development", "VFX & Animation", "AI Content Creation"],
                    upcomingAiTrends: ["AI-powered tools for 3D asset generation", "Real-time VFX rendering in game engines", "AI for script analysis and storyboarding"],
                    emergingRoles: [
                        { title: "UI/UX Designer", interest: "UI/UX Design", description: "Designs the look, feel, and interactivity of digital products to be intuitive and engaging for users.", skills: ["Figma", "User Research", "Prototyping", "Interaction Design"], salaryUSD: { entry: "75k-95k", mid: "95k-130k", senior: "130k-170k+" }, demand: "Very High" },
                        { title: "VFX Artist", interest: "VFX & Animation", description: "Creates visual effects for film, TV, and games using software like Houdini and Blender. AI tools are becoming essential for efficiency.", skills: ["Houdini/Blender/Maya", "Compositing (Nuke)", "Particle Systems"], salaryUSD: { entry: "65k-85k", mid: "85k-120k", senior: "120k-160k+" }, demand: "High" }
                    ]
                }
            ]
        };
        setTimeout(() => {
            console.log("Advanced AI Response Received.");
            resolve(aiResponse);
        }, 1200);
    });
}

// --- 5. ADVANCED API QUERY & DISPLAY LOGIC ---
suggestBtn.addEventListener('click', async () => {
    const userInput = interestInput.value;
    if (!userInput) return;

    resultsContainer.innerHTML = `<div class="career-card"><p>Accessing advanced AI knowledge base...</p></div>`;
    suggestBtn.disabled = true;
    suggestBtn.textContent = 'Analyzing...';

    const aiData = await fetchCareerDataFromAI();
    const results = parseAIResponse(userInput, aiData);
    displayResults(results);

    suggestBtn.disabled = false;
    suggestBtn.textContent = 'Find My Future';
});

function parseAIResponse(query, aiData) {
    const lowerQuery = query.toLowerCase();
    let foundResults = [];
    const addedTitles = new Set();

    const addResult = (result) => {
        const key = result.title || result.name;
        if (!addedTitles.has(key)) {
            foundResults.push(result);
            addedTitles.add(key);
        }
    };

    if (lowerQuery.includes('trend')) {
        aiData.globalTrends.forEach(trend => addResult({ type: 'trend', ...trend }));
    }

    aiData.industrySectors.forEach(sector => {
        const sectorKeywords = [...sector.keywords, ...sector.interests.map(i => i.toLowerCase())];
        if (sectorKeywords.some(k => lowerQuery.includes(k))) {
            if (lowerQuery.includes('trend')) {
                sector.upcomingAiTrends.forEach(trendName => addResult({
                    type: 'trend',
                    name: `${trendName} (in ${sector.sectorName})`,
                    description: `A key upcoming AI development within the ${sector.sectorName.toLowerCase()} sector.`,
                    impact: "Drives innovation and creates specialized new roles."
                }));
            }
            sector.emergingRoles.forEach(role => {
                if (role.interest.toLowerCase().includes(lowerQuery) || sector.keywords.some(k => lowerQuery.includes(k))) {
                    addResult({ type: 'role', ...role });
                }
            });
        }
    });

    if (foundResults.length === 0) {
        return [{ type: 'error', title: 'No specific match found', description: 'My knowledge base is vast. Please try more specific queries like "cybersecurity jobs", "AI trends in finance", "game development salary", or "global trends".' }];
    }
    return foundResults;
}

function displayResults(results) {
    resultsContainer.innerHTML = '';
    results.forEach(result => {
        const card = document.createElement('div');
        card.className = 'career-card';

        if (result.type === 'role') {
            const salaryInfo = `Entry: ${result.salaryUSD.entry}, Mid: ${result.salaryUSD.mid}, Senior: ${result.salaryUSD.senior}`;
            card.innerHTML = `
                <h3>${result.title} <span style="color:#ccc; font-weight:300;">(Job Role in ${result.interest})</span></h3>
                <p>${result.description}</p>
                <div class="career-details">
                    <div><strong>Core Skills:</strong> ${result.skills.join(', ')}</div>
                    <div><strong>Est. Salary (USD):</strong> ${salaryInfo}</div>
                    <div><strong>Demand Outlook:</strong> ${result.demand}</div>
                </div>
            `;
        } else if (result.type === 'trend') {
            card.innerHTML = `
                <h3>${result.name} <span style="color:#ccc; font-weight:300;">(Trend)</span></h3>
                <p>${result.description}</p>
                <div class="career-details">
                    <div><strong>Primary Impact:</strong> ${result.impact}</div>
                </div>
            `;
        } else {
            card.innerHTML = `<h3>${result.title}</h3><p>${result.description}</p>`;
        }
        resultsContainer.appendChild(card);
    });
}

// Handle window resizing (same as before)
window.addEventListener('resize', () => {
    introCamera.aspect = window.innerWidth / window.innerHeight;
    introCamera.updateProjectionMatrix();
    introRenderer.setSize(window.innerWidth, window.innerHeight);
    mainCamera.aspect = window.innerWidth / window.innerHeight;
    mainCamera.updateProjectionMatrix();
    mainRenderer.setSize(window.innerWidth, window.innerHeight);
});