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
