import defaults from "./config";
export default {
    ...defaults,
    __types__: [
        ...defaults.__types__,
        "video"
    ],
    video: {
        priority: 15,
        include: [
            "figure > a[href^='http'][href*='youtube.com/watch/']",
            "figure > a[href^='http'][href*='youtube.com/v/']",
            "figure > a[href^='http'][href*='youtube.com/embed/']",
            "figure > a[href^='http'][href*='youtube-nocookie.com/watch/']",
            "figure > a[href^='http'][href*='youtube-nocookie.com/v/']",
            "figure > a[href^='http'][href*='youtube-nocookie.com/embed/']",
            "figure > a[href^='http'][href*='youtu.be/']",
            "figure > a[href^='http'][href*='vimeo.com/']:not([href*='vimeo.com/user'])",
            "figure > a[href^='http'][href*='.mp4']",
            "figure > a[href^='http'][href*='.ogv']",
            "figure > a[href^='http'][href*='.wmv']",
            "figure > a[href^='http'][href*='.webm']"
        ]
    }
};