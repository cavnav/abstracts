<script lang="ts">
    import { onMount } from 'svelte';
    import './../styles/theme.css';  // Подключение глобальных стилей

    let isDarkMode = false;

    onMount(() => {
        // Получаем сохранённую тему из localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            isDarkMode = true;
            document.body.classList.add('dark');
        }
    });

    function toggleTheme() {
        isDarkMode = !isDarkMode;
        if (isDarkMode) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }
</script>

<main>
    <button on:click={toggleTheme}>
        {isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    </button>
    <slot></slot> <!-- Это рендерит содержимое страниц -->
</main>

<style>
    main {
        padding: 1rem;
        font-family: Arial, sans-serif;
    }

    button {
        margin-bottom: 1rem;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 16px;
        border-radius: 5px;
        border: none;
    }

    button:hover {
        background-color: #ddd;
    }
</style>
