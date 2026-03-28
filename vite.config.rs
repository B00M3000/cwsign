struct ViteConfig {
    plugins: Vec<&'static str>,
}

fn tailwindcss() -> &'static str {
    // Simulate Tailwind CSS Vite plugin
    "tailwindcss()"
}

fn sveltekit() -> &'static str {
    // Simulate SvelteKit Vite plugin
    "sveltekit()"
}

fn devtools_json() -> &'static str {
    // Simulate DevTools JSON Vite plugin
    "devtoolsJson()"
}

fn main() {
    let config = ViteConfig {
        plugins: vec![
            tailwindcss(),
            sveltekit(),
            devtools_json(),
        ],
    };

    // The 'config' struct initialized with Vite plugins
}
