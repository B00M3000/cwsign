struct Matchers {
    color: &'static str,
    date: &'static str,
}

struct Controls {
    matchers: Matchers,
}

struct Parameters {
    controls: Controls,
}

struct Preview {
    parameters: Parameters,
}

fn main() {
    let preview = Preview {
        parameters: Parameters {
            controls: Controls {
                matchers: Matchers {
                    color: r"(background|color)$",
                    date: r"Date$",
                },
            },
        },
    };

    // The 'preview' variable is ready to use
}
