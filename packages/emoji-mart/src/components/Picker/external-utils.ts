import { Emoji } from "@emoji-mart/data";

export function shouldDisableInput(context: any) {
  try {
    const emoji = context.getEmojiByPos(context.state.pos);
    if (typeof context.props?.shouldDisableInput !== "function") {
      return false;
    }
    // Get the current emoji selected with the selected skin factored into account.
    const skin = context.state.tempSkin || context.state.skin;
    if (!emoji || !skin) {
      return true;
    }
    const emojiSkin = emoji.skins[skin - 1] || emoji.skins[0];
    const selectedNativeSkin = emojiSkin.native;
    if (!selectedNativeSkin) {
      return true;
    }
    // Now check if the emoji is invalid based on `shouldDisableInput`.
    return context.props.shouldDisableInput(selectedNativeSkin);
  } catch (e) {
    console.warn(e);
    // By default, don't disable, in case of an unexpected input. The picker has generally been working, so
    // it should be fine for us to default to false.
    return false;
  }
}

export function getBytesAndClassName(context: any) {
    const emoji: Emoji | null = context.getEmojiByPos(context.state.pos)
    const skin = context.state.tempSkin || context.state.skin
    const emojiSkin = (emoji && skin) ? (emoji.skins[skin - 1] || emoji.skins[0]) : undefined;
    const numBytes = sumBytes(emojiSkin?.native);
    const formattedBytes = `${numBytes.toString().padStart(2, " ")} bytes`;
    const shouldDisable = shouldDisableInput(emoji);
    const invalidSymbolClass = shouldDisable ? "emojicoin-invalid-symbol" : "";
    return {
        shouldDisable,
        formattedBytes,
        invalidSymbolClass,
    }
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
