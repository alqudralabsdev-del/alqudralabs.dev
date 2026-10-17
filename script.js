(function () {
    if (window.siteScriptLoaded) return;
    window.siteScriptLoaded = true;

    function init() {

        /* ---------- Dark mode ---------- */
        function applyTheme(mode) {
            var isDark = mode === 'dark';
            document.body.classList.toggle('dark', isDark);
            var t = document.getElementById('theme-toggle');
            if (t) t.textContent = isDark ? '☀️' : '🌙';
        }

        var savedTheme = null;
        try { savedTheme = localStorage.getItem('theme'); } catch (err) {}
        if (savedTheme !== 'dark' && savedTheme !== 'light') {
            savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        applyTheme(savedTheme);

        /* ---------- Clicks: theme toggle + hamburger ---------- */
        document.addEventListener('click', function (e) {
            var themeBtn = e.target.closest('#theme-toggle');
            if (themeBtn) {
                var newMode = document.body.classList.contains('dark') ? 'light' : 'dark';
                applyTheme(newMode);
                try { localStorage.setItem('theme', newMode); } catch (err) {}
                return;
            }

            var menuBtn = e.target.closest('#menu-toggle');
            var links = document.getElementById('nav-links');
            if (menuBtn && links) {
                var isOpen = links.classList.toggle('open');
                menuBtn.setAttribute('aria-expanded', isOpen);
                menuBtn.textContent = isOpen ? '✕' : '☰';
            }
        });

        /* ---------- Scroll fade-in ---------- */
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12 });

            document.querySelectorAll('section').forEach(function (s) {
                s.classList.add('reveal');
                observer.observe(s);
            });
        }

        /* ---------- Back to top ---------- */
        var backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            window.addEventListener('scroll', function () {
                backToTop.classList.toggle('show', window.scrollY > 300);
            });
            backToTop.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        /* ---------- Hide navbar on scroll down ---------- */
        var navbar = document.querySelector('.nav-bar');
        var lastScroll = window.scrollY;

        if (navbar) {
            window.addEventListener('scroll', function () {
                var current = window.scrollY;
                var menuOpen = document.getElementById('nav-links');

                // never hide while the phone menu is open or near the top of the page
                if (current < 80 || (menuOpen && menuOpen.classList.contains('open'))) {
                    navbar.classList.remove('nav-hidden');
                } else if (current > lastScroll + 5) {
                    navbar.classList.add('nav-hidden');      // scrolling down
                } else if (current < lastScroll - 5) {
                    navbar.classList.remove('nav-hidden');   // scrolling up
                }

                lastScroll = current;
            });
        }
        /* ---------- Smooth page transition ---------- */
        document.querySelectorAll('a[href]').forEach(function (link) {
            var href = link.getAttribute('href');
            if (
                href.startsWith('#') ||
                href.startsWith('mailto:') ||
                href.startsWith('http') ||
                link.target === '_blank'
            ) return;

            link.addEventListener('click', function (e) {
                if (e.ctrlKey || e.metaKey || e.shiftKey) return;
                e.preventDefault();
                document.body.classList.add('page-leaving');
                setTimeout(function () { window.location.href = href; }, 250);
            });
        });

        window.addEventListener('pageshow', function (e) {
            if (e.persisted) document.body.classList.remove('page-leaving');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();