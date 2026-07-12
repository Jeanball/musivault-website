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

    const modal = document.querySelector('[data-modal]');
    const modalImage = document.querySelector('[data-modal-image]');
    const modalTriggers = document.querySelectorAll('[data-modal-src]');
    const modalClosers = document.querySelectorAll('[data-modal-close]');
    let lastFocusedElement = null;

    const openModal = (src, alt, trigger) => {
        if (!modal || !modalImage) {
            return;
        }

        lastFocusedElement = trigger;
        modalImage.src = src;
        modalImage.alt = alt;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        modal.querySelector('[data-modal-close]')?.focus();
    };

    const closeModal = () => {
        if (!modal || !modalImage) {
            return;
        }

        modal.hidden = true;
        modalImage.src = '';
        modalImage.alt = '';
        document.body.style.overflow = '';
        lastFocusedElement?.focus();
    };

    modalTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            openModal(trigger.dataset.modalSrc, trigger.dataset.modalAlt || '', trigger);
        });
    });

    modalClosers.forEach((closer) => {
        closer.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal && !modal.hidden) {
            closeModal();
        }
    });
});
