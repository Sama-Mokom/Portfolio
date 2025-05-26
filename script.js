        const toggle = document.getElementById('theme-toggle');
        const themeLabel = document.getElementById('theme-label');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');

        function setTheme(dark) {
            document.body.classList.toggle('dark', dark);
            themeLabel.textContent = dark ? '' : '';
            localStorage.setItem('theme', dark ? 'dark' : 'light');
        }

        // Initialize theme
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            toggle.checked = true;
            setTheme(true);
        }

        toggle.addEventListener('click', () => {
            setTheme(toggle.checked);
        });