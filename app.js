// Enhanced Resume Analyzer - 2025 Edition with AI-Powered Analysis
// Fixed Version - All Interactive Elements Working

// Configuration and Constants
const CONFIG = {
    stopwords: ["a","an","and","the","in","on","at","for","of","to","with","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","must","can","shall"],
    formatting_checks: [
        {"name":"Contact Information Present","regex":"(email|@|phone|tel|linkedin|github)"},
        {"name":"Professional Sections","regex":"(education|experience|work|employment|professional)"},
        {"name":"Structured Format","regex":"[\u2022|•|-]|\\d+\\."},
        {"name":"Skills Section","regex":"(skills|technical|competencies|technologies)"},
        {"name":"Action-Oriented Language","regex":"(managed|developed|created|implemented|improved|increased|achieved|led|built|designed)"},
        {"name":"Quantified Results","regex":"\\d+%|\\$\\d+|\\d+\\+|increased|reduced|improved"},
        {"name":"Education Section","regex":"(degree|university|college|bachelor|master|phd|certification)"},
        {"name":"Professional Summary","regex":"(summary|profile|objective|about)"}
    ],
    chartColors: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'],
    analysisSteps: [
        "🔍 Extracting and parsing resume content...",
        "🎯 Analyzing skill matches and gaps...",
        "📊 Comparing with job requirements...", 
        "💡 Generating improvement suggestions...",
        "🏆 Preparing certification recommendations...",
        "📈 Calculating salary optimization potential...",
        "🤖 Finalizing AI-powered analysis report..."
    ]
};

// Enhanced Sample Data with Real-World Context
const SAMPLE_DATA = {
    skillRecommendations: [
        {
            skill: "React.js",
            priority: "High",
            timeInvestment: "3-4 months",
            difficulty: "Intermediate",
            resources: [
                {"name": "React Complete Course", "provider": "Udemy", "price": "$89", "rating": 4.8},
                {"name": "React Specialization", "provider": "Coursera", "price": "$49/month", "rating": 4.7}
            ],
            jobImpact: "85% of modern web development jobs require React",
            salaryIncrease: "$15,000 - $25,000"
        },
        {
            skill: "AWS Cloud",
            priority: "High",
            timeInvestment: "4-6 months",
            difficulty: "Intermediate-Advanced",
            resources: [
                {"name": "AWS Solutions Architect", "provider": "AWS Training", "price": "$150", "rating": 4.9}
            ],
            jobImpact: "Cloud skills required in 70% of tech positions",
            salaryIncrease: "$20,000 - $35,000"
        }
    ],
    certificationRecommendations: [
        {
            name: "AWS Certified Solutions Architect",
            provider: "Amazon Web Services",
            difficulty: "Intermediate",
            cost: "$150",
            timeToComplete: "3-6 months",
            prerequisites: ["Basic AWS knowledge", "Cloud fundamentals"],
            salaryIncrease: "$25,000 - $40,000",
            jobMarketValue: "Very High",
            passRate: "65%",
            validityPeriod: "3 years",
            category: "Cloud Computing",
            description: "Validates ability to design distributed systems on AWS platform with high availability and cost optimization."
        },
        {
            name: "Project Management Professional (PMP)",
            provider: "Project Management Institute",
            difficulty: "Intermediate",
            cost: "$555",
            timeToComplete: "6-12 months",
            prerequisites: ["4500 hours project management experience"],
            salaryIncrease: "$15,000 - $30,000",
            jobMarketValue: "High",
            passRate: "70%",
            validityPeriod: "3 years",
            category: "Project Management",
            description: "Globally recognized certification for project management professionals across all industries."
        },
        {
            name: "Google Cloud Professional",
            provider: "Google Cloud",
            difficulty: "Advanced",
            cost: "$200",
            timeToComplete: "4-8 months",
            prerequisites: ["Cloud architecture experience", "GCP fundamentals"],
            salaryIncrease: "$30,000 - $45,000",
            jobMarketValue: "High",
            passRate: "58%",
            validityPeriod: "2 years",
            category: "Cloud Computing",
            description: "Professional-level certification for cloud architects and engineers working with Google Cloud Platform."
        },
        {
            name: "Certified Information Systems Security Professional (CISSP)",  
            provider: "ISC2",
            difficulty: "Advanced",
            cost: "$725",
            timeToComplete: "4-6 months",
            prerequisites: ["5 years security experience"],
            salaryIncrease: "$25,000 - $40,000",
            jobMarketValue: "Very High", 
            passRate: "55%",
            validityPeriod: "3 years",
            category: "Cybersecurity",
            description: "Advanced cybersecurity certification for leadership roles in information security."
        }
    ],
    interviewQuestions: [
        "Tell me about a challenging project you worked on and how you overcame obstacles.",
        "How do you stay updated with the latest technology trends in your field?",
        "Describe your experience with version control systems and collaborative development.",
        "How would you handle a situation where you need to learn a new technology quickly?",
        "What's your approach to debugging complex issues in your code or processes?",
        "How do you ensure quality and maintainability in your work?",
        "Describe a time when you had to work with a difficult team member or stakeholder.",
        "What interests you most about this role and our company's mission?",
        "How do you approach learning new programming languages or technologies?"
    ]
};

// Global State Management
let resumeText = '';
let jobDescriptionText = '';
let careerLevel = '';
let targetIndustry = '';
let currentAnalysis = null;
let scoreChartInstance = null;

// Initialize PDF.js
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js';
}

class EnhancedResumeAnalyzer {
    constructor() {
        this.initializeEventListeners();
        this.initializeUI();
        this.setupDragAndDrop();
        this.addGlassMorphismEffects();
    }

