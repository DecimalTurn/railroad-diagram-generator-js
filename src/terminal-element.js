const { TextBoxElement } = require('./text-box-element');

/**
 * Terminal element (quoted literals, hex values, etc.)
 * @extends TextBoxElement
 */
class TerminalElement extends TextBoxElement {
    /**
     * Create a terminal expression
     * @param {string} text - Text to display in the box (literal ABNF syntax)
     * @param {string} [label] - Optional label to display below the terminal
     */
    constructor(text, label = null) {
        super(text, 'terminal');
        this.label = label;
    }

    /**
     * Override render to include label below terminal box
     * @param {RenderContext} ctx - Rendering context
     * @returns {void}
     */
    render(ctx) {
        // Call parent render to draw the terminal box
        super.render(ctx);
        
        // Add label to the right of the terminal for annotated char alternatives.
        if (this.label) {
            const labelFontSize = 12;
            const labelPadding = 12;
            const boxHeightPixels = 2 * ctx.gridSize;

            const isUnicodePlaceholderLabel = this.label === 'U+XXXX';
            const labelX = isUnicodePlaceholderLabel
                ? this.width * ctx.gridSize - 10
                : this.width * ctx.gridSize + labelPadding;
            const labelY = boxHeightPixels / 2 - 13;
            const labelAnchor = 'start';

            // Keep long Unicode suffixes compact by rendering the U+ token on a new line.
            let labelLines = this.label.split(/\r?\n/);
            if (labelLines.length === 1) {
                const autoWrapMatch = this.label.match(/^(.*?)(\s+U\+[0-9A-Fa-fX]+)$/);
                if (autoWrapMatch) {
                    labelLines = [autoWrapMatch[1].trim(), autoWrapMatch[2].trim()];
                }
            }

            if (labelLines.length <= 1) {
                ctx.svg += `<text x="${labelX}" y="${labelY}" text-anchor="${labelAnchor}" dominant-baseline="middle" class="terminal-label">${ctx.escapeXml(this.label)}</text>`;
            } else {
                const lineHeight = labelFontSize;
                const multiLineStartY = labelY - ((labelLines.length - 1) * lineHeight) / 2;
                const tspanLines = labelLines
                    .map((line, index) => {
                        const dy = index === 0 ? 0 : lineHeight;
                        return `<tspan x="${labelX}" dy="${dy}">${ctx.escapeXml(line)}</tspan>`;
                    })
                    .join('');

                ctx.svg += `<text x="${labelX}" y="${multiLineStartY}" text-anchor="${labelAnchor}" dominant-baseline="middle" class="terminal-label">${tspanLines}</text>`;
            }
        }
    }

    /**
     * Convert to debug string representation
     * @returns {string} Debug string like 'terminal("x")'
     */
    toString() {
        return `terminal(${JSON.stringify(this.text)}${this.label ? `, label: ${JSON.stringify(this.label)}` : ''})`;
    }
}

module.exports = TerminalElement;