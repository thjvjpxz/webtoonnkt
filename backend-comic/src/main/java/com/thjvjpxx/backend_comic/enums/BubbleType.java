package com.thjvjpxx.backend_comic.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BubbleType {
    DIALOGUE("dialogue", "DIALOGUE"),
    THOUGHT("thought", "THOUGHT"),
    NARRATION("narration", "NARRATION"),
    SOUND_EFFECT("sound_effect", "SOUND_EFFECT"),
    BACKGROUND("background", "BACKGROUND"),
    ;

    private final String name;
    private final String nameUpper;
}