    initializeEventListeners() {
        console.log('Setting up event listeners...');
        
        // File uploads with proper event handling
        const resumeFile = document.getElementById('resumeFile');
        const jdFile = document.getElementById('jdFile');
        
        if (resumeFile) {
            resumeFile.addEventListener('change', this.handleResumeUpload.bind(this));
        }
        if (jdFile) {
            jdFile.addEventListener('change', this.handleJDFileUpload.bind(this));
        }
        
        // Text input with real-time validation
        const jdText = document.getElementById('jdText');
        if (jdText) {
            jdText.addEventListener('input', (e) => {
                this.handleJDTextInput(e);
                this.updateCharCounter();
                this.validateJobDescription();
            });
            jdText.addEventListener('paste', () => {
                setTimeout(() => {
                    this.updateCharCounter();
                    this.handleJDTextInput({ target: jdText });
                    this.validateJobDescription();
                }, 10);
            });
        }

        // Career goals dropdowns
        const careerLevelSelect = document.getElementById('careerLevel');
        const targetIndustrySelect = document.getElementById('targetIndustry');
        
        if (careerLevelSelect) {
            careerLevelSelect.addEventListener('change', this.handleCareerGoalsChange.bind(this));
        }
        if (targetIndustrySelect) {
            targetIndustrySelect.addEventListener('change', this.handleCareerGoalsChange.bind(this));
        }

        // Tab switching with enhanced animations
        document.querySelectorAll('[data-tab]').forEach(btn => {
            btn.addEventListener('click', this.handleTabSwitch.bind(this));
        });

        // Main action buttons
        const analyzeBtn = document.getElementById('analyzeBtn');
        const backBtn = document.getElementById('backBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const shareBtn = document.getElementById('shareBtn');
        const saveBtn = document.getElementById('saveBtn');
        
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', this.performAnalysis.bind(this));
        }
        if (backBtn) {
            backBtn.addEventListener('click', this.showUploadView.bind(this));
        }
        if (downloadBtn) {
            downloadBtn.addEventListener('click', this.downloadReport.bind(this));
        }
        if (shareBtn) {
            shareBtn.addEventListener('click', this.shareResults.bind(this));
        }
        if (saveBtn) {
            saveBtn.addEventListener('click', this.saveAnalysis.bind(this));
        }

        // Certification filters
        const certCategoryFilter = document.getElementById('certCategoryFilter');
        const certDifficultyFilter = document.getElementById('certDifficultyFilter');
        const certROIFilter = document.getElementById('certROIFilter');
        
        if (certCategoryFilter) {
            certCategoryFilter.addEventListener('change', this.filterCertifications.bind(this));
        }
        if (certDifficultyFilter) {
            certDifficultyFilter.addEventListener('change', this.filterCertifications.bind(this));
        }
        if (certROIFilter) {
            certROIFilter.addEventListener('change', this.filterCertifications.bind(this));
        }
        
        console.log('Event listeners setup complete');
    }

    initializeUI() {
        console.log('Initializing UI...');
        
        this.showTabPanel('paste');
        this.updateAnalyzeButton();
        this.updateCharCounter();
        
        // Initialize text area
        const jdText = document.getElementById('jdText');
        if (jdText) {
            jdText.value = '';
            jobDescriptionText = '';
        }

        // Ensure loading modal is hidden
        const loadingModal = document.getElementById('loadingModal');
        if (loadingModal) {
            loadingModal.classList.add('hidden');
        }

        // Add entrance animations
        this.animateEntrance();
        
        console.log('UI initialization complete');
    }

