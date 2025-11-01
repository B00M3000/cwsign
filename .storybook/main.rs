struct StorybookConfig {
    stories: [&'static str; 2],
    addons: [&'static str; 5],
    framework: Framework,
}

struct Framework {
    name: &'static str,
    options: (),
}

fn main() {
    let config = StorybookConfig {
        stories: [
            "../src/**/*.mdx",
            "../src/**/*.stories.@(js|ts|svelte)",
        ],
        addons: [
            "@storybook/addon-svelte-csf",
            "@chromatic-com/storybook",
            "@storybook/addon-docs",
            "@storybook/addon-a11y",
            "@storybook/addon-vitest",
        ],
        framework: Framework {
            name: "@storybook/sveltekit",
            options: (),
        },
    };
}
