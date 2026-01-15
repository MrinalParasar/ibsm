import { Extension } from '@tiptap/core'

export const BackspaceToParagraph = Extension.create({
    name: 'backspaceToParagraph',

    addKeyboardShortcuts() {
        return {
            Backspace: () => {
                const { empty, $anchor } = this.editor.state.selection
                const atStart = $anchor.parentOffset === 0

                if (!empty || !atStart) {
                    return false
                }

                // Handle Headings
                if (this.editor.isActive('heading')) {
                    return this.editor.commands.setParagraph()
                }

                // Handle Blockquotes
                if (this.editor.isActive('blockquote')) {
                    return this.editor.commands.unsetBlockquote()
                }

                // Handle Lists (Bullet & Ordered)
                if (this.editor.isActive('bulletList') || this.editor.isActive('orderedList')) {
                    return this.editor.commands.liftListItem('listItem')
                }

                return false
            },
        }
    },
})