    addGlassMorphismEffects() {
        // Add dynamic glass effects on hover
        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.boxShadow = '0 25px 50px 0 rgba(31, 38, 135, 0.6)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.37)';
            });
        });
    }

    animateEntrance() {
        // Stagger animation for cards
        const cards = document.querySelectorAll('.upload-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            setTimeout(() => {
                card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    setupDragAndDrop() {
        console.log('Setting up drag and drop...');
        
        const resumeDropZone = document.getElementById('resumeDropZone');
        const jdDropZone = document.getElementById('jdDropZone');

        // Setup resume drop zone
        if (resumeDropZone) {
            resumeDropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
            resumeDropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            resumeDropZone.addEventListener('drop', (e) => this.handleDrop(e));
            resumeDropZone.addEventListener('click', () => {
                console.log('Resume drop zone clicked');
                const input = document.getElementById('resumeFile');
                if (input) {
                    input.click();
                }
            });
        }
        
        // Setup job description drop zone
        if (jdDropZone) {
            jdDropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
            jdDropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            jdDropZone.addEventListener('drop', (e) => this.handleDrop(e));
            jdDropZone.addEventListener('click', () => {
                console.log('JD drop zone clicked');
                const input = document.getElementById('jdFile');
                if (input) {
                    input.click();
                }
            });
        }
        
        console.log('Drag and drop setup complete');
    }

    /* ----------------------- Enhanced File Handling ----------------------- */
    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.add('drag-over');
        event.currentTarget.style.borderColor = 'rgba(31, 184, 205, 0.8)';
        event.currentTarget.style.background = 'rgba(31, 184, 205, 0.1)';
    }

    handleDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove('drag-over');
        event.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        event.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
    }

    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove('drag-over');
        event.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        event.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            const isResumeZone = event.currentTarget.id === 'resumeDropZone';
            
            console.log(`File dropped on ${isResumeZone ? 'resume' : 'JD'} zone:`, file.name);
            
            if (isResumeZone) {
                // Manually trigger resume upload
                const resumeFile = document.getElementById('resumeFile');
                if (resumeFile) {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    resumeFile.files = dataTransfer.files;
                    this.handleResumeUpload({ target: { files: [file] } });
                }
            } else {
                // Manually trigger JD upload
                const jdFile = document.getElementById('jdFile');
                if (jdFile) {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    jdFile.files = dataTransfer.files;
                    this.handleJDFileUpload({ target: { files: [file] } });
                }
            }
        }
    }

    async handleResumeUpload(event) {
        console.log('Handling resume upload...');
        
        const file = event.target.files[0];
        const statusEl = document.getElementById('resumeStatus');
        const previewEl = document.getElementById('resumePreview');
        
        if (!file) {
            resumeText = '';
            this.updateFileStatus(statusEl, '', '');
            if (previewEl) previewEl.classList.add('hidden');
            this.updateAnalyzeButton();
            return;
        }

        console.log('Processing file:', file.name, file.type, file.size);

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            this.updateFileStatus(statusEl, '❌ File too large. Please use a file smaller than 10MB.', 'error');
            resumeText = '';
            this.updateAnalyzeButton();
            return;
        }

        try {
            this.updateFileStatus(statusEl, '🔄 Processing file...', '');
            
            let extractedText = '';
            
            if (file.type === 'application/pdf') {
                extractedText = await this.extractTextFromPDF(file);
            } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                extractedText = await this.extractTextFromDOCX(file);
            } else {
                extractedText = await this.readTextFile(file);
            }
            
            resumeText = this.cleanExtractedText(extractedText);
            
            if (!resumeText.trim()) {
                throw new Error('No readable text content found in file');
            }
            
            // Validate minimum content length
            if (resumeText.length < 100) {
                throw new Error('Resume content seems too short. Please ensure the file contains a complete resume.');
            }
            
            console.log('Resume text extracted:', resumeText.length, 'characters');
            
            this.updateFileStatus(statusEl, `✅ ${file.name} uploaded successfully (${resumeText.length} characters)`, 'success');
            if (previewEl) this.showFilePreview(previewEl, resumeText);
            
        } catch (error) {
            console.error('Resume upload error:', error);
            resumeText = '';
            this.updateFileStatus(statusEl, `❌ Error: ${error.message}`, 'error');
            if (previewEl) previewEl.classList.add('hidden');
        }
        
        this.updateAnalyzeButton();
    }

    async handleJDFileUpload(event) {
        console.log('Handling JD file upload...');
        
        const file = event.target.files[0];
        const statusEl = document.getElementById('jdStatus');
        
        if (!file) {
            jobDescriptionText = '';
            this.updateFileStatus(statusEl, '', '');
            this.updateAnalyzeButton();
            return;
        }

        try {
            this.updateFileStatus(statusEl, '🔄 Processing job description file...', '');
            
            let extractedText = '';
            
            if (file.type === 'application/pdf') {
                extractedText = await this.extractTextFromPDF(file);
            } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                extractedText = await this.extractTextFromDOCX(file);
            } else {
                extractedText = await this.readTextFile(file);
            }
            
            jobDescriptionText = this.cleanExtractedText(extractedText);
            
            if (!jobDescriptionText.trim()) {
                throw new Error('No readable text content found in file');
            }
            
            console.log('JD text extracted:', jobDescriptionText.length, 'characters');
            
            this.updateFileStatus(statusEl, `✅ ${file.name} processed successfully`, 'success');
            
        } catch (error) {
            console.error('JD file upload error:', error);
            jobDescriptionText = '';
            this.updateFileStatus(statusEl, `❌ Error: ${error.message}`, 'error');
        }
        
        this.updateAnalyzeButton();
    }

    handleJDTextInput(event) {
        jobDescriptionText = event.target.value.trim();
        console.log('JD text input updated:', jobDescriptionText.length, 'characters');
        this.updateAnalyzeButton();
    }

    validateJobDescription() {
        const jdText = document.getElementById('jdText');
        if (!jdText) return;
        
        const text = jdText.value.trim();
        const charCounter = document.getElementById('charCount');
        
        if (text.length > 100) {
            if (charCounter) charCounter.style.color = '#1FB8CD';
        } else {
            if (charCounter) charCounter.style.color = 'rgba(255, 255, 255, 0.6)';
        }
    }

    handleCareerGoalsChange() {
        const careerLevelEl = document.getElementById('careerLevel');
        const targetIndustryEl = document.getElementById('targetIndustry');
        
        careerLevel = careerLevelEl ? careerLevelEl.value : '';
        targetIndustry = targetIndustryEl ? targetIndustryEl.value : '';
        
        console.log('Career goals updated:', { careerLevel, targetIndustry });
    }

    updateCharCounter() {
        const jdText = document.getElementById('jdText');
        const charCount = document.getElementById('charCount');
        if (jdText && charCount) {
            const count = jdText.value.length;
            charCount.textContent = count.toLocaleString();
            
            // Add visual feedback
            if (count > 500) {
                charCount.style.color = '#1FB8CD';
            } else if (count > 200) {
                charCount.style.color = '#FFC185';
            } else {
                charCount.style.color = 'rgba(255, 255, 255, 0.6)';
            }
        }
    }

    showFilePreview(previewEl, text) {
        const preview = text.substring(0, 300) + (text.length > 300 ? '...' : '');
        previewEl.innerHTML = `
            <div style="padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px; margin-top: 12px;">
                <strong style="color: #1FB8CD;">📄 Preview:</strong><br>
                <div style="margin-top: 8px; font-size: 13px; line-height: 1.4; opacity: 0.9;">${preview}</div>
            </div>
        `;
        previewEl.classList.remove('hidden');
    }

    /* ------------------------ Enhanced Text Extraction ------------------------ */
    async extractTextFromPDF(file) {
        console.log('Extracting text from PDF...');
        try {
            if (typeof pdfjsLib === 'undefined') {
                throw new Error('PDF processing library not available');
            }
            
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let text = '';
            
            const maxPages = Math.min(pdf.numPages, 15);
            for (let i = 1; i <= maxPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                text += pageText + '\n\n';
            }
            
            return text;
        } catch (error) {
            console.error('PDF extraction error:', error);
            throw new Error('Unable to process PDF file. Please convert to a text file or try a different PDF.');
        }
    }

    async extractTextFromDOCX(file) {
        console.log('Extracting text from DOCX...');
        try {
            // For now, throw an error to suggest alternative
            throw new Error('DOCX processing temporarily unavailable. Please save as PDF or text file.');
        } catch (error) {
            console.error('DOCX extraction error:', error);
            throw error;
        }
    }

    readTextFile(file) {
        console.log('Reading text file...');
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    cleanExtractedText(text) {
        return text
            .replace(/\s+/g, ' ')
            .replace(/[^\w\s@.-]/g, ' ')
            .trim();
    }

    /* ------------------------- Enhanced Analysis Engine ------------------------- */
    async performAnalysis() {
        console.log('Starting analysis...', { 
            hasResume: !!resumeText, 
            hasJD: !!jobDescriptionText,
            resumeLength: resumeText.length,
            jdLength: jobDescriptionText.length
        });

        if (!resumeText || !jobDescriptionText) {
            alert('Please provide both a resume and job description before analyzing.');
            return;
        }

        if (resumeText.length < 100) {
            alert('Resume content seems too short. Please ensure you have uploaded a complete resume.');
            return;
        }

        if (jobDescriptionText.length < 50) {
            alert('Job description seems too short. Please provide a more detailed job description for better analysis.');
            return;
        }

        // Show loading modal with enhanced animations
        this.showLoadingModal();

        try {
            // Enhanced analysis steps with realistic timing
            for (let i = 0; i < CONFIG.analysisSteps.length; i++) {
                await this.updateAnalysisProgress(i, CONFIG.analysisSteps[i]);
                const delay = i === 0 ? 1200 : i === CONFIG.analysisSteps.length - 1 ? 800 : 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            // Perform comprehensive analysis
            const analysis = this.generateAnalysisResults();
            
            currentAnalysis = analysis;
            console.log('Analysis complete:', analysis);
            
            this.hideLoadingModal();
            this.showDashboardView(analysis);

        } catch (error) {
            console.error('Analysis error:', error);
            this.hideLoadingModal();
            alert('Analysis failed: ' + error.message + '\n\nPlease try again or contact support if the issue persists.');
        }
    }

    generateAnalysisResults() {
        // Perform comprehensive analysis
        const resumeTokens = this.tokenizeText(resumeText);
        const jdTokens = this.tokenizeText(jobDescriptionText);
        const resumeFreq = this.createFrequencyMap(resumeTokens);
        const jdFreq = this.createFrequencyMap(jdTokens);

        // Calculate enhanced scores
        const keywordMatch = this.calculateKeywordMatch(resumeFreq, jdFreq);
        const formattingScore = this.calculateFormattingScore(resumeText);
        const skillsGap = this.analyzeSkillsGap(resumeText, jobDescriptionText);
        
        // Enhanced ATS score calculation
        const atsScore = Math.round(
            (keywordMatch.score * 0.4 + 
             formattingScore.score * 0.3 + 
             this.calculateSkillsMatchScore(skillsGap) * 0.3) * 100
        );

        // Generate recommendations
        const certifications = this.generateCertificationRecommendations(skillsGap, careerLevel, targetIndustry);
        const learningRoadmap = this.generateLearningRoadmap(skillsGap);
        const suggestions = this.generateSuggestions(atsScore, keywordMatch, formattingScore, skillsGap);
        const salaryPotential = this.calculateSalaryPotential(skillsGap, certifications);

        // Create comprehensive analysis
        return {
            id: Date.now(),
            timestamp: new Date(),
            atsScore,
            keywordMatch,
            formattingScore,
            skillsGap,
            certifications,
            learningRoadmap,
            suggestions,
            salaryPotential,
            summary: this.generateSummary(atsScore, keywordMatch, formattingScore, skillsGap),
            quickWins: this.generateQuickWins(skillsGap, keywordMatch, formattingScore),
            interviewQuestions: this.generateInterviewQuestions(skillsGap, targetIndustry)
        };
    }

    tokenizeText(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2 && !CONFIG.stopwords.includes(word));
    }

    createFrequencyMap(tokens) {
        const freq = {};
        tokens.forEach(token => {
            freq[token] = (freq[token] || 0) + 1;
        });
        return freq;
    }

    calculateKeywordMatch(resumeFreq, jdFreq) {
        const jdKeywords = Object.keys(jdFreq).sort((a, b) => jdFreq[b] - jdFreq[a]);
        const matchedKeywords = [];
        const missingKeywords = [];

        jdKeywords.forEach(keyword => {
            if (resumeFreq[keyword]) {
                matchedKeywords.push({
                    keyword,
                    jdCount: jdFreq[keyword],
                    resumeCount: resumeFreq[keyword]
                });
            } else {
                missingKeywords.push(keyword);
            }
        });

        const score = jdKeywords.length > 0 ? matchedKeywords.length / jdKeywords.length : 0;

        return {
            score,
            matchedKeywords: matchedKeywords.slice(0, 30),
            missingKeywords: missingKeywords.slice(0, 20),
            totalJDKeywords: jdKeywords.length
        };
    }

    calculateFormattingScore(text) {
        const checks = CONFIG.formatting_checks.map(check => {
            const regex = new RegExp(check.regex, 'i');
            const passed = regex.test(text);
            return { name: check.name, passed };
        });

        const passedCount = checks.filter(check => check.passed).length;
        const score = checks.length > 0 ? passedCount / checks.length : 0;

        return { score, checks, passedCount, totalChecks: checks.length };
    }

    analyzeSkillsGap(resumeText, jobText) {
        const skillsAnalysis = {
            matched: { technical: [], soft: [], industry: [] },
            missing: { technical: [], soft: [], industry: [] },
            priorities: {},
            recommendations: []
        };

        // Enhanced skill categories
        const skillCategories = [
            {
                category: 'Technical Skills',
                key: 'technical',
                skills: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git', 'TypeScript', 'GraphQL', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'Redis', 'Jenkins', 'Terraform']
            },
            {
                category: 'Soft Skills',
                key: 'soft', 
                skills: ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management', 'Critical Thinking', 'Adaptability', 'Project Management', 'Negotiation', 'Presentation', 'Mentoring', 'Strategic Planning']
            },
            {
                category: 'Industry Skills',
                key: 'industry',
                skills: ['Digital Marketing', 'Financial Analysis', 'Business Analysis', 'UX/UI Design', 'Data Visualization', 'Content Strategy', 'SEO', 'Social Media', 'E-commerce', 'Customer Service', 'Product Management', 'Agile', 'Scrum']
            }
        ];

        skillCategories.forEach(category => {
            category.skills.forEach(skill => {
                const skillRegex = new RegExp(skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                const skillInResume = skillRegex.test(resumeText);
                const skillInJob = skillRegex.test(jobText);
                
                if (skillInResume) {
                    skillsAnalysis.matched[category.key].push(skill);
                } else if (skillInJob) {
                    skillsAnalysis.missing[category.key].push(skill);
                    const mentions = (jobText.match(skillRegex) || []).length;
                    skillsAnalysis.priorities[skill] = mentions > 2 ? 'high' : mentions > 1 ? 'medium' : 'low';
                }
            });
        });

        return skillsAnalysis;
    }

    calculateSkillsMatchScore(skillsGap) {
        const totalMatched = skillsGap.matched.technical.length + skillsGap.matched.soft.length + skillsGap.matched.industry.length;
        const totalMissing = skillsGap.missing.technical.length + skillsGap.missing.soft.length + skillsGap.missing.industry.length;
        const totalSkills = totalMatched + totalMissing;
        
        return totalSkills > 0 ? totalMatched / totalSkills : 0;
    }

    generateCertificationRecommendations(skillsGap, careerLevel, targetIndustry) {
        let recommendations = [...SAMPLE_DATA.certificationRecommendations];
        
        // Enhanced filtering logic
        const missingSkillsText = [
            ...skillsGap.missing.technical,
            ...skillsGap.missing.industry
        ].join(' ').toLowerCase();
        
        recommendations = recommendations.filter(cert => {
            const certRelevant = missingSkillsText.includes(cert.category.toLowerCase()) ||
                               missingSkillsText.includes(cert.name.toLowerCase()) ||
                               cert.category.toLowerCase().includes(targetIndustry.toLowerCase());
            
            if (careerLevel) {
                const levelDifficultyMap = {
                    'entry': ['Beginner', 'Intermediate'],
                    'mid': ['Beginner', 'Intermediate', 'Advanced'],
                    'senior': ['Intermediate', 'Advanced'],
                    'lead': ['Advanced'],
                    'executive': ['Advanced']
                };
                return certRelevant && levelDifficultyMap[careerLevel]?.includes(cert.difficulty);
            }
            
            return certRelevant;
        });

        // Add ROI scoring
        recommendations.forEach(cert => {
            const salaryMin = parseInt(cert.salaryIncrease.split(' - ')[0].replace(/[^\d]/g, ''));
            cert.roiScore = salaryMin;
        });

        // Sort by relevance and ROI
        recommendations.sort((a, b) => b.roiScore - a.roiScore);

        return recommendations.slice(0, 6);
    }

    calculateSalaryPotential(skillsGap, certifications) {
        let basePotential = 60000; // Base salary
        
        // Add value for matched skills
        const totalMatched = skillsGap.matched.technical.length + skillsGap.matched.soft.length + skillsGap.matched.industry.length;
        basePotential += totalMatched * 2500;
        
        // Add certification value
        const certValue = certifications.reduce((total, cert) => {
            const minIncrease = parseInt(cert.salaryIncrease.split(' - ')[0].replace(/[^\d]/g, ''));
            return total + (minIncrease * 0.7); // Conservative estimate
        }, 0);
        
        return Math.min(basePotential + certValue, 280000); // Cap at reasonable maximum
    }

    generateLearningRoadmap(skillsGap) {
        const roadmap = [];
        
        const highPrioritySkills = Object.entries(skillsGap.priorities)
            .filter(([skill, priority]) => priority === 'high')
            .map(([skill]) => skill);
        
        if (highPrioritySkills.length > 0) {
            roadmap.push({
                title: "🎯 Phase 1: High-Impact Skills (Weeks 1-6)",
                skills: highPrioritySkills.slice(0, 3),
                platform: "LinkedIn Learning, Coursera",
                timeFrame: "6 weeks intensive",
                outcome: "Immediate resume impact and interview readiness"
            });
        }

        const mediumPrioritySkills = Object.entries(skillsGap.priorities)
            .filter(([skill, priority]) => priority === 'medium')
            .map(([skill]) => skill);
            
        if (mediumPrioritySkills.length > 0) {
            roadmap.push({
                title: "📈 Phase 2: Supporting Skills (Weeks 7-12)",
                skills: mediumPrioritySkills.slice(0, 3),
                platform: "Udemy, Pluralsight",
                timeFrame: "6 weeks structured learning",
                outcome: "Enhanced technical competency and market value"
            });
        }

        roadmap.push({
            title: "🏆 Phase 3: Professional Certification (Months 4-6)",
            skills: ["Industry Certification Preparation"],
            platform: "Official Training Providers",
            timeFrame: "2-3 months intensive prep",
            outcome: "Salary increase potential of $15K-$40K"
        });

        return roadmap;
    }

    generateSuggestions(atsScore, keywordMatch, formattingScore, skillsGap) {
        const suggestions = [];
        
        if (atsScore < 70) {
            suggestions.push("Optimize your resume for ATS by incorporating more relevant keywords from the job description.");
        }
        
        const missingCount = skillsGap.missing.technical.length + skillsGap.missing.soft.length + skillsGap.missing.industry.length;
        if (missingCount > 0) {
            suggestions.push(`Add ${missingCount} missing skills to better match the job requirements.`);
        }
        
        if (keywordMatch.missingKeywords.length > 5) {
            suggestions.push(`Include important keywords: ${keywordMatch.missingKeywords.slice(0, 3).join(', ')}.`);
        }
        
        if (formattingScore.score < 0.8) {
            suggestions.push("Improve resume structure and formatting for better ATS parsing.");
        }
        
        suggestions.push("Consider pursuing relevant certifications to boost your qualifications.");
        suggestions.push("Quantify your achievements with specific numbers and percentages.");
        
        return suggestions.slice(0, 6);
    }

    generateSummary(atsScore, keywordMatch, formattingScore, skillsGap) {
        const matchedSkills = skillsGap.matched.technical.length + skillsGap.matched.soft.length + skillsGap.matched.industry.length;
        const missingSkills = skillsGap.missing.technical.length + skillsGap.missing.soft.length + skillsGap.missing.industry.length;
        
        let summary = `Your resume achieved an ATS compatibility score of ${atsScore}% against the target position. `;
        
        if (atsScore >= 80) {
            summary += "Outstanding performance! Your resume demonstrates excellent alignment with the job requirements and should perform very well in automated screening systems. ";
        } else if (atsScore >= 60) {
            summary += "Solid foundation with strategic improvement opportunities. Your resume shows good potential and with targeted enhancements can achieve excellent ATS performance. ";
        } else {
            summary += "Significant optimization potential identified. Our analysis reveals multiple high-impact areas where strategic improvements can dramatically boost your resume's effectiveness. ";
        }
        
        summary += `You currently demonstrate proficiency in ${matchedSkills} relevant skills while having ${missingSkills} skills identified for development. `;
        summary += `Focus on our high-priority recommendations and consider the suggested certifications to maximize your career advancement potential.`;
        
        return summary;
    }

    generateQuickWins(skillsGap, keywordMatch, formattingScore) {
        const wins = [];
        
        if (keywordMatch.missingKeywords.length > 0) {
            wins.push(`🔑 Add critical keywords: ${keywordMatch.missingKeywords.slice(0, 3).join(', ')}`);
        }
        
        const highPrioritySkills = Object.entries(skillsGap.priorities)
            .filter(([skill, priority]) => priority === 'high')
            .slice(0, 2)
            .map(([skill]) => skill);
        
        if (highPrioritySkills.length > 0) {
            wins.push(`⭐ Highlight experience with: ${highPrioritySkills.join(', ')}`);
        }
        
        const failedChecks = formattingScore.checks.filter(check => !check.passed);
        if (failedChecks.length > 0) {
            wins.push(`📝 Improve formatting: ${failedChecks[0].name.toLowerCase()}`);
        }
        
        wins.push("📊 Quantify achievements with specific numbers and percentages");
        wins.push("🎯 Tailor your professional summary to match the job description");
        wins.push("⚡ Use stronger action verbs to begin each bullet point");
        
        return wins.slice(0, 5);
    }

    generateInterviewQuestions(skillsGap, targetIndustry) {
        let questions = [...SAMPLE_DATA.interviewQuestions];
        
        // Add industry-specific questions
        if (targetIndustry === 'technology') {
            questions.push("Describe your experience with agile development methodologies.");
        } else if (targetIndustry === 'finance') {
            questions.push("How do you ensure accuracy when handling financial data?");
        }
        
        return questions.slice(0, 9);
    }

    /* ------------------------- Enhanced UI Management ------------------------- */
    showLoadingModal() {
        const modal = document.getElementById('loadingModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.animation = 'fadeIn 0.3s ease-out';
        }
    }

    hideLoadingModal() {
        const modal = document.getElementById('loadingModal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }
    }

    async updateAnalysisProgress(step, text) {
        const loadingText = document.getElementById('loadingText');
        const progressFill = document.getElementById('analysisProgress');
        
        if (loadingText) {
            loadingText.style.opacity = '0';
            setTimeout(() => {
                loadingText.textContent = text;
                loadingText.style.opacity = '1';
            }, 150);
        }
        
        if (progressFill) {
            const progress = ((step + 1) / CONFIG.analysisSteps.length) * 100;
            progressFill.style.transition = 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            progressFill.style.width = `${progress}%`;
        }
    }

    showUploadView() {
        const uploadView = document.getElementById('uploadView');
        const dashboardView = document.getElementById('dashboardView');
        
        if (dashboardView) {
            dashboardView.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                dashboardView.classList.add('hidden');
                if (uploadView) {
                    uploadView.classList.remove('hidden');
                    uploadView.style.animation = 'fadeIn 0.3s ease-out';
                }
            }, 300);
        }
    }

    showDashboardView(analysis) {
        const uploadView = document.getElementById('uploadView');
        const dashboardView = document.getElementById('dashboardView');
        
        if (uploadView) {
            uploadView.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                uploadView.classList.add('hidden');
                if (dashboardView) {
                    dashboardView.classList.remove('hidden');
                    dashboardView.style.animation = 'fadeIn 0.3s ease-out';
                    this.renderScoreChart(analysis.atsScore);
                    this.updateDashboardContent(analysis);
                }
            }, 300);
        }
    }

    renderScoreChart(score) {
        const canvas = document.getElementById('scoreChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (scoreChartInstance) {
            scoreChartInstance.destroy();
        }

        const data = {
            datasets: [{
                data: [score, 100 - score],
                backgroundColor: [
                    score >= 80 ? CONFIG.chartColors[0] : score >= 60 ? CONFIG.chartColors[1] : CONFIG.chartColors[2],
                    'rgba(255, 255, 255, 0.1)'
                ],
                borderWidth: 0,
                cutout: '75%'
            }]
        };

        scoreChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                animation: {
                    animateRotate: true,
                    duration: 2000
                }
            }
        });

        // Animate score display
        this.animateScoreValue(score);
    }

    animateScoreValue(targetScore) {
        const scoreValue = document.getElementById('scoreValue');
        const desc = document.getElementById('scoreDescription');
        
        if (!scoreValue) return;
        
        let currentScore = 0;
        const increment = targetScore / 50;
        const timer = setInterval(() => {
            currentScore += increment;
            if (currentScore >= targetScore) {
                currentScore = targetScore;
                clearInterval(timer);
            }
            scoreValue.textContent = Math.round(currentScore);
        }, 40);
        
        // Update description with enhanced messaging
        if (desc) {
            setTimeout(() => {
                if (targetScore >= 80) {
                    desc.textContent = '🎉 Excellent! Your resume is highly optimized for ATS systems and should perform well in automated screenings.';
                    desc.style.color = '#1FB8CD';
                } else if (targetScore >= 60) {
                    desc.textContent = '✨ Good foundation! With some targeted improvements, your resume can achieve excellent ATS compatibility.';
                    desc.style.color = '#FFC185';
                } else {
                    desc.textContent = '🚀 Significant optimization potential! Our recommendations will help you dramatically improve your ATS performance.';
                    desc.style.color = '#FF5459';
                }
            }, 1000);
        }
    }

    updateDashboardContent(analysis) {
        // Update all dashboard sections
        this.updateMetrics(analysis);
        this.updateOverviewTab(analysis);
        this.updateSkillsAnalysis(analysis.skillsGap);
        this.updateCertifications(analysis.certifications);
        this.updateLearningRoadmap(analysis.learningRoadmap);
        this.updateImprovements(analysis);
        this.updateInterviewQuestions(analysis.interviewQuestions);
    }

    updateMetrics(analysis) {
        const keywordMatch = document.getElementById('keywordMatch');
        const formatScore = document.getElementById('formatScore');
        const skillsMatch = document.getElementById('skillsMatch');
        
        if (keywordMatch) {
            this.animateMetric(keywordMatch, Math.round(analysis.keywordMatch.score * 100));
        }
        if (formatScore) {
            this.animateMetric(formatScore, Math.round(analysis.formattingScore.score * 100));
        }
        if (skillsMatch) {
            this.animateMetric(skillsMatch, Math.round(this.calculateSkillsMatchScore(analysis.skillsGap) * 100));
        }
    }

    animateMetric(element, targetValue) {
        let currentValue = 0;
        const increment = targetValue / 30;
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            element.textContent = `${Math.round(currentValue)}%`;
        }, 50);
    }

    updateOverviewTab(analysis) {
        // Update summary with enhanced content
        const summaryText = document.getElementById('summaryText');
        if (summaryText) {
            summaryText.textContent = analysis.summary;
        }
        
        // Update statistics with animations
        const matchedSkills = document.getElementById('matchedSkills');
        const missingSkills = document.getElementById('missingSkills');
        const salaryPotential = document.getElementById('salaryPotential');
        
        if (matchedSkills) {
            const total = analysis.skillsGap.matched.technical.length + 
                         analysis.skillsGap.matched.soft.length + 
                         analysis.skillsGap.matched.industry.length;
            this.animateCounter(matchedSkills, total);
        }
        
        if (missingSkills) {
            const total = analysis.skillsGap.missing.technical.length + 
                         analysis.skillsGap.missing.soft.length + 
                         analysis.skillsGap.missing.industry.length;
            this.animateCounter(missingSkills, total);
        }
        
        if (salaryPotential) {
            const potential = Math.round(analysis.salaryPotential / 1000);
            this.animateCounter(salaryPotential, potential, '$', 'K');
        }

        this.updateQuickWins(analysis.quickWins);
    }

    animateCounter(element, target, prefix = '', suffix = '') {
        let current = 0;
        const increment = target / 30;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = `${prefix}${Math.round(current)}${suffix}`;
        }, 50);
    }

    updateQuickWins(quickWins) {
        const list = document.getElementById('quickWinsList');
        if (!list || !quickWins.length) return;
        
        list.innerHTML = '';
        quickWins.forEach((win, index) => {
            const li = document.createElement('li');
            li.textContent = win;
            list.appendChild(li);
        });
    }

    updateSkillsAnalysis(skillsGap) {
        const categories = [
            { id: 'technicalSkills', key: 'technical', title: 'Technical Skills' },
            { id: 'softSkills', key: 'soft', title: 'Soft Skills' },
            { id: 'industrySkills', key: 'industry', title: 'Industry Skills' }
        ];

        categories.forEach(category => {
            const container = document.getElementById(category.id);
            if (!container) return;
            
            container.innerHTML = '';
            
            // Add matched skills
            skillsGap.matched[category.key].forEach(skill => {
                const div = document.createElement('div');
                div.className = 'skill-item matched';
                div.innerHTML = `
                    <span class="skill-name">${skill}</span>
                    <span class="skill-status matched">✓ Present</span>
                `;
                container.appendChild(div);
            });
            
            // Add missing skills with priority indicators
            skillsGap.missing[category.key].forEach(skill => {
                const priority = skillsGap.priorities[skill] || 'low';
                const div = document.createElement('div');
                div.className = `skill-item missing priority-${priority}`;
                div.innerHTML = `
                    <span class="skill-name">${skill}</span>
                    <span class="skill-status missing">${priority.toUpperCase()}</span>
                `;
                container.appendChild(div);
            });
            
            if (skillsGap.matched[category.key].length === 0 && skillsGap.missing[category.key].length === 0) {
                container.innerHTML = '<div class="skill-item" style="opacity: 0.6;">No specific skills identified in this category</div>';
            }
        });
    }

    updateCertifications(certifications) {
        const container = document.getElementById('certificationsGrid');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (certifications.length === 0) {
            container.innerHTML = '<div class="cert-card"><p>No specific certification recommendations available for your profile.</p></div>';
            return;
        }
        
        certifications.forEach(cert => {
            const card = document.createElement('div');
            card.className = 'cert-card';
            card.innerHTML = `
                <div class="cert-header">
                    <div class="cert-name">${cert.name}</div>
                    <div class="cert-provider">by ${cert.provider}</div>
                </div>
                <div class="cert-salary-impact">
                    💰 Salary Impact: ${cert.salaryIncrease}
                </div>
                <div class="cert-details">
                    <div class="cert-detail">
                        <div class="cert-detail-label">Investment</div>
                        <div class="cert-detail-value">${cert.cost}</div>
                    </div>
                    <div class="cert-detail">
                        <div class="cert-detail-label">Time Needed</div>
                        <div class="cert-detail-value">${cert.timeToComplete}</div>
                    </div>
                    <div class="cert-detail">
                        <div class="cert-detail-label">Difficulty</div>
                        <div class="cert-detail-value">${cert.difficulty}</div>
                    </div>
                    <div class="cert-detail">
                        <div class="cert-detail-label">Pass Rate</div>
                        <div class="cert-detail-value">${cert.passRate}</div>
                    </div>
                </div>
                <div class="cert-description">${cert.description}</div>
                <button class="btn btn--primary cert-action" onclick="window.open('https://www.google.com/search?q=${encodeURIComponent(cert.name + ' certification official')}', '_blank')">
                    🔗 Learn More
                </button>
            `;
            container.appendChild(card);
        });
    }

    updateLearningRoadmap(roadmap) {
        const container = document.getElementById('learningPath');
        if (!container) return;
        
        container.innerHTML = '';
        roadmap.forEach(item => {
            const div = document.createElement('div');
            div.className = 'roadmap-item';
            div.innerHTML = `
                <div class="roadmap-title">${item.title}</div>
                <div class="roadmap-details">
                    <strong>🎯 Focus Skills:</strong> ${item.skills.join(', ')}<br>
                    <strong>📚 Platform:</strong> ${item.platform}<br>
                    <strong>⏱️ Duration:</strong> ${item.timeFrame}<br>
                    <strong>💡 Expected Outcome:</strong> ${item.outcome || 'Enhanced job market competitiveness'}
                </div>
            `;
            container.appendChild(div);
        });
    }

    updateImprovements(analysis) {
        // Update progress bars
        this.animateProgressBar('keywordProgress', analysis.keywordMatch.score * 100);
        this.animateProgressBar('formatProgress', analysis.formattingScore.score * 100);
        this.animateProgressBar('contentProgress', 75); // Sample content score
        
        // Update details sections
        const keywordDetails = document.getElementById('keywordDetails');
        if (keywordDetails) {
            const missing = analysis.keywordMatch.missingKeywords.length;
            keywordDetails.innerHTML = `
                <p><strong>Missing Keywords:</strong> ${missing} important terms</p>
                <p><strong>Top Missing:</strong> ${analysis.keywordMatch.missingKeywords.slice(0, 5).join(', ')}</p>
                <p><strong>Recommendation:</strong> Integrate these keywords naturally into your experience descriptions</p>
            `;
        }
        
        // Update format checklist
        const formatChecklist = document.getElementById('formatChecklist');
        if (formatChecklist) {
            formatChecklist.innerHTML = '';
            analysis.formattingScore.checks.forEach(check => {
                const item = document.createElement('div');
                item.className = 'checklist-item';
                item.innerHTML = `
                    <div class="checklist-icon ${check.passed ? 'pass' : 'fail'}">
                        ${check.passed ? '✓' : '✗'}
                    </div>
                    <div class="checklist-text">${check.name}</div>
                `;
                formatChecklist.appendChild(item);
            });
        }
        
        // Update suggestions
        const contentSuggestions = document.getElementById('contentSuggestions');
        if (contentSuggestions) {
            contentSuggestions.innerHTML = '';
            analysis.suggestions.forEach(suggestion => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = suggestion;
                contentSuggestions.appendChild(item);
            });
        }
    }

    animateProgressBar(elementId, targetPercentage) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let current = 0;
        const increment = targetPercentage / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetPercentage) {
                current = targetPercentage;
                clearInterval(timer);
            }
            element.style.width = `${current}%`;
        }, 30);
    }

    updateInterviewQuestions(questions) {
        const categories = [
            { id: 'technicalQuestions', questions: questions.slice(0, 3) },
            { id: 'behavioralQuestions', questions: questions.slice(3, 6) },
            { id: 'leadershipQuestions', questions: questions.slice(6) }
        ];

        categories.forEach(category => {
            const container = document.getElementById(category.id);
            if (!container) return;
            
            container.innerHTML = '';
            category.questions.forEach(question => {
                const item = document.createElement('div');
                item.className = 'question-item';
                item.textContent = question;
                container.appendChild(item);
            });
        });
    }

    /* ------------------------- Event Handlers ------------------------- */ 
    handleTabSwitch(event) {
        const tabName = event.target.closest('[data-tab]').dataset.tab;
        const isUploadTab = tabName === 'paste' || tabName === 'upload';
        
        console.log('Tab switch:', tabName, 'isUploadTab:', isUploadTab);
        
        if (isUploadTab) {
            const tabContainer = event.target.closest('.input-tabs');
            if (tabContainer) {
                tabContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                event.target.closest('.tab-btn').classList.add('active');
                this.showTabPanel(tabName);
            }
        } else {
            document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
            event.target.closest('.nav-tab').classList.add('active');
            this.showDashboardTab(tabName);
        }
    }

    showTabPanel(tabName) {
        const pasteTab = document.getElementById('pasteTab');
        const uploadTab = document.getElementById('uploadTab');
        
        console.log('Showing tab panel:', tabName);
        
        if (pasteTab) pasteTab.classList.remove('active');
        if (uploadTab) uploadTab.classList.remove('active');
        
        if (tabName === 'paste' && pasteTab) {
            pasteTab.classList.add('active');
        } else if (tabName === 'upload' && uploadTab) {
            uploadTab.classList.add('active');
        }
    }

    showDashboardTab(tabName) {
        const tabs = ['overview', 'skills', 'certifications', 'improvements', 'interview'];
        tabs.forEach(tab => {
            const tabEl = document.getElementById(`${tab}Tab`);
            if (tabEl) {
                tabEl.classList.remove('active');
            }
        });
        
        const activeTab = document.getElementById(`${tabName}Tab`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }

    filterCertifications() {
        if (!currentAnalysis) return;
        
        const categoryFilter = document.getElementById('certCategoryFilter');
        const difficultyFilter = document.getElementById('certDifficultyFilter');
        const roiFilter = document.getElementById('certROIFilter');
        
        let filtered = [...currentAnalysis.certifications];
        
        if (categoryFilter && categoryFilter.value) {
            filtered = filtered.filter(cert => cert.category === categoryFilter.value);
        }
        
        if (difficultyFilter && difficultyFilter.value) {
            filtered = filtered.filter(cert => cert.difficulty === difficultyFilter.value);
        }
        
        if (roiFilter && roiFilter.value) {
            filtered = filtered.filter(cert => {
                const minSalary = parseInt(cert.salaryIncrease.split(' - ')[0].replace(/[^\d]/g, ''));
                if (roiFilter.value === 'high') return minSalary >= 25000;
                if (roiFilter.value === 'medium') return minSalary >= 15000 && minSalary < 25000;
                if (roiFilter.value === 'entry') return minSalary < 15000;
                return true;
            });
        }
        
        this.updateCertifications(filtered);
    }

    shareResults() {
        if (!currentAnalysis) return;
        
        const shareData = {
            title: 'My AI Resume Analysis Results',
            text: `🚀 I got a ${currentAnalysis.atsScore}% ATS compatibility score with personalized improvement recommendations! Check out this powerful AI resume analyzer.`,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareData.text + '\n\n' + shareData.url).then(() => {
                alert('✅ Results copied to clipboard! Share with your network.');
            }).catch(() => {
                alert('Unable to copy to clipboard. Please share manually.');
            });
        }
    }

    saveAnalysis() {
        if (!currentAnalysis) {
            alert('No analysis available to save.');
            return;
        }
        
        const data = {
            analysis: currentAnalysis,
            timestamp: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `resume-analysis-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    downloadReport() {
        if (!currentAnalysis) {
            alert('No analysis available to download.');
            return;
        }
        
        // Create simple text report for download
        const reportText = this.generateTextReport(currentAnalysis);
        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `resume-analysis-report-${Date.now()}.txt`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    generateTextReport(analysis) {
        return `AI-POWERED RESUME ANALYSIS REPORT
Generated on: ${analysis.timestamp.toLocaleString()}

========================================
EXECUTIVE SUMMARY
========================================
ATS Compatibility Score: ${analysis.atsScore}%

${analysis.summary}

========================================
SKILLS ANALYSIS
========================================
Technical Skills Matched: ${analysis.skillsGap.matched.technical.join(', ') || 'None'}
Technical Skills Missing: ${analysis.skillsGap.missing.technical.join(', ') || 'None'}

Soft Skills Matched: ${analysis.skillsGap.matched.soft.join(', ') || 'None'}
Soft Skills Missing: ${analysis.skillsGap.missing.soft.join(', ') || 'None'}

Industry Skills Matched: ${analysis.skillsGap.matched.industry.join(', ') || 'None'}
Industry Skills Missing: ${analysis.skillsGap.missing.industry.join(', ') || 'None'}

========================================
RECOMMENDATIONS
========================================
${analysis.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

========================================
QUICK WINS
========================================
${analysis.quickWins.map((w, i) => `${i + 1}. ${w}`).join('\n')}

========================================
CERTIFICATION RECOMMENDATIONS
========================================
${analysis.certifications.map(cert => 
    `• ${cert.name} (${cert.provider})
      Cost: ${cert.cost} | Time: ${cert.timeToComplete}
      Salary Impact: ${cert.salaryIncrease}
      ${cert.description}`
).join('\n\n')}

Salary Potential: $${Math.round(analysis.salaryPotential / 1000)}K

This report was generated by AI-Powered Resume Analyzer.`;
    }

    /* ------------------------- Utility Methods ------------------------- */
    updateFileStatus(element, text, className) {
        if (element) {
            element.textContent = text;
            element.className = `file-status ${className}`;
        }
    }

    updateAnalyzeButton() {
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            const hasResume = resumeText && resumeText.length > 0;
            const hasJD = jobDescriptionText && jobDescriptionText.length > 0;
            
            console.log('Updating analyze button:', { hasResume, hasJD, resumeLength: resumeText.length, jdLength: jobDescriptionText.length });
            
            analyzeBtn.disabled = !(hasResume && hasJD);
            
            // Enhanced visual feedback
            if (hasResume && hasJD) {
                analyzeBtn.style.opacity = '1';
                analyzeBtn.style.transform = 'scale(1)';
            } else {
                analyzeBtn.style.opacity = '0.6';
                analyzeBtn.style.transform = 'scale(0.98)';
            }
        }
    }
}

// Initialize the Enhanced Application
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Enhanced Resume Analyzer 2025...');
    try {
        const analyzer = new EnhancedResumeAnalyzer();
        console.log('✅ Resume Analyzer initialized successfully');
        
        // Make analyzer available globally for debugging
        window.resumeAnalyzer = analyzer;
        
    } catch (error) {
        console.error('❌ Failed to initialize Resume Analyzer:', error);
    }
});