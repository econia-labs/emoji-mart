import { Emoji } from "@emoji-mart/data";


// Check if we should disable the input based on the function passed into the component props,
// and the component is referred to as `picker` here.
export function checkShouldDisableInput(picker: any, highlightedEmoji: Emoji | null) {
  try {
    if (!highlightedEmoji || typeof picker.props?.shouldDisableInput !== "function") {
      return false;
    }
    // Get the current emoji selected with the selected skin factored into account.
    const skin = picker.state.tempSkin || picker.state.skin;
    const emojiSkin = highlightedEmoji.skins[skin - 1] || highlightedEmoji.skins[0];
    const selectedNativeSkin = emojiSkin.native;
    // Now check if the emoji is invalid based on `shouldDisableInput`.
    return picker.props.shouldDisableInput(selectedNativeSkin);
  } catch (e) {
    console.warn(e);
    // By default, don't disable, in case of an unexpected input. The picker has generally been working, so
    // it should be fine for us to default to false.
    return false;
  }
}

export const INVALID_SYMBOL_CLASS = "emojicoin-invalid-symbol";

export function getFormattedBytes(picker: any) {
    const emoji: Emoji | null = picker.getEmojiByPos(picker.state.pos)
    const skin = picker.state.tempSkin || picker.state.skin
    const emojiSkin = (emoji && skin) ? (emoji.skins[skin - 1] || emoji.skins[0]) : undefined;
    const numBytes = sumBytes(emojiSkin?.native);
    const formattedBytes = `${numBytes.toString().padStart(2, " ")} bytes`;
    return formattedBytes;
}

const memoized = new Map<string, number>();
export const sumBytes = (emoji?: string) => {
  if (typeof emoji !== "string") {
    return 0;
  }
  if (memoized.has(emoji)) {
    return memoized.get(emoji)!;
  } else {
    const length = new TextEncoder().encode(emoji).length;
    memoized.set(emoji, length);
    return length;
  }
};
