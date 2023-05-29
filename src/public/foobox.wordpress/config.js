import {isStringNotEmpty} from "../../utils/is";

export default {
    __types__: [
        "image",
        "iframe",
        "video"
    ],
    priority: 39,
    include: [".wp-block-gallery"],
    exclude: [".nolightbox"],
    defaultProperties: [{
        name: "url",
        elem: ["href"],
        required: true,
        test: isStringNotEmpty
    },{
        name: "title",
        elem: ["^figcaption/innerHTML"],
        test: isStringNotEmpty
    },{
        name: "description",
        elem: ["img/alt"],
        test: isStringNotEmpty
    }],
    image: {
        priority: 10,
        include: [
            "figure > a[href^='http'][href*='.svg']",
            "figure > a[href^='http'][href*='.png']",
            "figure > a[href^='http'][href*='.jpg']",
            "figure > a[href^='http'][href*='.jpeg']",
            "figure > a[href^='http'][href*='.webp']",
            "figure > a[href^='http'][href*='.gif']",
            "figure > a[href^='http'][href*='.bmp']",
            "figure > a[href^='http'][href*='fakeimg.pl']"
        ]
    },
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
    },
    iframe: {
        priority: 20,
        include: [
            "figure > a[href^='http']"
        ]
    }
};