document.addEventListener('DOMContentLoaded', () => {
    const year = document.getElementById('year');
    const version = document.getElementById('version');
    const versionLink = version?.closest('a');
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    const repo = 'Jeanball/musivault';

    const setVersion = (value) => {
        if (version) {
            version.textContent = value;
        }
        if (versionLink && value) {
            versionLink.href = `https://github.com/${repo}/releases/tag/${value}`;
        }
    };

    const fetchVersion = async () => {
        try {
            const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
            if (response.ok) {
                const release = await response.json();
                const tag = release.tag_name || release.name;
                if (tag) {
                    setVersion(tag);
                    return;
                }
            }

            const tagsResponse = await fetch(`https://api.github.com/repos/${repo}/tags`);
            if (tagsResponse.ok) {
                const tags = await tagsResponse.json();
                if (Array.isArray(tags) && tags.length > 0 && tags[0].name) {
                    setVersion(tags[0].name);
                    return;
                }
            }

            setVersion('latest');
        } catch {
            setVersion('latest');
        }
    };

    fetchVersion();

    const modal = document.getElementById('screenshot-modal');
    const modalImage = modal?.querySelector('[data-modal-image]');
    const modalTriggers = document.querySelectorAll('[data-modal-src]');

    modalTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            if (!modal || !modalImage) {
                return;
            }

            modalImage.src = trigger.dataset.modalSrc;
            modalImage.alt = trigger.dataset.modalAlt || '';
            modal.showModal();
        });
    });

    modal?.addEventListener('close', () => {
        if (modalImage) {
            modalImage.src = '';
            modalImage.alt = '';
        }
    });
});
