// Video modal
(function () {
    const overlay = document.getElementById('videoModal');
    if (!overlay) return;

    const iframe = document.getElementById('modalIframe');
    const videoSrc = iframe.dataset.src;

    function openModal() {
        iframe.src = videoSrc;
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        overlay.classList.remove('is-open');
        iframe.src = '';                      // stops the video
        document.body.style.overflow = '';
    }

    document.getElementById('modalClose').addEventListener('click', closeModal);

    // Close on backdrop click (not when clicking the box itself)
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });

    // Wire trigger button
    document.querySelector('a[href="#features"]').addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
    });
}());
