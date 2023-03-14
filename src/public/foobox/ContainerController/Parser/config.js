import {isStringNotEmpty} from "../../../../utils/is";

export default {
    __types__: ["image","iframe"],
    include: [".foobox,[data-foobox],[data-foobox-items]"],
    exclude: [".nolightbox"],
    defaultProperties: [{
        name: "url",
        obj: ["url","href"],
        elem: ["data:href","data:url","href"],
        required: true,
        test: isStringNotEmpty
    },{
        name: "title",
        obj: ["title"],
        elem: ["data:title", "title", "img/title"],
        test: isStringNotEmpty
    },{
        name: "description",
        obj: ["description"],
        elem: ["data:description", "img/alt"],
        test: isStringNotEmpty
    },{
        name: "width",
        obj: ["width"],
        elem: ["data:width"]
    },{
        name: "height",
        obj: ["height"],
        elem: ["data:height"]
    },{
        name: "aspectRatio",
        obj: ["aspectRatio"],
        elem: ["data:aspectRatio"]
    }],
    image: {
        priority: 10,
        include: [
            "[href^='http'][href*='.svg']",
            "[href^='http'][href*='.png']",
            "[href^='http'][href*='.jpg']",
            "[href^='http'][href*='.jpeg']",
            "[href^='http'][href*='.webp']",
            "[href^='http'][href*='.gif']",
            "[href^='http'][href*='.bmp']",
            "[href^='http'][href*='fakeimg.pl']",
            "[href^='http'].foobox-image"
        ],
        exclude: []
    },
    iframe: {
        priority: 20,
        include: [
            "[href^='http'][target='foobox']",
            "[href^='http'].foobox-iframe"
        ],
        exclude: []
    }
};