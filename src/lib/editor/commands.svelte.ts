const DATA_EVENTS: any = {
    WHITELIST: [
        "insertText",                  // insert typed plain text
        "insertParagraph",             // insert a paragraph break
        "insertLineBreak",             // insert a line break
        "deleteContentBackward",       // delete the content directly before the caret position and this intention is not covered by another inputType or delete the selection with the selection collapsing to its start after the deletion
    ],
    BLACKLIST: [
        "deleteByCut",                 // remove the current selection as part of a cut
        "deleteByDrag",                // remove content from the DOM by means of drag
        "deleteContent",               // delete the selection without specifying the direction of the deletion and this intention is not covered by another inputType
        "deleteContentForward",        // delete the content directly after the caret position and this intention is not covered by another inputType or delete the selection with the selection collapsing to its end after the deletion
        "deleteEntireSoftLine",        // delete from the nearest visual line break before the caret position to the nearest visual line break after the caret position
        "deleteHardLineBackward",      // delete from the caret to the nearest beginning of a block element or br element before the caret position
        "deleteHardLineForward",       // delete from the caret to the nearest end of a block element or br element after the caret position
        "deleteSoftLineBackward",      // delete from the caret to the nearest visual line break before the caret position
        "deleteSoftLineForward",       // delete from the caret to the nearest visual line break after the caret position
        "deleteWordBackward",          // delete a word directly before the caret position
        "deleteWordForward",           // delete a word directly after the caret position
        "formatBackColor",             // change the background color
        "formatBold",                  // initiate bold text
        "formatFontColor",             // change the font color
        "formatFontName",              // change the font-family
        "formatIndent",                // indent the current selection
        "formatItalic",                // initiate italic text
        "formatJustifyCenter",         // center align the current selection
        "formatJustifyFull",           // make the current selection fully justified
        "formatJustifyLeft",           // left align the current selection
        "formatJustifyRight",          // right align the current selection
        "formatOutdent",               // outdent the current selection
        "formatRemove",                // remove all formatting from the current selection
        "formatSetBlockTextDirection", // set the text block direction
        "formatSetInlineTextDirection",// set the text inline direction
        "formatStrikeThrough",         // initiate stricken through text
        "formatSubscript",             // initiate subscript text
        "formatSuperscript",           // initiate superscript text
        "formatUnderline",             // initiate underline text
        "historyRedo",                 // to redo the last undone editing action
        "historyUndo",                 // undo the last editing action
        "insertCompositionText",       // replace the current composition string
        "insertHorizontalRule",        // insert a horizontal rule
        "insertLink",                  // insert a link
        "insertOrderedList",           // insert a numbered list
        "insertUnorderedList",         // insert a bulleted list
    ],
};

const DATA_TRANSFER_EVENTS = {
    WHITELIST: [
        "insertFromPaste",             // paste content from clipboard or paste image from client provided image library
    ],
    BLACKLIST: [
        "insertFromDrop",              // insert content by means of drop
        "insertTranspose",             // transpose the last two grapheme cluster. that were entered
        "insertFromPasteAsQuotation",  // paste content from the clipboard as a quotation
        "insertReplacementText",       // insert or replace existing content by means of a spell checker, auto-correct, writing suggestions or similar
        "insertFromYank",              // replace the current selection with content stored in a kill buffer
    ],
};



export const INPUT_TYPE_WHITELIST = new Set([...DATA_EVENTS.WHITELIST, ...DATA_TRANSFER_EVENTS.WHITELIST]);

