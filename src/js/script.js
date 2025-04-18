// Initialize Ace Editor
document.addEventListener('DOMContentLoaded', function() {
    // Initialize editor
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/html");
    editor.setShowPrintMargin(false);
    editor.setHighlightActiveLine(true);
    editor.setOptions({
        fontSize: "14px",
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
        useSoftTabs: true
    });

    // Default code samples
    const defaultHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Hello, World!</h1>
        <p>Start coding your amazing project here.</p>
        <button id="btn">Click Me</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`;

    const defaultCSS = `/* Your custom styles */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
}

.container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
}

h1 {
    color: #333;
}

button {
    background-color: #007ACC;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #005fa3;
}`;

    const defaultJS = `// Your JavaScript code
document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('btn');
    
    button.addEventListener('click', function() {
        alert('Button clicked! Add your code here.');
    });
    
    console.log('Script loaded successfully!');
});`;

    // Initialize with HTML
    editor.setValue(defaultHTML);
    editor.clearSelection();

    // State management
    let currentLanguage = 'html';
    let code = {
        html: defaultHTML,
        css: defaultCSS,
        js: defaultJS
    };

    // Update preview function
    function updatePreview() {
        const previewFrame = document.getElementById('preview');
        const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        
        previewDoc.open();
        previewDoc.write(`
            ${code.html}
            <style>${code.css}</style>
            <script>${code.js}<\/script>
        `);
        previewDoc.close();
        
        // Show notification
        showNotification('Preview updated');
    }

    // Tab switching functionality
    const htmlTab = document.getElementById('html-tab');
    const cssTab = document.getElementById('css-tab');
    const jsTab = document.getElementById('js-tab');
    const currentFile = document.getElementById('current-file');
    const editorMode = document.getElementById('editor-mode');

    function setActiveTab(tab) {
        // Remove active class from all tabs
        [htmlTab, cssTab, jsTab].forEach(t => {
            t.classList.remove('bg-[#1E1E1E]');
            t.classList.add('bg-[#2D2D2D]');
        });
        
        // Add active class to the clicked tab
        tab.classList.remove('bg-[#2D2D2D]');
        tab.classList.add('bg-[#1E1E1E]');
        
        // Add animation
        tab.style.transition = 'background-color 0.2s ease';
    }

    function switchLanguage(language) {
        // Save current code
        code[currentLanguage] = editor.getValue();
        
        // Update editor mode
        if (language === 'html') {
            editor.session.setMode("ace/mode/html");
            setActiveTab(htmlTab);
            currentFile.textContent = 'index.html';
            editorMode.textContent = 'HTML';
        } else if (language === 'css') {
            editor.session.setMode("ace/mode/css");
            setActiveTab(cssTab);
            currentFile.textContent = 'styles.css';
            editorMode.textContent = 'CSS';
        } else if (language === 'js') {
            editor.session.setMode("ace/mode/javascript");
            setActiveTab(jsTab);
            currentFile.textContent = 'script.js';
            editorMode.textContent = 'JavaScript';
        }
        
        // Set editor value to the selected language's code
        editor.setValue(code[language]);
        editor.clearSelection();
        editor.navigateFileStart();
        
        // Update the current language
        currentLanguage = language;
    }

    htmlTab.addEventListener('click', () => switchLanguage('html'));
    cssTab.addEventListener('click', () => switchLanguage('css'));
    jsTab.addEventListener('click', () => switchLanguage('js'));

    // Set HTML tab as active by default
    setActiveTab(htmlTab);

    // Run button functionality
    const runBtn = document.getElementById('run-btn');
    runBtn.addEventListener('click', function() {
        // Save current code before updating preview
        code[currentLanguage] = editor.getValue();
        updatePreview();
        
        // Button click animation
        this.classList.add('scale-95');
        setTimeout(() => {
            this.classList.remove('scale-95');
        }, 100);
    });

    // Auto-update preview after a delay of typing
    let updateTimeout;
    editor.on('change', function() {
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(function() {
            code[currentLanguage] = editor.getValue();
            updatePreview();
        }, 1000); // Update preview 1 second after typing stops
    });

    // Refresh preview button
    const refreshPreview = document.getElementById('refresh-preview');
    refreshPreview.addEventListener('click', function() {
        code[currentLanguage] = editor.getValue();
        updatePreview();
        
        // Button animation
        this.classList.add('rotate-180');
        setTimeout(() => {
            this.classList.remove('rotate-180');
        }, 300);
    });

    // Toggle panel functionality
    const togglePanel = document.getElementById('toggle-panel');
    const previewPanel = document.getElementById('preview-panel');
    let isPanelCollapsed = false;

    togglePanel.addEventListener('click', function() {
        const isDesktop = window.innerWidth >= 768;
        isPanelCollapsed = !isPanelCollapsed;
        
        if (isDesktop) {
            previewPanel.classList.add('panel-animation');
            if (isPanelCollapsed) {
                previewPanel.style.width = '0';
                this.innerHTML = '<i class="fa-solid fa-arrows-right-to-line"></i>';
            } else {
                previewPanel.style.width = '50%';
                this.innerHTML = '<i class="fa-solid fa-arrows-left-right"></i>';
            }
        } else {
            previewPanel.classList.add('panel-animation');
            if (isPanelCollapsed) {
                previewPanel.style.height = '0';
                this.innerHTML = '<i class="fa-solid fa-arrows-down-to-line"></i>';
            } else {
                previewPanel.style.height = '50%';
                this.innerHTML = '<i class="fa-solid fa-arrows-up-down"></i>';
            }
        }
    });

    // Update layout on window resize
    window.addEventListener('resize', function() {
        const isDesktop = window.innerWidth >= 768;
        previewPanel.classList.remove('panel-animation');
        
        if (isDesktop) {
            previewPanel.style.height = 'auto';
            previewPanel.style.width = isPanelCollapsed ? '0' : '50%';
            togglePanel.innerHTML = isPanelCollapsed ? 
                '<i class="fa-solid fa-arrows-right-to-line"></i>' : 
                '<i class="fa-solid fa-arrows-left-right"></i>';
        } else {
            previewPanel.style.width = '100%';
            previewPanel.style.height = isPanelCollapsed ? '0' : '50%';
            togglePanel.innerHTML = isPanelCollapsed ? 
                '<i class="fa-solid fa-arrows-down-to-line"></i>' : 
                '<i class="fa-solid fa-arrows-up-down"></i>';
        }
    });

    // Save button functionality with animation
    const saveBtn = document.getElementById('save-btn');
    saveBtn.addEventListener('click', function() {
        // Save current file
        code[currentLanguage] = editor.getValue();
        
        // Show notification
        showNotification('Changes saved successfully');
        
        // Button animation
        this.classList.add('scale-95');
        setTimeout(() => {
            this.classList.remove('scale-95');
        }, 100);
    });

    // Show notification function
    function showNotification(message) {
        // Remove any existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            document.body.removeChild(existingNotification);
        }
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove notification after animation completes
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 2500);
    }

    // Update cursor position display
    editor.selection.on('changeCursor', function() {
        const position = editor.getCursorPosition();
        document.getElementById('cursor-position').textContent = 
            `Ln ${position.row + 1}, Col ${position.column + 1}`;
    });

    // Initial preview
    updatePreview();

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveBtn.click();
        }
        
        // Ctrl/Cmd + Enter to run
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            runBtn.click();
        }
        
        // Alt + 1/2/3 to switch tabs
        if (e.altKey) {
            if (e.key === '1') {
                e.preventDefault();
                htmlTab.click();
            } else if (e.key === '2') {
                e.preventDefault();
                cssTab.click();
            } else if (e.key === '3') {
                e.preventDefault();
                jsTab.click();
            }
        }
    });
});
