document.addEventListener('DOMContentLoaded', () => {
    // Set current year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Fetch latest version from GitHub
    async function fetchLatestVersion() {
        const versionBadge = document.getElementById('app-version');
        const repo = 'Jeanball/musivault';

        try {
            // Priority 1: GitHub Releases
            let response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);

            if (response.ok) {
                const data = await response.json();
                versionBadge.textContent = `${data.tag_name} Now Available`;
                return;
            }

            // Priority 2: package.json from main branch
            response = await fetch(`https://raw.githubusercontent.com/${repo}/main/package.json`);

            if (response.ok) {
                const data = await response.json();
                versionBadge.textContent = `v${data.version} Now Available`;
                return;
            }

            // Fallback
            versionBadge.textContent = 'v1.0.0 Now Available';

        } catch (error) {
            console.error('Error fetching version:', error);
            versionBadge.textContent = 'v1.0.0 Now Available';
        }
    }

    fetchLatestVersion();

    // Fetch and render changelog
    async function fetchChangelog() {
        const changelogContainer = document.getElementById('changelog-content');
        const repo = 'Jeanball/Musivault';

        try {
            const response = await fetch(`https://raw.githubusercontent.com/${repo}/main/CHANGELOG.md`);

            if (!response.ok) {
                throw new Error('Failed to fetch changelog');
            }

            const markdown = await response.text();
            const html = parseMarkdown(markdown);
            changelogContainer.innerHTML = html;

        } catch (error) {
            console.error('Error fetching changelog:', error);
            changelogContainer.innerHTML = `
                <div class="changelog-error">
                    <p>Unable to load changelog.</p>
                    <a href="https://github.com/${repo}/blob/main/CHANGELOG.md" target="_blank">
                        View on GitHub →
                    </a>
                </div>
            `;
        }
    }

    // Simple markdown to HTML parser
    function parseMarkdown(markdown) {
        let html = markdown
            // Remove the main title (# Changelog) as we already have one
            .replace(/^# Changelog\n*/m, '')
            // Remove the intro paragraph about format
            .replace(/^All notable changes.*$/m, '')
            .replace(/^The format is based.*$/m, '')
            .replace(/^and this project adheres.*$/m, '')
            // Remove reference links at the bottom
            .replace(/^\[.*?\]:.*$/gm, '')
            // Escape HTML
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            // Version headers (## [x.x.x])
            .replace(/^## \[(.*?)\](?: - (.*))?$/gm, '<h2>$1 <small style="font-size: 0.6em; opacity: 0.6;">$2</small></h2>')
            // Section headers (### Added, ### Fixed, etc.)
            .replace(/^### (.*)$/gm, '<h3>$1</h3>')
            // Horizontal rules
            .replace(/^---$/gm, '<hr>')
            // Links [text](url)
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            // Inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Bold
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            // List items
            .replace(/^- (.*)$/gm, '<li>$1</li>')
            // Wrap consecutive list items in <ul>
            .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
            // Clean up empty lines
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        return html;
    }

    fetchChangelog();

    // Copy to clipboard functionality
    const copyBtn = document.querySelector('.btn-copy');
    const codeBlock = document.getElementById('install-code');

    if (copyBtn && codeBlock) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(codeBlock.innerText);

                // Visual feedback
                const originalIcon = copyBtn.innerHTML;
                copyBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;

                setTimeout(() => {
                    copyBtn.innerHTML = originalIcon;
                }, 2000);

            } catch (err) {
                console.error('Failed to copy!', err);
            }
        });
    }

    // Scroll reveal animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Initial check for elements that might be animated later
    // The CSS already handles the initial load animation
});
