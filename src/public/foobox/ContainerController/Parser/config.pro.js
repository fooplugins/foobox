import defaults from "./config"
import { isStringNotEmpty } from "../../../../utils/is";

export default {
    ...defaults,
    __types__: [
        ...defaults.__types__,
        "video"
    ],
    video: {
        priority: 15,
        include: [
            "[href^='http'][href*='youtube.com/watch']",
            "[href^='http'][href*='youtube.com/v']",
            "[href^='http'][href*='youtube.com/embed']",
            "[href^='http'][href*='youtube-nocookie.com/watch']",
            "[href^='http'][href*='youtube-nocookie.com/v']",
            "[href^='http'][href*='youtube-nocookie.com/embed']",
            "[href^='http'][href*='youtu.be/']",
            "[href^='http'][href*='vimeo.com/']:not([href*='vimeo.com/user'])",
            "[href^='http'][href*='.mp4']",
            "[href^='http'][href*='.ogv']",
            "[href^='http'][href*='.wmv']",
            "[href^='http'][href*='.webm']"
        ],
        properties: [{
            name: "cover",
            obj: ["cover"],
            elem: ["data:cover"],
            test: isStringNotEmpty
        }]
    }
};